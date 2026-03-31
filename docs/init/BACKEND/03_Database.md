# Paso 03: Conexión DB y Repositorios SQL

## Objetivo
Establecer la conexión con PostgreSQL utilizando el cliente nativo `postgres.js`. Crearemos la capa de infraestructura que implementará las interfaces del dominio mediante queries SQL directas.

## Requerimientos Técnicos
- **DB**: PostgreSQL.
- **Client**: `postgres` (Nativo).
- **Patrón**: Repository Pattern (SQL Directo).

## Pasos de Ejecución

### 1. Inicialización de la Conexión (`apps/api/src/infrastructure/db.ts`)
1. Crear una instancia del cliente `postgres` usando la `DATABASE_URL`.
2. Exportar el cliente para ser usado por los repositorios.

### 2. Creación de Tablas (Migración Inicial)
Dado que no usamos ORM, crearemos un script `migrate.ts` simple en `apps/api/scripts/` que ejecute el archivo SQL de migración inicial [`001_initial.sql`](../references/technical/schemas/001_initial.sql):
- **`players`**: `id (UUID PK)`, `nickname`, `avatar`, `total_score`, `last_ip (server-only)`, timestamps.
- **`rooms`**: `id (UUID PK)`, `code (CHAR 4, UNIQUE activa)`, `host_id (FK)`, `settings (JSONB)`, `status`, timestamps.
- **`matches`**: `id (UUID PK)`, `room_id (FK)`, `mode`, `winner_side`, `rounds`, `created_at`.
- **`match_players`**: `id (UUID PK)`, `match_id (FK)`, `player_id (FK)`, `role`, `points`. `UNIQUE(match_id, player_id)`.

La migración incluye:
- Índices parciales para purga (Anti-Bloat) y consultas de salas públicas.
- Trigger `update_timestamp()` para auto-actualizar `updated_at`.
- Extensión `pgcrypto` para generación de UUIDs.

### 3. Implementación de Repositorios
1. En `apps/api/src/infrastructure/repositories/`, crear `SqlPlayerRepository.ts`.
2. Implementar la interfaz `IPlayerRepository` (del dominio) usando queries SQL:
   ```typescript
   // Ejemplo:
   const players = await sql`SELECT * FROM players WHERE id = ${id}`;
   ```

### 4. Inyección de Dependencias
En el `index.ts` de la API, instanciar el repositorio y pasarlo al caso de uso correspondiente.

## Verificación
- Al ejecutar el script de migración, las tablas se crean correctamente en el servidor remoto.
- Las queries SQL devuelven los datos esperados y los mapean correctamente a las entidades del dominio.
