import { z } from 'zod';

// ============================================================
// Game Phase Enum
// Uses gerund form for consistency (ASSIGNING, DISCUSSING, VOTING)
// ============================================================
export const gamePhaseSchema = z.enum([
  'LOBBY',
  'ASSIGNING',
  'CLUES',
  'DISCUSSING',
  'VOTING',
  'VOTE_REVEAL',
  'RESULTS',
]);

export type GamePhase = z.infer<typeof gamePhaseSchema>;

// ============================================================
// Player Roles
// ============================================================
export const roleSchema = z.enum([
  'AGENTE',
  'IMPOSTOR',
  'INFILTRADO',
  'VINCULADO',
  'DISPERSO',
]);

export type Role = z.infer<typeof roleSchema>;

// ============================================================
// Winner Side
// ============================================================
export const winnerSideSchema = z.enum(['AGENTES', 'IMPOSTORES', 'CAOS']);

export type WinnerSide = z.infer<typeof winnerSideSchema>;
