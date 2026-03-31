import { sql } from '../src/infrastructure/db';

async function purgeBloat() {
  console.log('🧹 Purging inactive players and rooms...');
  try {
    const deletedPlayers = await sql`
      DELETE FROM players 
      WHERE total_score = 0 
      AND created_at < NOW() - INTERVAL '24 hours'
      RETURNING id
    `;
    console.log(`✅ Deleted ${deletedPlayers.length} inactive players.`);

    const deletedRooms = await sql`
      DELETE FROM rooms
      WHERE updated_at < NOW() - INTERVAL '24 hours'
      RETURNING id
    `;
    console.log(`✅ Deleted ${deletedRooms.length} inactive rooms.`);

  } catch (err) {
    console.error('❌ Error during purge:', err);
  } finally {
    await sql.end();
  }
}

purgeBloat();
