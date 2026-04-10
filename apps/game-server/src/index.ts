import { GameEvents, GAME_PHASES, clueSchema, castVoteSchema } from '@impostor/shared';
import { RoomManager } from './application/RoomManager';
import { HttpApiClient } from './infrastructure/HttpApiClient';
import { TimerService } from './application/TimerService';
import { GameStateMachine } from './application/GameStateMachine';
import { StartMatch } from './application/useCases/StartMatch';
import { PrepareMatchContent } from './application/useCases/PrepareMatchContent';
import { SubmitClue } from './application/useCases/SubmitClue';
import { CastVote } from './application/useCases/CastVote';
import { ConfirmRole } from './application/useCases/ConfirmRole';
import { ReturnToLobby } from './application/useCases/ReturnToLobby';
import { ApiContentService } from './infrastructure/ai/ApiContentService';
import type { ServerWebSocket } from 'bun';

const apiClient = new HttpApiClient();
const roomManager = new RoomManager(apiClient);
const timerService = new TimerService();

const aiService = new ApiContentService();
const preparer = new PrepareMatchContent(aiService);

let stateMachine: GameStateMachine;
let startMatch: StartMatch;
let submitClue: SubmitClue;
let castVote: CastVote;
let confirmRole: ConfirmRole;
let returnToLobby: ReturnToLobby;

interface WsData {
  playerId: string;
  roomId: string;
}

