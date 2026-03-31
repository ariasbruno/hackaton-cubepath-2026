/**
 * WebSocket Event Names
 *
 * Single source of truth for all WS event names used between
 * Game Server (Server 1) and Frontend.
 *
 * Import: import { GameEvents } from '@impostor/shared';
 */
export const GameEvents = {
  // ── Client → Server ────────────────────────────────────
  JOIN_ROOM: 'JOIN_ROOM',
  TOGGLE_READY: 'TOGGLE_READY',
  SEND_LOBBY_CHAT: 'SEND_LOBBY_CHAT',
  START_GAME: 'START_GAME',
  CONFIRM_ROLE: 'CONFIRM_ROLE',
  SEND_CLUE: 'SEND_CLUE',
  SEND_CHAT: 'SEND_CHAT',
  CAST_VOTE: 'CAST_VOTE',
  RECONNECT_SESSION: 'RECONNECT_SESSION',
  LEAVE_ROOM: 'LEAVE_ROOM',
  SKIP_DISCUSSION: 'SKIP_DISCUSSION',
  RETURN_TO_LOBBY: 'RETURN_TO_LOBBY',
  PROCEED_FROM_VOTE_REVEAL: 'PROCEED_FROM_VOTE_REVEAL',

  // ── Server → Client ────────────────────────────────────
  ROOM_UPDATE: 'ROOM_UPDATE',
  NEW_LOBBY_MESSAGE: 'NEW_LOBBY_MESSAGE',
  ERROR: 'ERROR',
  ROLE_ASSIGNED: 'ROLE_ASSIGNED',
  PHASE_CHANGE: 'PHASE_CHANGE',
  TIMER_TICK: 'TIMER_TICK',
  NEW_CLUE: 'NEW_CLUE',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  VOTE_UPDATED: 'VOTE_UPDATED',
  VOTING_COMPLETE: 'VOTING_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  GAME_STATE_SYNC: 'GAME_STATE_SYNC',
} as const;

export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];
