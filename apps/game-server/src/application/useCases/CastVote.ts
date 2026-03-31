import type { RoomState } from '../../domain/models';
import type { GameStateMachine } from '../GameStateMachine';
import type { VotePayload } from '@impostor/shared';

export class CastVote {
  constructor(private readonly stateMachine: GameStateMachine) {}

  public execute(
    room: RoomState,
    playerId: string,
    voteData: VotePayload
  ) {
    if (room.phase !== 'VOTING') {
      console.warn(`[CastVote] Player ${playerId} tried to vote outside voting phase.`);
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) {
      console.warn(`[CastVote] Dead or unknown player trying to vote: ${playerId}`);
      return;
    }

    // Save vote
    player.votedFor = voteData.targets[0] || null; // For VOTE and LINK actions
    player.votedAction = voteData.action;
    player.votedTargets = voteData.targets;
    player.hasVoted = voteData.confirm;

    // We can broadcast partial state updates if we want (e.g. "player X has voted")
    // For now we broadcast the whole state seamlessly
    this.stateMachine.broadcastState(room.code);

    // If everyone who is alive has voted and confirmed, we could optionally transition early
    const alivePlayers = room.players.filter(p => p.isAlive);
    const allVoted = alivePlayers.every(p => p.hasVoted);

    if (allVoted) {
      console.log(`[CastVote] All alive players voted in room ${room.code}. Progressing to elimination.`);
      this.stateMachine.handleVotingEnd(room.code);
    }
  }
}
