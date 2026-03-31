# Guía de Desarrollo

El proyecto utiliza un monorepo administrado con `pnpm`.

## Requisitos
- Node.js 20+
- Bun 1.1+ (para el servidor de juego)
- PostgreSQL 15+

## Configuración Inicial

1. **Instalar Dependencias**:
   ```bash
   pnpm install
   ```

2. **Variables de Entorno**:
   Copia los archivos `.env.example` a `.env` en cada paquete:
   - `apps/api/.env`
   - `apps/game-server/.env`
   - `apps/web/.env`

3. **Base de Datos**:
   Ejecuta el script inicial ubicado en `docs/init/references/technical/schemas/001_initial.sql` en tu instancia de PostgreSQL.

## Ejecución en Desarrollo

Para iniciar todos los servicios simultáneamente:
```bash
pnpm dev
```

O individualmente:
- **Web**: `pnpm --filter web dev`
- **API**: `pnpm --filter api dev`
- **Game Server**: `pnpm --filter game-server dev`

## Estructura de Carpetas

- `apps/api`: Backend REST (Hono).
- `apps/game-server`: Servidor WebSockets (Bun).
- `apps/web`: Aplicación Frontend (React).
- `packages/shared`: Esquemas Zod y tipos compartidos.
- `docs/`: Documentación técnica y de diseño.
