import { Hono } from 'hono';
import type { RoomUseCase } from '../../application/RoomUseCase';

export const InternalRoomController = (roomUseCase: RoomUseCase) => {
  const router = new Hono();

  /**
   * DELETE /internal/rooms/:id
   * Removes a room from the database (Internal use only).
   */
  router.delete('/:id', async (c) => {
    const id = c.req.param('id');
    try {
      await roomUseCase.deleteRoom(id);
      return c.json({ success: true });
    } catch (error: any) {
      console.error('[InternalRoomController] Failed to delete room:', error);
      return c.json({ error: 'Failed to delete room', details: error.message }, 500);
    }
  });

  return router;
};
