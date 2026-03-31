import type { PlayerState, RoomState } from '../domain/models';
import type { IApiClient } from '../domain/IApiClient';

export class RoomManager {
  // In-memory state holding all active lobbies/games
  private rooms: Map<string, RoomState> = new Map();
  // Maps a playerId to a specific room & socketId for rapid lookups and reconnections
  private playerConnections: Map<string, { roomId: string, socketId: string | null }> = new Map();

  constructor(private readonly apiClient: IApiClient) {}

  public getRoomSync(code: string): RoomState | undefined {
    return this.rooms.get(code);
  }

  public getAllRoomsSync(): RoomState[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Retrieves an in-memory room, initializing it from the API if it hasn't been cached yet.
   */
  async getOrCreateRoom(code: string): Promise<RoomState> {
    const existing = this.rooms.get(code);
    if (existing) {
      return existing;
    }

    // Attempt to fetch from API
    const roomInfo = await this.apiClient.getRoomByCode(code);
    
    // Re-check map in case another request already initialized the room while we were awaiting
    const doubleCheck = this.rooms.get(code);
    if (doubleCheck) return doubleCheck;
    
    const newRoom: RoomState = {
      id: roomInfo.id,
      code: roomInfo.code,
      hostId: roomInfo.hostId,
      settings: roomInfo.settings,
      phase: 'LOBBY',
      players: [],
      timerEndAt: null,
      turnId: null,
      turnOrder: [],
      clues: [],
      chatMessages: [],
      skipVotes: [],
      currentRound: 1
    };
    
    this.rooms.set(code, newRoom);
    return newRoom;
  }

  /**
   * Joins a player to a room, fetching their profile from the API if needed.
   */
  async joinPlayer(code: string, playerId: string, socketId: string): Promise<RoomState> {
    const room = await this.getOrCreateRoom(code);
    const existingPlayerIndex = room.players.findIndex(p => p.id === playerId);

    if (existingPlayerIndex !== -1) {
      // Reconnection or duplicate connection
      const p = room.players[existingPlayerIndex];
      p.socketId = socketId;
      p.isConnected = true;
      if (p.disconnectTimer) {
        clearTimeout(p.disconnectTimer);
        p.disconnectTimer = null;
      }
    } else {
      // New Join
      // HARD ENFORCEMENT: Guests cannot join rooms
      if (playerId.startsWith('guest_')) {
          throw new Error('REGISTRATION_REQUIRED');
      }

      const playerInfo = await this.apiClient.getPlayerById(playerId);
      
      // ENFORCEMENT: Max Players Limit
      if (room.players.length >= room.settings.maxPlayers) {
          throw new Error('ROOM_FULL');
      }

      // Re-check after await to avoid race conditions with concurrent joins for the same player
      if (room.players.some(p => p.id === playerId)) {
        const p = room.players.find(pl => pl.id === playerId)!;
        p.socketId = socketId;
        p.isConnected = true;
        this.playerConnections.set(playerId, { roomId: code, socketId });
        return room;
      }

      const isHost = room.hostId === playerId; 

      room.players.push({
        id: playerId,
        nickname: playerInfo.nickname,
        avatar: playerInfo.avatar,
        color: playerInfo.color,
        isReady: isHost, // Optionally host is automatically ready
        isConnected: true,
        socketId,
        disconnectTimer: null,
        isAlive: true,
        hasVoted: false,
        votedFor: null,
        pointsEarned: 0,
        lastMatchPoints: 0,
        agentGames: 0,
        agentPoints: 0,
        impostorGames: 0,
        impostorPoints: 0,
      });
    }

    this.playerConnections.set(playerId, { roomId: code, socketId });
    return room;
  }

  /**
   * Handles Player disconnection safely using the grace period algorithm.
   */
  handleDisconnectByPlayer(roomId: string, playerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return null;

    // Grace Period Strategy
    player.isConnected = false;
    player.socketId = null;

    player.disconnectTimer = setTimeout(() => {
      this.permanentlyRemovePlayer(roomId, playerId);
    }, 30000); // 30 seconds stringly grace period

    return room; // Returning room to allow index.ts to broadcast update
  }

  /**
   * Permanently ejects a player. Handles room deletion if empty and host handover.
   */
  private permanentlyRemovePlayer(roomId: string, playerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== playerId);
    room.turnOrder = room.turnOrder.filter(id => id !== playerId);
    room.skipVotes = (room.skipVotes || []).filter(id => id !== playerId);
    this.playerConnections.delete(playerId);

    // 1. If room is empty, delete it immediately from memory and DB
    if (room.players.length === 0) {
      console.log(`[RoomManager] Room ${roomId} (ID: ${room.id}) is empty. Deleting.`);
      this.rooms.delete(roomId);
      this.apiClient.deleteRoom(room.id).catch(e => console.error(`Failed to delete room from DB: ${e.message}`));
      return;
    }

    // 2. If all remaining players are disconnected (grace period), delete room
    if (room.players.every(p => !p.isConnected)) {
        console.log(`[RoomManager] Room ${roomId} (ID: ${room.id}) has only disconnected players. Deleting.`);
        this.rooms.delete(roomId);
        this.apiClient.deleteRoom(room.id).catch(e => console.error(`Failed to delete room from DB: ${e.message}`));
        return;
    }

    // 3. If leaving player was the host, assign a new host from remaining players
    if (room.hostId === playerId) {
      console.log(`[RoomManager] Host ${playerId} left room ${roomId}. Attempting handover.`);
      const nextHost = room.players.find(p => p.isConnected) || room.players[0];
      if (nextHost) {
        room.hostId = nextHost.id;
        nextHost.isReady = true; 
        console.log(`[RoomManager] New host assigned: ${nextHost.nickname} (${nextHost.id})`);
      }
    }
  }

  /**
   * Explicitly requested leave (Voluntary exit)
   */
  public leaveRoom(roomId: string, playerId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      if (player.disconnectTimer) {
        clearTimeout(player.disconnectTimer);
      }
      this.permanentlyRemovePlayer(roomId, playerId);
    }
    
    return this.rooms.get(roomId) || null;
  }
  
  public toggleReady(roomId: string, playerId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    const player = room.players.find(p => p.id === playerId);
    if (player && room.hostId !== playerId) {
      player.isReady = !player.isReady;
    }
    
    return room;
  }

  getRoomForSocket(socketId: string) {
      let foundRoomId: string | null = null;
      for (const [, conn] of this.playerConnections.entries()) {
        if (conn.socketId === socketId) {
          foundRoomId = conn.roomId;
          break;
        }
      }
      return foundRoomId ? this.rooms.get(foundRoomId) : null;
  }
}
