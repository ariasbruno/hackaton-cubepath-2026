import { z } from 'zod';

export const userIdSchema = z.string().uuid();

export const loginSchema = z.object({
  playerId: userIdSchema.optional(),
  nickname: z.string().min(2).max(20).optional(),
  avatar: z.string().emoji().optional(),
});

export const profileSchema = z.object({
  id: userIdSchema,
  nickname: z.string(),
  avatar: z.string(),
  totalScore: z.number().int().nonnegative(),
  createdAt: z.date(),
});

export type UserId = z.infer<typeof userIdSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type UserProfile = z.infer<typeof profileSchema>;
