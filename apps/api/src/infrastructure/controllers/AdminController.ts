import { Hono } from 'hono';
import { sql } from '../db';

export const adminController = new Hono();

const ALLOWED_TABLES = ['players', 'rooms', 'matches', 'match_players'];

// 1. Get List of Tables
adminController.get('/tables', async (c) => {
  return c.json(ALLOWED_TABLES);
});

// 2. Get Table Data
adminController.get('/tables/:name', async (c) => {
  const table = c.req.param('name');
  if (!ALLOWED_TABLES.includes(table)) {
    return c.json({ error: 'Invalid table' }, 400);
  }

  try {
    if (table === 'players') {
      const data = await sql`
        SELECT p.*,
          (SELECT COUNT(*) FROM match_players WHERE player_id = p.id AND role IN ('IMPOSTOR', 'INFILTRADO')) as games_impostor,
          (SELECT COUNT(*) FROM match_players WHERE player_id = p.id AND role = 'AGENTE') as games_agente,
          (SELECT COUNT(*) + 1 FROM players WHERE total_score > p.total_score) as global_rank
        FROM players p
        ORDER BY p.created_at DESC
        LIMIT 100
      `;
      return c.json(data);
    }

    // Default: Attempt to parse with created_at sorting
    const data = await sql`SELECT * FROM ${sql(table)} ORDER BY created_at DESC LIMIT 100`;
    return c.json(data);
  } catch (err: any) {
    // Fallback if table doesn't have created_at (like match_players)
    try {
      const data2 = await sql`SELECT * FROM ${sql(table)} LIMIT 100`;
      return c.json(data2);
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  }
});

// 3. Delete Row by ID
adminController.delete('/tables/:name/:id', async (c) => {
  const table = c.req.param('name');
  const id = c.req.param('id');
  
  if (!ALLOWED_TABLES.includes(table)) {
    return c.json({ error: 'Invalid table' }, 400);
  }

  try {
    await sql`DELETE FROM ${sql(table)} WHERE id = ${id}`;
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
