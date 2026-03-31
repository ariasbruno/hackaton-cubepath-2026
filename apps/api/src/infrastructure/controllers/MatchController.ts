import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { matchResultSchema } from '@impostor/shared';
import type { MatchUseCase } from '../../application/MatchUseCase';

export const MatchController = (matchUseCase: MatchUseCase) => {
  const router = new Hono();

  router.post(
    '/archive',
    zValidator('json', matchResultSchema),
    async (c) => {
      const matchData = c.req.valid('json');

      try {
        await matchUseCase.archiveMatch(matchData);
        return c.json({ success: true, message: 'Match archived' });
      } catch (error: any) {
        console.error('Failed to archive match:', error);
        return c.json({ error: error.message || 'Internal error' }, 500);
      }
    }
  );

  return router;
};
