import { z } from 'zod';

// ============================================================
// Game Mode
// ============================================================
export const gameModeSchema = z.enum(['TRADICIONAL', 'CERCANAS', 'CAOS']);

// ============================================================
// Room Settings (Configuration)
// ============================================================
export const roomSettingsSchema = z.object({
  name: z.string().min(3).max(30),
  maxPlayers: z.number().int().min(3).max(10),
  mode: gameModeSchema,
  mainCategory: z.string(),
  subcategories: z.array(z.string()),
  isPublic: z.boolean().default(true),
  timers: z.object({
    clues: z.number().int().min(30).max(90),
    discuss: z.number().int().min(60).max(180),
    vote: z.number().int().min(15).max(60),
  }),
}).superRefine((data, ctx) => {
  if (data.mode === 'CAOS' && data.maxPlayers < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 4,
      type: 'number',
      inclusive: true,
      message: 'El Modo Caos requiere al menos 4 jugadores.',
      path: ['maxPlayers'],
    });
  }
});

// ============================================================
// Room Code (4-char alphanumeric, uppercase)
// ============================================================
export const roomCodeSchema = z
  .string()
  .length(4)
  .regex(/^[A-Z0-9]+$/)
  .toUpperCase();

// ============================================================
// Match Result (S2S: Game Server → API)
// ============================================================
export const matchResultSchema = z.object({
  roomId: z.string().uuid(),
  winnerSide: z.enum(['AGENTES', 'IMPOSTORES', 'CAOS']),
  mode: gameModeSchema,
  rounds: z.number().int().positive().default(1),
  players: z.array(
    z.object({
      playerId: z.string(), // Relaxed to z.string() to allow guest_ prefixes if needed
      pointsEarned: z.number().int(),
      role: z.string(),
      votedCorrectly: z.boolean().default(false),
      pointsPerMatch: z.number().int().default(0),
    })
  ),
});

// ============================================================
// Game Content (AI-Generated Words)
// ============================================================
export const gameContentSchema = z.object({
  mainWord: z.string(),
  infiltradoWord: z.string().nullable(),
  relatedWords: z.array(z.string()).nullable(),
});

// ============================================================
// Inferred Types
// ============================================================
export type RoomSettings = z.infer<typeof roomSettingsSchema>;
export type RoomCode = z.infer<typeof roomCodeSchema>;
export type MatchResult = z.infer<typeof matchResultSchema>;
export type GameContent = z.infer<typeof gameContentSchema>;
