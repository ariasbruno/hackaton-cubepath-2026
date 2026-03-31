import { sql as db } from '../db';
import type { MatchResult } from '@impostor/shared';
import type { IMatchRepository } from '../../domain/IMatchRepository';

export class SqlMatchRepository implements IMatchRepository {
  async archiveMatch(result: MatchResult): Promise<void> {
    await db.begin(async (sql: any) => {
      // 1. Insert match
      const [match] = await sql`
        INSERT INTO matches (room_id, mode, winner_side, rounds)
        VALUES (${result.roomId}, ${result.mode}, ${result.winnerSide}, ${result.rounds})
        RETURNING id
      `;

      // 2. Insert match_players and update total_score
      for (const player of result.players as any) {
        // SKIP if guest
        if (player.playerId.startsWith('guest_')) {
          console.log(`[ARCHIVE] Skipping guest player: ${player.playerId}`);
          continue;
        }

        const points = player.pointsPerMatch || 0;

        await sql`
          INSERT INTO match_players (match_id, player_id, role, points, voted_correctly)
          VALUES (${match.id}, ${player.playerId}, ${player.role}, ${points}, ${player.votedCorrectly || false})
        `;

        // Determine role column to increment
        const role = player.role;
        
        await sql`
          UPDATE players
          SET total_score = total_score + ${points}::int,
              total_votes = total_votes + 1,
              correct_votes = correct_votes + ${player.votedCorrectly ? 1 : 0}::int,
              updated_at = NOW()
              ${role === 'IMPOSTOR' ? sql`, impostor_games = impostor_games + 1` : sql``}
              ${role === 'AGENTE' ? sql`, agente_games = agente_games + 1` : sql``}
              ${role === 'INFILTRADO' ? sql`, infiltrado_games = infiltrado_games + 1` : sql``}
              ${role === 'DISPERSO' ? sql`, disperso_games = disperso_games + 1` : sql``}
              ${role === 'VINCULADO' ? sql`, vinculado_games = vinculado_games + 1` : sql``}
          WHERE id = ${player.playerId}
        `;
      }
    });
  }
}
