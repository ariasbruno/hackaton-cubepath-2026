import postgres from 'postgres';

// Initialize postgres client using the connection string from .env
const sql = postgres(process.env.DATABASE_URL || 'postgres://localhost:5432/el_impostor', {
  max: 10,                 // Max connections in the pool
  idle_timeout: 20,        // Max idle time in seconds
  connect_timeout: 10,     // Timeout when connecting to postgres
});

export { sql };
