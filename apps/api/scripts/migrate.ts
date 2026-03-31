import { sql } from '../src/infrastructure/db';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations() {
  console.log('🚀 Iniciando verificaciones para migración...');

  try {
    // 🛡️ SEGURIDAD 1: Verificar variable de entorno en producción
    const isProduction = process.env.NODE_ENV === 'production';
    const allowDestructive = process.env.ALLOW_DESTRUCTIVE_MIGRATIONS === 'true';

    if (isProduction && !allowDestructive) {
      throw new Error('❌ ¡ALERTA! No se pueden ejecutar migraciones destructivas en producción sin ALLOW_DESTRUCTIVE_MIGRATIONS=true');
    }

    // 🛡️ SEGURIDAD 2: Verificar si la base de datos ya tiene tablas (evitar sobrescritura accidental)
    const tables = await sql`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' AND tablename = 'players'
    `;

    if (tables.length > 0 && !allowDestructive) {
      console.log('\n⚠️  ¡CUIDADO! La tabla "players" ya existe.');
      console.log('🛑 Abortando migración para proteger los datos existentes.');
      console.log('\n👉 Si realmente quieres REINICIAR la base de datos (BORRAR TODO), usa:');
      console.log('   ALLOW_DESTRUCTIVE_MIGRATIONS=true bun db:push\n');
      return;
    }

    // Identificar ruta absoluta del archivo SQL
    const sqlPath = path.resolve(
      // @ts-ignore: Bun runtime
      import.meta.dir,
      '../../../docs/init/references/technical/schemas/001_initial.sql'
    );
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Archivo de migración no encontrado en: ${sqlPath}`);
    }

    const migrationSql = fs.readFileSync(sqlPath, 'utf8');

    console.log(`📄 Ejecutando esquema inicial (001_initial.sql)...`);
    
    // Ejecutar el script SQL completo
    await sql.unsafe(migrationSql);

    console.log('✅ Base de datos inicializada/actualizada exitosamente.');
  } catch (error: any) {
    console.error('❌ Error ejecutando migraciones:', error.message || error);
    process.exit(1);
  } finally {
    // Cerrar la conexión al terminar
    await sql.end();
  }
}

runMigrations();
