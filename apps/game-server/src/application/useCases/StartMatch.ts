import { GAME_PHASES, GAME_MODES } from '@impostor/shared';
import type { GameStateMachine } from '../GameStateMachine';
import type { RoomManager } from '../RoomManager';
import type { PrepareMatchContent } from './PrepareMatchContent';

export class StartMatch {
  constructor(
    private readonly roomManager: RoomManager,
    private readonly stateMachine: GameStateMachine,
    private readonly preparer: PrepareMatchContent
  ) {}

  public async execute(roomId: string, initiatorId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room) {
      console.warn(`[StartMatch] Logic error: room ${roomId} not found`);
      return;
    }

    if (room.hostId !== initiatorId) {
      console.warn(`[StartMatch] Access denied: player ${initiatorId} is not host of ${roomId}`);
      return;
    }

    if (room.phase !== GAME_PHASES.LOBBY && room.phase !== GAME_PHASES.RESULTS) {
      console.warn(`[StartMatch] Game in progress for ${roomId}`);
      return;
    }

    if (room.players.length < 3) {
      console.warn(`[StartMatch] Not enough players in ${roomId} (Need 3)`);
      this.stateMachine.broadcastError(roomId, 'Se necesitan al menos 3 jugadores para empezar.');
      return; 
    }

    if (room.settings.mode === GAME_MODES.CAOS && room.players.length < 4) {
      console.warn(`[StartMatch] Not enough players for CAOS mode in ${roomId} (Need 4)`);
      this.stateMachine.broadcastError(roomId, 'El Modo Caos requiere al menos 4 jugadores.');
      return;
    }

    if (room.players.length > 10) {
      console.warn(`[StartMatch] Too many players in ${roomId} (Max 10)`);
      this.stateMachine.broadcastError(roomId, 'Máximo 10 jugadores permitidos por partida.');
      return;
    }

    try {
      // Reach out to AI or Fallback logic to get words, then assign to players based on mode.
      await this.preparer.execute(room);
      this.stateMachine.transitionTo(roomId, GAME_PHASES.ASSIGNING);
    } catch (error) {
      console.error(`[StartMatch] Critical error starting match in ${roomId}:`, error);
      this.stateMachine.broadcastError(roomId, 'Error crítico al preparar la partida. Reintenta.');
    }
  }
}
