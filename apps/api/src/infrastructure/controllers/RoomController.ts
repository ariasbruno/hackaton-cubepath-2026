import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { roomSettingsSchema, roomCodeSchema } from '@impostor/shared';
import type { RoomUseCase } from '../../application/RoomUseCase';
import { z } from 'zod';

export function createRoomController(roomUseCase: RoomUseCase) {
  const router = new Hono();

  /**
   * POST /rooms
   * Creates a new match room.
   */
  const createRoomPayloadSchema = z.object({
    hostId: z.string().uuid(),
    settings: roomSettingsSchema,
  });

  router.post('/', zValidator('json', createRoomPayloadSchema), async (c) => {
    const { hostId, settings } = c.req.valid('json');

    try {
      const room = await roomUseCase.createRoom(hostId, settings);
      return c.json({
        id: room.id,
        code: room.code,
        hostId: room.hostId,
        settings: room.settings,
        status: room.status,
        createdAt: room.createdAt,
      }, 201);
    } catch (error: any) {
      if (error.message === 'PlayerNotFound') {
        return c.json({ error: 'Sesión inválida o usuario no encontrado el la base de datos', code: 'SESSION_INVALID' }, 403);
      }
      if (error.message === 'CodeGenerationFailed') {
        return c.json({ error: 'System overload, unable to generate room' }, 503);
      }
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  /**
   * GET /rooms
   * Fetches public lobbies with pagination.
   */
  router.get('/', async (c) => {
    const limit = Math.max(1, Math.min(100, parseInt(c.req.query('limit') || '20')));
    const offset = Math.max(0, parseInt(c.req.query('offset') || '0'));

    try {
      const publicRooms = await roomUseCase.listPublicRooms(limit, offset);
      return c.json({
        rooms: publicRooms.map(room => ({
          code: room.code,
          settings: room.settings,
          createdAt: room.createdAt,
          hostId: room.hostId,
          playerCount: room.playerCount || 0,
        })),
        pagination: { limit, offset, count: publicRooms.length }
      });
    } catch (error) {
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  /**
   * GET /rooms/admin/all
   * Admin view of all rooms.
   */
  router.get('/admin/all', async (c) => {
    try {
      const allRooms = await roomUseCase.getAllRooms();
      return c.json({ rooms: allRooms });
    } catch (error) {
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  /**
   * GET /rooms/check/:code
   * Checks if a specific room code is valid to join.
   */
  router.get('/check/:code', zValidator('param', z.object({ code: roomCodeSchema })), async (c) => {
    const { code } = c.req.valid('param');

    try {
      const room = await roomUseCase.validateRoom(code.toUpperCase());
      return c.json({
        id: room.id,
        code: room.code,
        hostId: room.hostId,
        status: room.status,
        settings: room.settings,
      });
    } catch (error: any) {
      if (error.message === 'RoomNotFound') {
        return c.json({ error: 'Sala no encontrada' }, 404);
      }
      if (error.message === 'RoomFinished') {
        return c.json({ error: 'La partida ya ha finalizado' }, 403);
      }
      return c.json({ error: 'Error interno validando la sala' }, 500);
    }
  });

  return router;
}
