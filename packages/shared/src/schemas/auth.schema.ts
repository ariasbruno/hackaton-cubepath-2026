import { z } from 'zod';
import { AVATAR_IDS } from '../constants/avatars';

// ============================================================
// User ID
// ============================================================
export const userIdSchema = z.string().uuid();

// ============================================================
// Login Request (Silent Auth)
// ============================================================
export const loginSchema = z.object({
  playerId: userIdSchema.optional(),
  nickname: z.string().min(2).max(20).optional(),
  avatar: z.enum(AVATAR_IDS).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// ============================================================
// User Profile (Public-facing)
// Note: `last_ip` is server-only and NOT in this schema.
// ============================================================
export const profileSchema = z.object({
  id: userIdSchema,
  nickname: z.string(),
  avatar: z.string(),
  color: z.string(),
  totalScore: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
});

// ============================================================
// Inferred Types
// ============================================================
export type UserId = z.infer<typeof userIdSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type UserProfile = z.infer<typeof profileSchema>;
