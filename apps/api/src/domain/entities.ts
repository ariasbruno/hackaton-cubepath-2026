import type { RoomSettings, WinnerSide, GameMode, PlayerRole, RoomStatus } from '@impostor/shared';

export type { RoomStatus };

export interface PlayerEntity {
  id: string; // UUID
  nickname: string;
  avatar: string;
  color: string;
  totalScore: number;
  lastIp?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Statistics
  impostorGames?: number;
  agenteGames?: number;
  infiltradoGames?: number;
  dispersoGames?: number;
  vinculadoGames?: number;
  totalVotes?: number;
  correctVotes?: number;
  globalRank?: number;
  voteEfficacy?: number; // (correctVotes / totalVotes) * 100
}

export interface RoomEntity {
  id: string; // UUID
  code: string;
  hostId: string; // UUID of PlayerEntity
  settings: RoomSettings; // Nested JSONB object
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchEntity {
  id: string; // UUID
  roomId: string; // UUID of RoomEntity
  mode: GameMode;
  winnerSide: WinnerSide;
  rounds: number;
  createdAt: Date;
}

export interface MatchPlayerEntity {
  id: string; // UUID
  matchId: string; // UUID of MatchEntity
  playerId: string; // UUID of PlayerEntity
  role: PlayerRole;
  points: number;
  votedCorrectly?: boolean;
}
