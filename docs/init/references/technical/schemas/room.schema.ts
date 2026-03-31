import { z } from 'zod';

export const gameModeSchema = z.enum(['TRADICIONAL', 'CERCANAS', 'CAOS']);

export const roomSettingsSchema = z.object({
  name: z.string().min(3).max(30).toUpperCase(),
  maxPlayers: z.number().int().min(3).max(12),
  mode: gameModeSchema,
  mainCategory: z.string(),
  subcategories: z.array(z.string()),
  isPublic: z.boolean().default(true),
  timers: z.object({
    clues: z.number().int().min(15).max(120),
    discuss: z.number().int().min(30).max(300),
    vote: z.number().int().min(15).max(60),
  }),
});

export const roomCodeSchema = z.string().length(4).regex(/^[A-Z0-9]+$/).toUpperCase();

export const matchResultSchema = z.object({
  roomId: z.string().uuid(),
  winnerSide: z.enum(['AGENTES', 'IMPOSTORES', 'CAOS']),
  mode: gameModeSchema,
  players: z.array(z.object({
    playerId: z.string().uuid(),
    pointsEarned: z.number().int(),
    role: z.string()
  }))
});

export const gameContentSchema = z.object({
  mainWord: z.string(),
  infiltradoWord: z.string().nullable(),
  relatedWords: z.array(z.string()).nullable()
});

export type GameMode = z.infer<typeof gameModeSchema>;
export type RoomSettings = z.infer<typeof roomSettingsSchema>;
export type RoomCode = z.infer<typeof roomCodeSchema>;
export type GameContent = z.infer<typeof gameContentSchema>;
