import type { RoomState, PlayerState } from '../../domain/models';
import type { GameStateMachine } from '../GameStateMachine';

export class ReturnToLobby {
  constructor(private readonly stateMachine: GameStateMachine) { }

  public execute(room: RoomState, playerId: string) {
    // Only host should be able to trigger this in a real competitive game, 
    // but for this party game, let's allow anyone or check host.
    // The user just said "pon un boton de continuar", implying everyone sees it.
    // If we want everyone to have to click it, we'd need a "ready" system for results too.
    // But usually one person (Host) returning everyone to lobby is fine.
    
    if (room.phase !== 'RESULTS') return;

    // Reset players state (alive, votes, etc) for a fresh match
    room.players.forEach((p: PlayerState) => {
      p.isAlive = true;
      p.role = undefined;
      p.word = undefined;
      p.votedFor = null;
      p.hasVoted = false;
      p.isReady = false;
    });

    console.log(`[ReturnToLobby] Player ${playerId} triggered return to lobby for room ${room.code}`);
    this.stateMachine.transitionTo(room.code, 'LOBBY');
  }
}
