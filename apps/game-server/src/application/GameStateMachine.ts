import type { GamePhase } from '@impostor/shared';
import type { RoomManager } from './RoomManager';
import type { TimerService } from './TimerService';
import { GameEvents, type MatchResult } from '@impostor/shared';
import type { Server } from 'bun';
import { ScoringRules } from '../domain/ScoringRules';
import type { PlayerState, RoomState } from '../domain/models';

export class GameStateMachine {
  constructor(
    private readonly roomManager: RoomManager,
    private readonly timerService: TimerService,
    private readonly server: Server<any>
  ) { }

  /**
   * Orchestrates the transition of a room to a new phase.
   */
  public transitionTo(roomId: string, nextPhase: GamePhase) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room) return;

    room.phase = nextPhase;
    this.timerService.clearTimer(roomId);

    switch (nextPhase) {
      case 'LOBBY':
        room.timerEndAt = null;
        break;

      case 'ASSIGNING':
        room.clues = [];
        room.chatMessages = [];
        room.currentRound = 1;
        room.players.forEach(p => {
          p.hasVoted = false;
          p.votedFor = null;
          p.isReady = false;
        });
        // Start a 15s timer to force players to reveal their roles
        room.timerEndAt = this.timerService.startTimer(roomId, 15, () => {
          this.transitionTo(roomId, 'CLUES');
        });
        break;

      case 'CLUES':
        // Add round divider at the start of every Clues phase
        room.clues.push({ type: 'divider', text: `Ronda ${room.currentRound}` });

        // Find first alive player
        const firstAlive = room.turnOrder.find(id => {
          const p = room.players.find(pl => pl.id === id);
          return p && p.isAlive;
        });
        room.turnId = firstAlive || null;
        console.log(`[GameStateMachine] Entering CLUES Ronda ${room.currentRound}. First turn: ${room.turnId}`);
        this.startTurnTimer(room);
        break;

      case 'DISCUSSING':
        room.skipVotes = [];
        room.timerEndAt = this.timerService.startTimer(roomId, room.settings.timers.discuss, () => {
          this.transitionTo(roomId, 'VOTING');
        });
        break;

      case 'VOTING':
        room.timerEndAt = this.timerService.startTimer(roomId, room.settings.timers.vote, () => {
          this.handleVotingEnd(roomId);
        });
        break;

      case 'VOTE_REVEAL':
        // Automatic transition after reveal duration (e.g. 6 seconds)
        room.timerEndAt = this.timerService.startTimer(roomId, 6, () => {
          this.proceedFromVoteReveal(roomId);
        });
        break;

      case 'RESULTS': {
        const scoring = new ScoringRules();
        const condition = scoring.evaluateWinCondition(room);
        scoring.calculatePoints(room, condition);

        const isCaos = room.settings.mode === 'CAOS';
        let side: 'AGENTES' | 'IMPOSTORES' | 'CAOS' = 'AGENTES';
        if (isCaos) {
          side = condition.winnerTeam === 'IMPOSTOR' ? 'CAOS' : 'AGENTES';
        } else {
          side = condition.winnerTeam === 'IMPOSTOR' ? 'IMPOSTORES' : 'AGENTES';
        }

        room.winner = side;
        room.scores = room.players.reduce((acc, p) => ({ ...acc, [p.id]: p.pointsEarned }), {});

        const payload: MatchResult = {
          roomId: room.id,
          winnerSide: side as 'AGENTES' | 'IMPOSTORES' | 'CAOS',
          mode: room.settings.mode,
          rounds: 1,
          players: room.players.map((p: PlayerState) => {
            const target = room.players.find(pl => pl.id === p.votedFor);
            const votedCorrectly = !!target && (target.role === 'IMPOSTOR' || target.role === 'INFILTRADO');

            return {
              playerId: p.id,
              role: p.role || 'AGENTE',
              pointsEarned: p.pointsEarned,
              votedCorrectly,
              pointsPerMatch: p.lastMatchPoints
            };
          })
        };

        const API_URL = process.env.INTERNAL_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${API_URL}/internal/matches/archive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-key': process.env.INTERNAL_API_KEY || 'default_secret'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.error(`[GameStateMachine] Failed broadcasting Match Result DB:`, err));

        // No timer. Stays in RESULTS until Host manually calls RETURN_TO_LOBBY or START_GAME.
        room.timerEndAt = null;
        break;
      }
    }

    // Broadcast the state change to all clients in the room
    this.broadcastState(roomId);

    console.log(`[GameStateMachine] Room ${roomId} transition -> ${nextPhase}`);
  }

  public advanceTurn(roomId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room || room.phase !== 'CLUES') return;

    this.timerService.clearTimer(roomId);

    // Check if player whose turn just ended submitted a clue this round
    const lastPlayerId = room.turnId;
    if (lastPlayerId) {
      let lastDivIdx = -1;
      for (let i = room.clues.length - 1; i >= 0; i--) {
        if (room.clues[i].type === 'divider') { lastDivIdx = i; break; }
      }
      const currentRoundClues = room.clues.slice(lastDivIdx + 1);
      const hasSubmitted = currentRoundClues.some(c => c.playerId === lastPlayerId);

      if (!hasSubmitted) {
        const p = room.players.find(pl => pl.id === lastPlayerId);
        room.clues.push({
          playerId: lastPlayerId,
          text: '[No envió pista]',
          nickname: p?.nickname || 'Jugador',
          avatar: p?.avatar || '👤',
          color: p?.color,
          type: 'clue',
          isMissed: true
        });
      }
    }

    const currentIndex = room.turnOrder.indexOf(room.turnId || '');
    let nextIndex = currentIndex + 1;

    // Skip only dead players (Alive players must have their turn even if disconnected/reconnecting)
    while (nextIndex < room.turnOrder.length) {
      const nextId = room.turnOrder[nextIndex];
      const p = room.players.find(pl => pl.id === nextId);
      if (p && p.isAlive) break;
      nextIndex++;
    }

    if (nextIndex < room.turnOrder.length) {
      room.turnId = room.turnOrder[nextIndex];
      this.startTurnTimer(room);
      this.broadcastState(roomId);
    } else {
      // Last clue submitted! 
      // Important: nullify turnId to stop showing "X's turn"
      room.turnId = null;
      
      // Let everyone see the last clue for 3 seconds before moving to debate
      // We update the timer to 3s so the header shows the countdown
      room.timerEndAt = this.timerService.startTimer(roomId, 3, () => {
        this.transitionTo(roomId, 'DISCUSSING');
      });

      this.broadcastState(roomId);
    }
  }

  public handleVotingEnd(roomId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room) return;

    const scoring = new ScoringRules();
    const targetedId = scoring.getEliminationTarget(room);

    if (targetedId) {
      if (room.settings.mode === 'CAOS') {
        const vinculados = room.players.filter(p => p.role === 'VINCULADO');
        room.lastEliminatedIds = vinculados.map(p => p.id);
        vinculados.forEach(v => v.isAlive = false);
        room.lastEliminatedId = targetedId; 

        // CRITICAL: Determine winner side RIGHT NOW so reveal screens know who won
        const condition = scoring.evaluateWinCondition(room);
        room.winner = condition.winnerTeam === 'IMPOSTOR' ? 'CAOS' : 'AGENTES';
        
        console.log(`[GameStateMachine] Caos pair revealed: ${room.lastEliminatedIds.join(', ')}. Win state: ${room.winner}`);
      } else {
        const target = room.players.find(p => p.id === targetedId);
        if (target) {
          target.isAlive = false;
          room.lastEliminatedId = targetedId;
          console.log(`[GameStateMachine] Player ${target.nickname} eliminated in ${room.code}. Transitioning to Reveal.`);
        }
      }
    } else {
      room.lastEliminatedId = null;
      room.lastEliminatedIds = [];
      console.log(`[GameStateMachine] Tie or Skip majority. No one eliminated in ${room.code}. Transitioning to Reveal.`);
    }

    this.transitionTo(roomId, 'VOTE_REVEAL');
  }

  public proceedFromVoteReveal(roomId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room || room.phase !== 'VOTE_REVEAL') return;

    const scoring = new ScoringRules();
    const condition = scoring.evaluateWinCondition(room);

    if (condition.isGameOver) {
      this.transitionTo(roomId, 'RESULTS');
    } else {
      // CLEAR VOTES for next round
      room.players.forEach(p => {
        p.hasVoted = false;
        p.votedFor = null;
      });
      room.currentRound++;
      // LOOP BACK TO CLUES
      this.transitionTo(roomId, 'CLUES');
    }
  }

  private startTurnTimer(room: RoomState) {
    room.timerEndAt = this.timerService.startTimer(room.code, room.settings.timers.clues, () => {
      this.advanceTurn(room.code);
    });
  }

  public handlePlayerLeaving(roomId: string, playerId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room) return;

    console.log(`[GameStateMachine] Handling leave of player ${playerId} in room ${room.code} (Phase: ${room.phase})`);

    // 1. Logic per phase
    switch (room.phase) {
      case 'CLUES':
        if (room.turnId === playerId) {
          const currentIndex = room.turnOrder.indexOf(playerId);
          console.log(`[GameStateMachine] Player who left had the turn (Index: ${currentIndex}). Advancing.`);

          // Remove from turnOrder FIRST so advanceTurn doesn't find them
          room.turnOrder = room.turnOrder.filter(id => id !== playerId);

          if (currentIndex < room.turnOrder.length) {
            // The next player is now at the same index
            room.turnId = room.turnOrder[currentIndex];
            this.startTurnTimer(room);
          } else {
            // No one left in the turn order after this index
            room.turnId = null;
            this.transitionTo(roomId, 'DISCUSSING');
          }
        } else {
          // Just remove them from turnOrder
          room.turnOrder = room.turnOrder.filter(id => id !== playerId);
        }
        break;

      case 'DISCUSSING':
        // Update skipVotes
        room.skipVotes = room.skipVotes.filter(id => id !== playerId);
        const alivePlayers = room.players.filter(p => p.isAlive).length;
        if (room.skipVotes.length >= alivePlayers && alivePlayers > 0) {
          console.log(`[GameStateMachine] Everyone (remaining) voted to skip. Transitioning.`);
          this.transitionTo(roomId, 'VOTING');
        }
        break;

      case 'ASSIGNING':
        // Recalculate if we can move to CLUES now
        const allReady = room.players.every(p => p.isReady || !p.isConnected);
        if (allReady && room.players.length > 0) {
          this.transitionTo(roomId, 'CLUES');
        }
        break;

      case 'VOTING':
        // Check if everyone remaining has voted
        const remainingAlive = room.players.filter(p => p.isAlive);
        if (remainingAlive.every(p => p.hasVoted) && remainingAlive.length > 0) {
          console.log(`[GameStateMachine] Everyone (remaining) voted. Transitioning to RESULTS.`);
          this.transitionTo(roomId, 'RESULTS');
        }
        break;
    }

    // Always broadcast update
    this.broadcastState(roomId);
  }

  public broadcastState(roomId: string) {
    const room = this.roomManager.getRoomSync(roomId);
    if (!room) return;

    this.server.publish(roomId, JSON.stringify({
      type: GameEvents.ROOM_UPDATE,
      payload: room
    }));
  }

  public broadcastError(roomId: string, message: string) {
    this.server.publish(roomId, JSON.stringify({
      type: GameEvents.ERROR,
      payload: { message }
    }));
  }
}
