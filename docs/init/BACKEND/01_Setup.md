# Paso 01: Inicialización del Monorepo

## Objetivo
Configurar el entorno de desarrollo base utilizando un monorepo gestionado por Bun. Esto permitirá compartir código entre el backend (API y Game Server) y el frontend de forma eficiente, siguiendo un patrón de **Arquitectura Hexagonal**.

## Requerimientos Técnicos
- **Entorno**: Bun.
- **Estructura**: Workspaces de Bun.
- **Backend 1 (API)**: Hono (HTTP).
- **Backend 2 (Game Server)**: Bun Nativo (WebSockets).
- **Frontend**: Vite + React + Tailwind CSS v4.
- **Shared**: Paquete de tipos y esquemas compartidos (@impostor/shared).

## Pasos de Ejecución

### 1. Inicialización de la Raíz
1. Inicializar Bun:
   ```bash
   bun init -y
   ```
2. Configurar `package.json` raíz:
   ```json
   {
     "name": "el-impostor",
     "workspaces": ["apps/*", "packages/*"],
     "scripts": {
       "dev": "bun --filter \"*\" dev",
       "db:push": "bun --filter \"api\" db:push",
       "test": "bun test"
     }
   }
   ```

### 2. Creación de Apps y Estructura Arquitectónica

#### API (Server 2)
```bash
mkdir -p apps/api/src/{domain,application,infrastructure/{repositories,controllers}}
cd apps/api && bun init -y
bun add hono @hono/zod-validator zod postgres
```

#### Game Server (Server 1)
```bash
mkdir -p apps/game-server/src/{domain,application,infrastructure/{repositories,controllers}}
cd ../game-server && bun init -y
bun add zod
```

#### Frontend (Web)
```bash
cd ../..
bun create vite apps/web --template react-ts
cd apps/web && bun add -d tailwindcss @tailwindcss/vite
```

### 3. Creación de Shared (Contrato Real)
```bash
mkdir -p packages/shared/src/{schemas,events,types}
cd packages/shared
bun init -y
# Cambiar name a "@impostor/shared" en package.json
bun add zod
```

### 4. Configuración de Alias (tsconfig.json raíz)
Es vital para la **Inyección de Dependencias**. Añadir en el `tsconfig.json` de la raíz:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@impostor/shared": ["./packages/shared/src/index.ts"]
    }
  }
}
```

### 5. Variables de Env (.env)
Crear `.env` en la raíz:
- `DATABASE_URL=postgres://...`
- `INTERNAL_API_KEY=super-secret-key`
- `GEMINI_API_KEY=your-gemini-api-key`
- `VITE_API_URL=http://localhost:3000`
- `VITE_WS_URL=ws://localhost:3001`

## Verificación
1. Ejecutar `bun dev` en la raíz.
2. Comprobar que:
   - La API responde en el puerto 3000.
   - El Game Server escucha en el 3001.
   - Vite sirve el frontend en el 5173.
   - Puedes importar un tipo de `@impostor/shared` en cualquiera de los tres.

## Referencias de Infraestructura
- **CORS, Health Checks, Rate Limiting, Logging, Graceful Shutdown, memoria gp.nano, y estrategia de servir estáticos**: Ver [Guía de Infraestructura y Operaciones](../references/technical/infrastructure.md).

