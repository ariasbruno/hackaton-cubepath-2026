import { randomUUID } from 'node:crypto';
import type { IPlayerRepository } from '../domain/IPlayerRepository';
import type { PlayerEntity } from '../domain/entities';
import { AVATAR_IDS } from '@impostor/shared';

// Interfaces for input data
export interface LoginInput {
  nickname?: string;
  avatar?: string;
  color?: string;
}

const DEFAULT_COLORS = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#073B4C'];
const DEFAULT_NAMES = ['Player', 'Guest', 'Anon', 'Gamer', 'Noob', 'Pro', 'Ghost'];

/**
 * Simple In-Memory Cache with TTL
 */
class MemoryCache<T> {
  private cache = new Map<string, { data: T; expires: number }>();
  
  constructor(private ttlMs: number) {
    // Periodic cleanup of expired entries
    setInterval(() => this.prune(), 60 * 1000); // Every minute
  }

  set(key: string, data: T) {
    this.cache.set(key, { data, expires: Date.now() + this.ttlMs });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  private prune() {
    const now = Date.now();
    let count = 0;
    this.cache.forEach((item, key) => {
      if (now > item.expires) {
        this.cache.delete(key);
        count++;
      }
    });
    if (count > 0) console.log(`[CACHE] Pruned ${count} expired entries`);
  }
}

export class AuthUseCase {
  private profileCache = new MemoryCache<PlayerEntity>(120 * 1000); // 120s TTL
  private verifyCache = new MemoryCache<PlayerEntity>(5 * 1000);    // 5s TTL for existence checks

  constructor(private readonly playerRepository: IPlayerRepository) {}

  /**
   * Generates a random initial profile for new players.
   */
  private generateRandomProfile(): { nickname: string; avatarId: string; color: string } {
    const avatarId = AVATAR_IDS[Math.floor(Math.random() * AVATAR_IDS.length)];
    const color = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
    const noun = DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)];
    const number = Math.floor(Math.random() * 9999) + 1;
    return {
      nickname: `${noun}${number}`,
      avatarId: avatarId,
      color: color,
    };
  }

  /**
   * Processes a login request.
   * Creates a new silent profile (transient if guest) and persists the IP.
   */
  async login(ip: string, input?: LoginInput): Promise<PlayerEntity> {
    const defaultProfile = this.generateRandomProfile();
    const isGuest = !input?.nickname;

    if (isGuest) {
      // Guest: Return a transient profile NOT saved to DB
      return {
        id: `guest_${randomUUID()}`,
        nickname: defaultProfile.nickname,
        avatar: input?.avatar || defaultProfile.avatarId,
        color: input?.color || defaultProfile.color,
        totalScore: 0,
        impostorGames: 0,
        agenteGames: 0,
        globalRank: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    // Explicit login for registered users (this would normally check credentials)
    // For now, if nickname is provided, we try to find it or create (legacy behavior)
    // In the NEW model, the client should call verify first.
    return this.playerRepository.create({
      nickname: input!.nickname!,
      avatar: input?.avatar || defaultProfile.avatarId,
      color: input?.color || defaultProfile.color,
      lastIp: ip
    });
  }

  /**
   * Registers a new persistent player.
   */
  async register(ip: string, input: LoginInput): Promise<PlayerEntity> {
    const defaultProfile = this.generateRandomProfile();
    const player = await this.playerRepository.create({
      nickname: input.nickname || defaultProfile.nickname,
      avatar: input.avatar || defaultProfile.avatarId,
      color: input.color || defaultProfile.color,
      lastIp: ip
    });

    // Invalidate caches
    this.verifyCache.set(player.id, player);
    this.profileCache.set(player.id, player);

    return player;
  }

  /**
   * Verifies if a player exists. Uses 5s cache.
   * Returns basic profile data for Home header.
   */
  async verify(id: string): Promise<Pick<PlayerEntity, 'id' | 'nickname' | 'avatar' | 'color' | 'totalScore'>> {
    if (id.startsWith('guest_')) {
      throw new Error('PlayerNotFound');
    }

    const cached = this.verifyCache.get(id) || this.profileCache.get(id);
    if (cached) {
      console.log(`[CACHE HIT] Verify: ${id}`);
      return {
        id: cached.id,
        nickname: cached.nickname,
        avatar: cached.avatar,
        color: cached.color,
        totalScore: cached.totalScore
      };
    }

    console.log(`[CACHE MISS] Verify: ${id}`);
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new Error('PlayerNotFound');
    }

    // Refresh activity in DB upon verification (cache miss)
    await this.playerRepository.touch(id);

    this.verifyCache.set(id, player);
    return {
      id: player.id,
      nickname: player.nickname,
      avatar: player.avatar,
      color: player.color,
      totalScore: player.totalScore
    };
  }

  /**
   * Retrieves a player profile by ID with full stats.
   * Uses Cache.
   */
  async getProfile(id: string): Promise<PlayerEntity> {
    if (id.startsWith('guest_')) {
        throw new Error('PlayerNotFound');
    }

    const cached = this.profileCache.get(id);
    let player: PlayerEntity | null = cached || null;

    if (!player) {
      console.log(`[CACHE MISS] Profile: ${id}`);
      player = await this.playerRepository.findById(id);
      if (!player) throw new Error('PlayerNotFound');
      this.profileCache.set(id, player);
    } else {
      console.log(`[CACHE HIT] Profile: ${id}`);
    }

    // Compute stats
    const totalVotes = player.totalVotes || 0;
    const correctVotes = player.correctVotes || 0;
    player.voteEfficacy = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;

    return player;
  }

  /**
   * Updates an existing player's profile.
   * Invalidates Cache.
   */
  async updateProfile(id: string, input: LoginInput): Promise<PlayerEntity> {
    if (id.startsWith('guest_')) {
        // Registering a new player from a guest session
        return this.playerRepository.create({
          nickname: input.nickname || `Guest${Math.floor(Math.random() * 1000)}`,
          avatar: input.avatar || AVATAR_IDS[0],
          color: input.color || DEFAULT_COLORS[0],
          lastIp: '0.0.0.0'
        });
    }

    const player = await this.getProfile(id); // Ensure exists
    
    if (!('update' in this.playerRepository)) {
        throw new Error('NotImplemented');
    }
    
    const updated = await this.playerRepository.update(
      id, 
      input.nickname || player.nickname, 
      input.avatar || player.avatar, 
      input.color || player.color
    );
    if (!updated) throw new Error('PlayerNotFound');

    // Invalidate Cache
    this.profileCache.set(id, updated); // Direct update in cache
    console.log(`[CACHE UPDATE] Profile: ${id}`);

    return updated;
  }
}
