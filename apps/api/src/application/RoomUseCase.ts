import type { IRoomRepository } from '../domain/IRoomRepository';
import type { IPlayerRepository } from '../domain/IPlayerRepository';
import type { RoomEntity } from '../domain/entities';
import type { RoomSettings } from '@impostor/shared';

export class RoomUseCase {
  constructor(
    private readonly roomRepository: IRoomRepository,
    private readonly playerRepository: IPlayerRepository
  ) {}

  /**
   * Generates a random 4-letter uppercase code.
   * Excluding confusing letters like O/0, I/1.
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new game room with a unique 4-letter code.
   */
  async createRoom(hostId: string, settings: RoomSettings): Promise<RoomEntity> {
    // Silent capping
    settings.maxPlayers = Math.max(3, Math.min(10, settings.maxPlayers));
    
    if (settings.timers) {
      settings.timers.clues = Math.max(30, Math.min(90, settings.timers.clues));
      settings.timers.discuss = Math.max(60, Math.min(180, settings.timers.discuss));
      settings.timers.vote = Math.max(15, Math.min(60, settings.timers.vote));
    }

    // Check if host exists (deleted sessions enforcement)
    // Guest IDs are allowed for local games? No, room creation is for online.
    const player = await this.playerRepository.findById(hostId);
    if (!player) {
        throw new Error('PlayerNotFound');
    }

    let code = '';
    let isUnique = false;
    let attempts = 0;

    // Retry loop for unique code generation
    while (!isUnique && attempts < 10) {
      code = this.generateRoomCode();
      const existing = await this.roomRepository.findByCode(code);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('CodeGenerationFailed');
    }

    return this.roomRepository.create({ code, hostId, settings });
  }

  /**
   * Lists all public rooms currently in LOBBY status.
   * Enriches the DB data with real-time player count from the Game Server.
   */
  async listPublicRooms(limit: number = 20): Promise<any[]> {
    const dbRooms = await this.roomRepository.getPublicLobbies(limit);
    
    try {
      // Attempt to fetch live status from Game Server
      const GAME_SERVER_URL = process.env.VITE_WS_URL?.replace('ws://', 'http://') || 'http://localhost:3001';
      const response = await fetch(`${GAME_SERVER_URL}/admin/status`);
      if (response.ok) {
        const liveStatus = await response.json();
        const countsByCode = liveStatus.rooms.reduce((acc: any, room: any) => {
          acc[room.code] = room.playerCount;
          return acc;
        }, {});

        return dbRooms.map(room => ({
          ...room,
          playerCount: countsByCode[room.code] || 0
        }));
      }
    } catch (e: any) {
      console.warn(`[RoomUseCase] Could not fetch live status from Game Server`, e?.message);
    }

    // Default to 0 if server is unreachable
    return dbRooms.map(room => ({ ...room, playerCount: 0 }));
  }

  /**
   * Admin: Lists ALL rooms regardless of status.
   */
  async getAllRooms(): Promise<(RoomEntity & { hostNickname?: string, participants?: string[] })[]> {
    return this.roomRepository.findAll();
  }

  /**
   * Validates if a room code exists and is accessible.
   */
  async validateRoom(code: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new Error('RoomNotFound');
    }
    
    if (room.status === 'FINISHED') {
      throw new Error('RoomFinished');
    }
    
    return room;
  }

  /**
   * Deletes a room from the DB.
   */
  async deleteRoom(id: string): Promise<void> {
    await this.roomRepository.delete(id);
  }
}
