import type { RoomState } from '../../domain/models';
import type { GameStateMachine } from '../GameStateMachine';

export class ConfirmRole {
  constructor(private readonly stateMachine: GameStateMachine) {}

  public execute(room: RoomState, playerId: string) {
    if (room.phase !== 'ASSIGNING') return;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return;

    player.isReady = true;

    // Verify total account of alive players
    const alivePlayers = room.players.filter(p => p.isAlive);
    const readyPlayers = alivePlayers.filter(p => p.isReady);
    
    const allReady = readyPlayers.length === alivePlayers.length;
    
    if (allReady) {
      console.log(`[ConfirmRole] All ${alivePlayers.length} players ready in room ${room.code}. Transitioning to CLUES.`);
      this.stateMachine.transitionTo(room.code, 'CLUES');
    } else {
      console.log(`[ConfirmRole] Player ${playerId} confirmed. Ready: ${readyPlayers.length}/${alivePlayers.length}.`);
      this.stateMachine.broadcastState(room.code);
    }
  }
}
