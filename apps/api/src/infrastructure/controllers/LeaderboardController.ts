import { Hono } from 'hono';
import type { LeaderboardUseCase } from '../../application/LeaderboardUseCase';

export const LeaderboardController = (leaderboardUseCase: LeaderboardUseCase) => {
  const router = new Hono();

  router.get('/:roomId', async (c) => {
    const roomId = c.req.param('roomId');
    
    try {
      const leaderboard = await leaderboardUseCase.getLeaderboard(roomId);
      return c.json(leaderboard);
    } catch (error: any) {
      console.error('Failed to get leaderboard:', error);
      return c.json({ error: error.message || 'Internal error' }, 500);
    }
  });

  return router;
};
