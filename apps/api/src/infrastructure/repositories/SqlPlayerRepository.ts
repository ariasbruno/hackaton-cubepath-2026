import type { IPlayerRepository } from '../../domain/IPlayerRepository';
import type { PlayerEntity } from '../../domain/entities';
import { sql } from '../db';

/**
 * Mapea una fila de DB snake_case a PlayerEntity camelCase.
 */
function toEntity(row: any): PlayerEntity {
  return {
    id: row.id,
    nickname: row.nickname,
    avatar: row.avatar,
    color: row.color,
    totalScore: row.total_score,
    lastIp: row.last_ip,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    impostorGames: Number(row.impostor_games || 0),
    agenteGames: Number(row.agente_games || 0),
    infiltradoGames: Number(row.infiltrado_games || 0),
    dispersoGames: Number(row.disperso_games || 0),
    vinculadoGames: Number(row.vinculado_games || 0),
    totalVotes: Number(row.total_votes || 0),
    correctVotes: Number(row.correct_votes || 0),
    globalRank: Number(row.global_rank || 0),
  };
}

export class SqlPlayerRepository implements IPlayerRepository {
  async create(player: {
    nickname: string;
    avatar: string;
    color?: string;
    lastIp?: string | null;
  }): Promise<PlayerEntity> {
    const [row] = await sql`
      INSERT INTO players (nickname, avatar, color, last_ip)
      VALUES (${player.nickname}, ${player.avatar}, ${player.color || '#FFD166'}, ${player.lastIp || null})
      RETURNING *
    `;
    return toEntity(row);
  }

  async findById(id: string): Promise<PlayerEntity | null> {
    const [row] = await sql`
      SELECT p.*,
        (SELECT COUNT(*) + 1 FROM players WHERE total_score > p.total_score) as global_rank
      FROM players p
      WHERE id = ${id}
    `;
    return row ? toEntity(row) : null;
  }

  async findByIds(ids: string[]): Promise<PlayerEntity[]> {
    if (ids.length === 0) return [];
    
    const rows = await sql`
      SELECT p.*,
        (SELECT COUNT(*) + 1 FROM players WHERE total_score > p.total_score) as global_rank
      FROM players p
      WHERE id IN ${sql(ids)}
    `;
    return rows.map(toEntity);
  }

  async addScore(id: string, scoreToAdd: number): Promise<void> {
    await sql`
      UPDATE players
      SET total_score = total_score + ${scoreToAdd},
          updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  async touch(id: string): Promise<void> {
    await sql`
      UPDATE players
      SET updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  async update(id: string, nickname: string, avatarId: string, color: string): Promise<PlayerEntity | null> {
    await sql`
      UPDATE players
      SET nickname = ${nickname},
          avatar = ${avatarId},
          color = ${color},
          updated_at = NOW()
      WHERE id = ${id}
    `;
    return this.findById(id);
  }
}
