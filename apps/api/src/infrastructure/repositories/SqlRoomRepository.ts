import type { IRoomRepository } from '../../domain/IRoomRepository';
import type { RoomEntity, RoomStatus } from '../../domain/entities';
import type { RoomSettings } from '@impostor/shared';
import { sql } from '../db';

/**
 * Mapea una fila de DB snake_case a RoomEntity camelCase.
 */
function toEntity(row: any): RoomEntity & { hostNickname?: string, participants?: string[] } {
  return {
    id: row.id,
    code: row.code,
    hostId: row.host_id,
    settings: row.settings,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    hostNickname: row.host_nickname,
    participants: row.participants || [],
  };
}

export class SqlRoomRepository implements IRoomRepository {
  async create(room: {
    code: string;
    hostId: string;
    settings: RoomSettings;
  }): Promise<RoomEntity> {
    const [row] = await sql`
      INSERT INTO rooms (code, host_id, settings)
      VALUES (${room.code}, ${room.hostId}, ${sql.json(room.settings)})
      RETURNING *
    `;
    return toEntity(row);
  }

  async findByCode(code: string): Promise<RoomEntity | null> {
    const [row] = await sql`
      SELECT * FROM rooms WHERE code = ${code}
    `;
    return row ? toEntity(row) : null;
  }

  async getPublicLobbies(limit: number): Promise<RoomEntity[]> {
    const rows = await sql`
      SELECT * FROM rooms
      WHERE status = 'LOBBY'
      AND settings->>'isPublic' = 'true'
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows.map(toEntity);
  }
  
  async findAll(): Promise<(RoomEntity & { hostNickname?: string, participants?: string[] })[]> {
    const rows = await sql`
      SELECT r.*, p.nickname as host_nickname,
        (
          SELECT json_agg(DISTINCT p2.nickname)
          FROM matches m
          JOIN match_players mp ON mp.match_id = m.id
          JOIN players p2 ON p2.id = mp.player_id
          WHERE m.room_id = r.id
        ) as participants
      FROM rooms r
      LEFT JOIN players p ON r.host_id = p.id
      ORDER BY r.created_at DESC
    `;
    return rows.map(toEntity);
  }

  async updateStatus(id: string, status: RoomStatus): Promise<RoomEntity | null> {
    const [row] = await sql`
      UPDATE rooms
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    return row ? toEntity(row) : null;
  }

  async updateSettings(id: string, settings: RoomSettings): Promise<RoomEntity | null> {
    const [row] = await sql`
      UPDATE rooms
      SET settings = ${sql.json(settings)}
      WHERE id = ${id}
      RETURNING *
    `;
    return row ? toEntity(row) : null;
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM rooms WHERE id = ${id}`;
  }
}
