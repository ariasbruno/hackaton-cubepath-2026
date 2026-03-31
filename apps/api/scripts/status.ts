import { sql } from '../src/infrastructure/db';

async function checkStatus() {
  console.log('🧐 Consultando estado de la base de datos...\n');

  try {
    // 1. Verificar tablas existentes
    const tables = await sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `;

    if (tables.length === 0) {
      console.log('❌ No hay tablas en el esquema "public". ¿Has ejecutado bun db:push?');
      return;
    }

    console.log(`✅ Tablas encontradas (${tables.length}): ${tables.map(t => t.tablename).join(', ')}`);

    // 2. Contar registros
    const [playersCount] = await sql`SELECT count(*) FROM players`;
    const [roomsCount] = await sql`SELECT count(*) FROM rooms`;
    const [matchesCount] = await sql`SELECT count(*) FROM matches`;

    console.log('\n📊 Resumen de Datos:');
    console.log(`   - Jugadores: ${playersCount.count}`);
    console.log(`   - Salas:     ${roomsCount.count}`);
    console.log(`   - Partidas:  ${matchesCount.count}`);

    // 3. Ver los últimos 5 jugadores (Nickname y Avatar)
    if (parseInt(playersCount.count) > 0) {
      console.log('\n👤 Últimos 5 Jugadores:');
      const latestPlayers = await sql`
        SELECT nickname, avatar, color 
        FROM players 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      latestPlayers.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.nickname} (Avatar: ${p.avatar})`);
      });
    }

    // 4. Ver salas activas
    if (parseInt(roomsCount.count) > 0) {
      console.log('\n🏠 Salas Activas (Lobby):');
      const activeRooms = await sql`
        SELECT code, status, created_at 
        FROM rooms 
        WHERE status = 'LOBBY' 
        LIMIT 5
      `;
      activeRooms.forEach(r => {
        console.log(`   - [${r.code}] Estado: ${r.status}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Error consultando la base de datos:', error.message || error);
  } finally {
    process.exit(0);
  }
}

checkStatus();
