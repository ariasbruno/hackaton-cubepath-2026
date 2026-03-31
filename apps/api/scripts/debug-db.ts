import { sql } from '../src/infrastructure/db';

async function listAll() {
  console.log('🔍 Listando todas las tablas en todos los esquemas...\n');
  try {
    const res = await sql`
      SELECT schemaname, tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    `;
    console.table(res);
  } catch (err: any) {
    console.error(err.message);
  } finally {
    process.exit(0);
  }
}
listAll();
