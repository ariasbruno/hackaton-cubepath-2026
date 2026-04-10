import { z } from 'zod';
import { GAME_PHASES, PLAYER_ROLES, WINNER_SIDES } from '../constants/game';

// ============================================================
// Game Phase Enum
// Uses gerund form for consistency (ASSIGNING, DISCUSSING, VOTING)
// ============================================================
export const gamePhaseSchema = z.nativeEnum(GAME_PHASES);

// ============================================================
// Player Roles
// ============================================================
export const roleSchema = z.nativeEnum(PLAYER_ROLES);

// ============================================================
// Winner Side
// ============================================================
export const winnerSideSchema = z.nativeEnum(WINNER_SIDES);
