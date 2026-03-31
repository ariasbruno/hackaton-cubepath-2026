import type { RoomState } from '../../domain/models';
import type { GameStateMachine } from '../GameStateMachine';
import { GameEvents } from '@impostor/shared';
import type { ServerWebSocket } from 'bun';

export class SubmitClue {
  constructor(private readonly stateMachine: GameStateMachine) {}

  public execute(
    room: RoomState,
    playerId: string,
    text: string,
    server: Omit<ServerWebSocket<any>, never> | any
  ) {
    if (room.phase !== 'CLUES') {
      console.warn(`[SubmitClue] Cannot submit clue in phase ${room.phase}`);
      return;
    }

    if (room.turnId !== playerId) {
      console.warn(`[SubmitClue] Refusal: Room turnId is ${room.turnId}, but Player ${playerId} sent a clue.`);
      return;
    }
    console.log(`[SubmitClue] Success: Player ${playerId} submitted: ${text}`);

    // Add exactly this clue
    const player = room.players.find(p => p.id === playerId);
    room.clues.push({ 
      playerId, 
      text,
      nickname: player?.nickname || 'Jugador',
      avatar: player?.avatar || '👤',
      color: player?.color,
      type: 'clue'
    });

    // Figure out next turn
    this.stateMachine.advanceTurn(room.code);
  }
}
