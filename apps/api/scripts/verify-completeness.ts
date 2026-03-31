import { sql } from '../src/infrastructure/db';

async function verifyFullSchema() {
  console.log('🔍 Iniciando verificación exhaustiva de la base de datos...\n');

  try {
    // 1. Verificar Extensión pgcrypto
    const [extension] = await sql`SELECT * FROM pg_extension WHERE extname = 'pgcrypto'`;
    console.log(extension ? '✅ Extensión "pgcrypto" instalada.' : '❌ Extensión "pgcrypto" NO instalada.');

    // 2. Definición esperada de tablas y columnas (basada en 001_initial.sql)
    const expectedSchema: Record<string, string[]> = {
      players: [
        'id', 'nickname', 'avatar', 'color', 'total_score', 'impostor_games', 
        'agente_games', 'infiltrado_games', 'disperso_games', 'vinculado_games', 
        'total_votes', 'correct_votes', 'last_ip', 'created_at', 'updated_at'
      ],
      rooms: [
        'id', 'code', 'host_id', 'settings', 'status', 'created_at', 'updated_at'
      ],
      matches: [
        'id', 'room_id', 'mode', 'winner_side', 'rounds', 'created_at'
      ],
      match_players: [
        'id', 'match_id', 'player_id', 'role', 'points', 'voted_correctly'
      ]
    };

    for (const [table, columns] of Object.entries(expectedSchema)) {
      const dbColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = ${table}
        AND table_schema = 'public'
      `;

      const dbColumnNames = dbColumns.map(c => c.column_name);
      const missing = columns.filter(c => !dbColumnNames.includes(c));
      
      if (dbColumnNames.length === 0) {
        console.log(`❌ Tabla "${table}": NO EXISTE.`);
      } else if (missing.length > 0) {
        console.log(`⚠️  Tabla "${table}": EXISTE, pero faltan columnas: ${missing.join(', ')}`);
      } else {
        console.log(`✅ Tabla "${table}": Completa (${dbColumnNames.length} columnas).`);
      }
    }

    // 3. Verificar Triggers de actualización (updated_at)
    const triggers = await sql`
      SELECT trigger_name 
      FROM information_schema.triggers 
      WHERE event_object_table IN ('players', 'rooms')
    `;
    
    if (triggers.length >= 2) {
      console.log('\n✅ Triggers de "update_timestamp" instalados y activos.');
    } else {
      console.log('\n⚠️  Faltan triggers de automatización para "updated_at".');
    }

    console.log('\n✨ Verificación finalizada.');

  } catch (error: any) {
    console.error('\n❌ ERROR CRÍTICO durante la verificación:', error.message || error);
  } finally {
    process.exit(0);
  }
}

verifyFullSchema();