const server = Bun.serve<WsData>({
  port: process.env.PORT || 3001,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/health') {
      return new Response('Game Server is healthy\n');
    }

    if (url.pathname === '/internal/status') {
      const apiKey = req.headers.get('x-internal-key');
      const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
      
      if (!apiKey || apiKey !== INTERNAL_API_KEY) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const allRooms = roomManager.getAllRoomsSync();
      const status = {
        totalRooms: allRooms.length,
        totalPlayers: allRooms.reduce((acc: number, r) => acc + r.players.length, 0),
        rooms: allRooms.map((r) => ({
          code: r.code,
          phase: r.phase,
          playerCount: r.players.length,
          players: r.players.map((p) => ({
            id: p.id,
            nickname: p.nickname,
            avatar: p.avatar,
            color: p.color,
            isReady: p.isReady,
            isOnline: !!p.socketId
          }))
        }))
      };
      return new Response(JSON.stringify(status), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Attempt to upgrade to WebSocket
    // Extract playerId and roomId from url query
    const playerId = url.searchParams.get('playerId');
    const roomId = url.searchParams.get('roomId');

    if (playerId && roomId) {
      const upgraded = server.upgrade(req, {
        data: { playerId, roomId },
      });
      if (upgraded) {
        return undefined; // Bun expects undefined when upgrade is successful
      }
    }

    return new Response('Upgrade failed or missing params', { status: 400 });
  },
  websocket: {
    async open(ws) {
      const { playerId, roomId } = ws.data;
      console.log(`[WS] Open: Player ${playerId} joining Room ${roomId}`);

      try {
        // Subscribe the ws to the room's multicast channel
        ws.subscribe(roomId);
        
        let socketId = Math.random().toString(36).substring(7); // Temporary session id
        
        // This handles joining, reconnecting, and canceling the grace period timeout
        const room = await roomManager.joinPlayer(roomId, playerId, socketId);
        
        const sanitizedPlayers = room.players.map(p => {
          const { socketId, disconnectTimer, ...rest } = p;
          return rest;
        });

        const fullPayload = {
          ...room,
          players: room.players.map(p => {
            const { socketId, disconnectTimer, ...rest } = p;
            return rest;
          })
        };

        // Broadcast the updated room state to everyone
        server.publish(roomId, JSON.stringify({
          type: GameEvents.ROOM_UPDATE,
          payload: fullPayload
        }));

        // Send a SYNC specifically to this client
        ws.send(JSON.stringify({
          type: GameEvents.GAME_STATE_SYNC,
          payload: fullPayload
        }));

      } catch (error) {
        console.error(`[WS] Failed to join player ${playerId} to room ${roomId}`, error);
        ws.close(1008, 'Room configuration missing or invalid');
      }
    },

    message(ws, message) {
      const { playerId, roomId } = ws.data;
      try {
        const data = JSON.parse(message as string);
        console.log(`[WS] Message from ${playerId} in ${roomId}:`, data.type);
        
        switch (data.type) {
          case GameEvents.START_GAME: {
            startMatch.execute(data.payload.roomId, ws.data.playerId);
            break;
          }

          case GameEvents.TOGGLE_READY: {
            const room = roomManager.toggleReady(ws.data.roomId, ws.data.playerId);
            if (room) {
              stateMachine.broadcastState(room.id);
            }
            break;
          }

          case GameEvents.CONFIRM_ROLE: {
            const room = roomManager.getRoomSync(ws.data.roomId);
            if (room) {
              confirmRole.execute(room, ws.data.playerId);
            }
            break;
          }

          case GameEvents.SEND_CLUE: {
            const parsed = clueSchema.safeParse(data.payload);
            if (!parsed.success) {
              console.warn(`[WS] Invalid SEND_CLUE payload`);
              break;
            }
            const room = roomManager.getRoomSync(ws.data.roomId);
            if (room) {
              submitClue.execute(room, ws.data.playerId, parsed.data.text, server);
            }
            break;
          }

          case GameEvents.CAST_VOTE: {
            const parsed = castVoteSchema.safeParse(data.payload);
            if (!parsed.success) {
              console.warn(`[WS] Invalid CAST_VOTE payload:`, parsed.error);
              break;
            }
            const room = roomManager.getRoomSync(ws.data.roomId);
            if (room) {
              castVote.execute(room, ws.data.playerId, parsed.data);
            }
            break;
          }

          case GameEvents.SEND_CHAT: {
            const text = String(data.payload.text || '').trim();
            if (!text || text.length > 140) break;
            const room = roomManager.getRoomSync(ws.data.roomId);
            if (room && (room.phase === GAME_PHASES.DISCUSSING || room.phase === GAME_PHASES.LOBBY || room.phase === GAME_PHASES.RESULTS)) {
              const player = room.players.find(p => p.id === ws.data.playerId);
              const msg = { 
                playerId: ws.data.playerId,
                nickname: player?.nickname || 'Jugador',
                avatar: player?.avatar || '👤',
                color: player?.color || '#FFD166',
                text, 
                timestamp: Date.now() 
              };
               room.chatMessages.push(msg);
               if (room.chatMessages.length > 50) room.chatMessages.shift();
               // Multicast to everyone in room without sending whole room state
               server.publish(ws.data.roomId, JSON.stringify({
                 type: GameEvents.NEW_CHAT_MESSAGE,
                 payload: msg
               }));
             }
             break;
          }

            case GameEvents.SKIP_DISCUSSION: {
              const room = roomManager.getRoomSync(ws.data.roomId);
              if (room && room.phase === GAME_PHASES.DISCUSSING) {
                const pId = ws.data.playerId;
                if (room.skipVotes.includes(pId)) {
                  room.skipVotes = room.skipVotes.filter(id => id !== pId);
                } else {
                  room.skipVotes.push(pId);
                }

                // If all alive players skipped, transition to Voting
                const alivePlayers = room.players.filter(p => p.isAlive).length;
                if (room.skipVotes.length >= alivePlayers) {
                  stateMachine.transitionTo(room.code, GAME_PHASES.VOTING);
                } else {
                  // Broadcast state with sanitized players
                  const payload = {
                    ...room,
                    players: room.players.map(({ socketId, disconnectTimer, ...rest }) => rest)
                  };
                  server.publish(roomId, JSON.stringify({
                    type: GameEvents.ROOM_UPDATE,
                    payload
                  }));
                }
              }
              break;
            }

            case GameEvents.LEAVE_ROOM: {
              console.log(`[WS] Player ${playerId} is leaving room ${roomId} (Voluntary)`);
              // Let state machine handle game logic (turns, skip votes) BEFORE removal
              stateMachine.handlePlayerLeaving(roomId, playerId);
              const updated = roomManager.leaveRoom(roomId, playerId);
              if (updated) {
                console.log(`[WS] Broadcasting update after leave in ${roomId}. Remaining players: ${updated.players.length}`);
                // broadcastState is already called by handlePlayerLeaving, 
                // but we might need a fresh one after roomManager.leaveRoom 
                // just in case of host handover
                stateMachine.broadcastState(roomId);
              } else {
                console.log(`[WS] Room ${roomId} was deleted or not found after leave.`);
              }
              ws.close(1000, 'Bye');
              break;
            }

            case GameEvents.RETURN_TO_LOBBY: {
              const room = roomManager.getRoomSync(ws.data.roomId);
              if (room) {
                returnToLobby.execute(room, ws.data.playerId);
              }
              break;
            }

            case GameEvents.PROCEED_FROM_VOTE_REVEAL: {
              stateMachine.proceedFromVoteReveal(ws.data.roomId);
              break;
            }

            default:
            console.warn(`[WS] Unknown event type: ${data.type}`);
            break;
        }

      } catch (e) {
        console.error('Invalid WS message payload');
      }
    },

    close(ws, code, message) {
      const { playerId, roomId } = ws.data;
      console.log(`[WS] Close: Player ${playerId} (Room: ${roomId}) - Code: ${code}`);

      const disconnectedRoom = roomManager.handleDisconnectByPlayer(roomId, playerId);
      
      if (disconnectedRoom) {
        stateMachine.broadcastState(roomId);
      }
    },
  },
});

stateMachine = new GameStateMachine(roomManager, timerService, server);
startMatch = new StartMatch(roomManager, stateMachine, preparer);
submitClue = new SubmitClue(stateMachine);
castVote = new CastVote(stateMachine);
confirmRole = new ConfirmRole(stateMachine);
returnToLobby = new ReturnToLobby(stateMachine);

console.log(`🎮 Game Server (WebSocket) listening on port ${server.port}`);
