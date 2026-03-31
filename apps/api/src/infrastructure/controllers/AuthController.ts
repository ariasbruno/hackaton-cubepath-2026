import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '@impostor/shared';
import type { AuthUseCase } from '../../application/AuthUseCase';
import { loginLimiter, sessionLimiter, verifyLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

export function createAuthController(authUseCase: AuthUseCase) {
  const router = new Hono<{ Variables: { clientIp: string } }>();

  /**
   * POST /auth/login
   * Silent login. Generates profile and stores IP for auditing.
   */
  router.post('/login', loginLimiter, zValidator('json', loginSchema.optional()), async (c) => {
    const input = c.req.valid('json') || {};
    const ip = c.get('clientIp');

    try {
      const player = await authUseCase.login(ip, input);
      return c.json({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        color: player.color,
        totalScore: player.totalScore,
        impostorGames: player.impostorGames,
        agenteGames: player.agenteGames,
        infiltradoGames: player.infiltradoGames,
        dispersoGames: player.dispersoGames,
        vinculadoGames: player.vinculadoGames,
        totalVotes: player.totalVotes,
        correctVotes: player.correctVotes,
        globalRank: player.globalRank,
        createdAt: player.createdAt,
      }, 201);
    } catch (error) {
      return c.json({ error: 'Failed to create profile' }, 500);
    }
  });

  /**
   * GET /auth/verify/:id
   * Explicit check if user exists. Rate-limited 1/3s.
   */
  router.get('/verify/:id', verifyLimiter, async (c) => {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Missing ID' }, 400);

    try {
      const player = await authUseCase.verify(id);
      return c.json({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        color: player.color,
        totalScore: player.totalScore,
      });
    } catch (error: any) {
      if (error.message === 'PlayerNotFound') {
        return c.json({ error: 'Player not found' }, 404);
      }
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  /**
   * POST /auth/register
   * Create a persistent profile.
   */
  router.post('/register', loginLimiter, zValidator('json', loginSchema), async (c) => {
    const input = c.req.valid('json');
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';

    try {
      const player = await authUseCase.register(ip, input);
      return c.json({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        color: player.color,
        totalScore: player.totalScore,
        impostorGames: player.impostorGames,
        agenteGames: player.agenteGames,
        infiltradoGames: player.infiltradoGames,
        dispersoGames: player.dispersoGames,
        vinculadoGames: player.vinculadoGames,
        totalVotes: player.totalVotes,
        correctVotes: player.correctVotes,
        globalRank: player.globalRank,
        createdAt: player.createdAt,
      }, 201);
    } catch (error: any) {
      return c.json({ error: 'Failed to register' }, 500);
    }
  });

  /**
   * GET /auth/me/:id
   * Fetch current profile.
   */
  router.get('/me/:id', sessionLimiter, async (c) => {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Missing ID' }, 400);

    try {
      const player = await authUseCase.getProfile(id);
      return c.json({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        color: player.color,
        totalScore: player.totalScore,
        impostorGames: player.impostorGames,
        agenteGames: player.agenteGames,
        infiltradoGames: player.infiltradoGames,
        dispersoGames: player.dispersoGames,
        vinculadoGames: player.vinculadoGames,
        totalVotes: player.totalVotes,
        correctVotes: player.correctVotes,
        globalRank: player.globalRank,
        voteEfficacy: player.voteEfficacy,
        createdAt: player.createdAt,
      });
    } catch (error: any) {
      if (error.message === 'PlayerNotFound') {
        return c.json({ error: 'Player not found' }, 404);
      }
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  /**
   * PATCH /auth/profile
   * Updates an existing profile.
   */
  router.patch('/profile', zValidator('json', loginSchema.extend({ id: z.string() })), async (c) => {
    const { id, nickname, avatar, color } = c.req.valid('json');
    try {
      const updated = await authUseCase.updateProfile(id, { nickname, avatar, color });
      return c.json({
        id: updated.id,
        nickname: updated.nickname,
        avatar: updated.avatar,
        color: updated.color,
        totalScore: updated.totalScore,
        impostorGames: updated.impostorGames,
        agenteGames: updated.agenteGames,
        infiltradoGames: updated.infiltradoGames,
        dispersoGames: updated.dispersoGames,
        vinculadoGames: updated.vinculadoGames,
        totalVotes: updated.totalVotes,
        correctVotes: updated.correctVotes,
        globalRank: updated.globalRank,
        // Re-fetch profile to get computed efficacy or just compute here
        voteEfficacy: updated.totalVotes ? Math.round(((updated.correctVotes || 0) / updated.totalVotes) * 100) : 0,
        createdAt: updated.createdAt,
      });
    } catch (error: any) {
      if (error.message === 'PlayerNotFound') {
        return c.json({ error: 'Player not found' }, 404);
      }
      return c.json({ error: 'Failed to update profile' }, 500);
    }
  });

  return router;
}
