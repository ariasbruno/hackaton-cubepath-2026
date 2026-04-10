import type { RoomSettings, GamePhase, PlayerRole } from '@impostor/shared';

export interface ClueItem {
  playerId?: string;
  nickname?: string;
  avatar?: string;
  color?: string;
  text?: string;
  type?: 'clue' | 'divider';
  isMissed?: boolean;
}

export interface ChatMessage {
  playerId: string;
  nickname: string;
  avatar: string;
  color: string;
  text: string;
  timestamp: number;
}

// Player state living solely in RAM, tracking socket status.
export interface PlayerState {
  id: string;             // The unique Database player ID
  nickname: string;
  avatar: string;
  color: string;
  isReady: boolean;
  isConnected: boolean;
  socketId: string | null;  // Used to map back to Bun's ServerWebSocket
  disconnectTimer: ReturnType<typeof setTimeout> | null;
  // Game session specific state
  role?: PlayerRole;
  word?: string;
  isAlive: boolean;
  hasVoted: boolean;
  votedFor: string | null;
  votedAction?: 'VOTE' | 'LINK' | 'ACCUSE' | 'SKIP';
  votedTargets?: string[];
  pointsEarned: number; // Current session total
  lastMatchPoints: number; // Points gained in the last concluded match
  agentGames: number;
  agentPoints: number;
  impostorGames: number;
  impostorPoints: number;
  partnerId?: string; // Informational for Modo Caos
}

// Room state living solely in RAM
export interface RoomState {
  id: string;             // Room ID in DB
  code: string;           // 4-letter public code
  hostId: string;
  settings: RoomSettings;
  phase: GamePhase;
  players: PlayerState[];
  timerEndAt: number | null; // UNIX timestamp for phase termination
  // Active Match Context
  turnId: string | null;     // Current player giving a clue
  turnOrder: string[];       // Sequence of player IDs for the clue phase
  clues: ClueItem[];
  chatMessages: ChatMessage[];
  skipVotes: string[];       // IDs of players who voted to skip discussion
  // Results
  winner?: string | null;
  secretWord?: string | null;
  lastEliminatedId?: string | null;
  lastEliminatedIds?: string[];
  currentRound: number;
  scores?: Record<string, number>;
}
