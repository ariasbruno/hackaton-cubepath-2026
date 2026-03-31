import { sql as db } from '../db';
import type { ILeaderboardRepository, LeaderboardEntry } from '../../domain/ILeaderboardRepository';

export class SqlLeaderboardRepository implements ILeaderboardRepository {
  async getLeaderboardByRoom(roomId: string): Promise<LeaderboardEntry[]> {
    const rows = await db`
      SELECT
        p.id, 
        p.nickname, 
        p.avatar,
        mp.role,
        COUNT(mp.id)::int AS matches_played,
        SUM(mp.points)::int AS total_points
      FROM match_players mp
      JOIN matches m ON m.id = mp.match_id
      JOIN players p ON p.id = mp.player_id
      WHERE m.room_id = ${roomId}
      GROUP BY p.id, p.nickname, p.avatar, mp.role
      ORDER BY total_points DESC
    `;

    return rows.map((r: any) => ({
      id: String(r.id),
      nickname: String(r.nickname),
      avatar: String(r.avatar),
      role: String(r.role),
      matchesPlayed: r.matches_played,
      totalPoints: r.total_points
    }));
  }
}
