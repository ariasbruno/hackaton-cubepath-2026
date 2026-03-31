# 🛡️ Infraestructura y Operaciones: Guía de Despliegue

Este documento cubre las decisiones de infraestructura y operaciones para los servidores **gp.nano** de CubePath (1 vCPU, 2GB RAM, 40GB NVMe, 3TB Transfer) desplegados con Dokploy.

---

## 1. CORS (Cross-Origin Resource Sharing)

### Problema
El frontend (Server 2) y el Game Server (Server 1) están en dominios/puertos distintos. Sin CORS, el navegador bloquea las peticiones HTTP del frontend a la API.

### Diseño
Usar el middleware CORS nativo de Hono en la API (Server 2):

```typescript
// apps/api/src/infrastructure/middleware/cors.ts
import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: [
    process.env.VITE_APP_URL || 'http://localhost:5173', // Dev
    'https://tu-dominio.com',                             // Prod
  ],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,
  maxAge: 86400, // Cache preflight 24h (reduce OPTIONS requests)
});
```

### Integración
```typescript
// apps/api/src/index.ts
import { corsMiddleware } from './infrastructure/middleware/cors';
app.use('*', corsMiddleware);
```

### Notas
- El Game Server (WebSockets nativos de Bun) **NO necesita CORS** porque WS no está sujeto a la política same-origin.
- La ruta interna `POST /matches/archive` debe aceptar requests sin origin (S2S), pero está protegida por `x-api-key`.
- En desarrollo, el proxy de Vite (`vite.config.ts`) puede evitar CORS, pero aún debemos configurarlo para que las pruebas reflejen el entorno de producción.

---

## 2. Health Checks (Monitoreo para Dokploy)

### Problema
Dokploy necesita saber si los servicios están vivos para auto-restart en caso de fallo.

### Diseño

#### API (Server 2) - `GET /health`
```typescript
// apps/api/src/infrastructure/controllers/health.ts
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

#### Game Server (Server 1) - HTTP Health Endpoint
Bun.serve permite servir HTTP y WS en el mismo puerto. Añadir un handler HTTP para health:
```typescript
// apps/game-server/src/index.ts
Bun.serve({
  fetch(req, server) {
    const url = new URL(req.url);
    
    // Health check (HTTP)
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'game-server',
        activeRooms: roomManager.getRoomCount(),
        activePlayers: roomManager.getPlayerCount(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed,
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    // WebSocket upgrade
    if (server.upgrade(req)) return;
    
    return new Response('Not Found', { status: 404 });
  },
  websocket: { /* ... handlers ... */ }
});
```

### Configuración Dokploy
En la configuración de cada servicio en Dokploy:
- **Health Check Path**: `/health`
- **Health Check Interval**: `30s`
- **Health Check Timeout**: `5s`
- **Unhealthy Threshold**: `3` (3 fallos = restart)

---

## 3. Servir Frontend como Estático

### Problema
En desarrollo usamos Vite dev server (HMR en `:5173`), pero en producción el frontend se sirve como archivos estáticos desde Server 2.

### Diseño

#### Desarrollo
```typescript
// apps/web/vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy a la API
    }
  }
});
```

#### Producción
1. **Build**: `cd apps/web && bun run build` → genera `dist/` con archivos estáticos.
2. **Servir desde Hono** (Server 2):
```typescript
// apps/api/src/index.ts
import { serveStatic } from 'hono/bun';

// API routes primero
app.route('/auth', authRoutes);
app.route('/rooms', roomRoutes);
app.route('/leaderboard', leaderboardRoutes);
app.route('/matches', matchRoutes);
app.get('/health', healthHandler);

// Archivos estáticos del frontend (fallback)
app.use('/*', serveStatic({ root: './public' }));

// SPA fallback: cualquier ruta no-API devuelve index.html
app.get('/*', serveStatic({ path: './public/index.html' }));
```

3. **Build Script** (package.json raíz):
```json
{
  "scripts": {
    "build": "cd apps/web && bun run build && cp -r dist/ ../api/public/"
  }
}
```

### Notas
- En producción, la API y el frontend comparten el mismo dominio → **no necesita CORS** para la API.
- CORS sigue siendo necesario si el frontend consume directamente el Game Server (WS) en un dominio distinto (pero WS no necesita CORS).
- **Cache headers**: Hono debe servir los assets con `Cache-Control: max-age=31536000, immutable` (Vite añade hash a los filenames).

---

## 4. Logging Estructurado

### Problema
Con 2GB RAM, tener logs claros es vital para debugging en producción sin tools pesadas.

### Diseño
Implementar un logger ligero sin dependencias externas:

```typescript
// packages/shared/src/utils/logger.ts
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3,
};

const currentLevel = (process.env.LOG_LEVEL || 'INFO') as LogLevel;

export function createLogger(service: string) {
  const log = (level: LogLevel, message: string, data?: Record<string, unknown>) => {
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[currentLevel]) return;
    
    const entry = {
      ts: new Date().toISOString(),
      level,
      service, // 'api' | 'game-server'
      msg: message,
      ...data,
    };
    
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](
      JSON.stringify(entry)
    );
  };

  return {
    debug: (msg: string, data?: Record<string, unknown>) => log('DEBUG', msg, data),
    info: (msg: string, data?: Record<string, unknown>) => log('INFO', msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => log('WARN', msg, data),
    error: (msg: string, data?: Record<string, unknown>) => log('ERROR', msg, data),
  };
}
```

### Uso
```typescript
// apps/api/src/index.ts
const logger = createLogger('api');
logger.info('Server started', { port: 3000 });

// apps/game-server/src/index.ts
const logger = createLogger('game-server');
logger.info('Room transition', { roomId: 'ABCD', from: 'CLUES', to: 'DISCUSSING' });
```

### Variables de Entorno
Añadir a `.env`:
- `LOG_LEVEL=INFO` (opciones: `DEBUG`, `INFO`, `WARN`, `ERROR`)

### Convenciones de Log
| Evento | Nivel | Service | Ejemplo |
|---|---|---|---|
| Server start/stop | `INFO` | ambos | `Server started on port 3000` |
| Player join/leave | `INFO` | game-server | `Player joined room ABCD` |
| Phase transition | `INFO` | game-server | `Room ABCD: CLUES → DISCUSSING` |
| API request | `DEBUG` | api | `POST /auth/login 201 12ms` |
| Rate limit hit | `WARN` | ambos | `Rate limit exceeded for IP x.x.x.x` |
| DB error | `ERROR` | api | `Query failed: connection refused` |
| AI fallback | `WARN` | game-server | `Gemini failed, using fallback words` |

---

## 5. Graceful Shutdown

### Problema
Al reiniciar servicios (deploy, crash), los jugadores pierden su conexión. Un shutdown limpio minimiza la pérdida de datos.

### Diseño

#### Game Server (Server 1)
```typescript
// apps/game-server/src/index.ts
const shutdown = async () => {
  logger.info('Shutting down...');
  
  // 1. Dejar de aceptar nuevas conexiones
  server.stop();
  
  // 2. Notificar a jugadores conectados
  for (const [roomId, room] of roomManager.getAllRooms()) {
    room.broadcast({
      type: 'ERROR',
      payload: { code: 'SERVER_RESTART', message: 'El servidor se está reiniciando. Reconecta en unos segundos.' }
    });
  }
  
  // 3. Guardar partidas activas en la API (best-effort)
  for (const [roomId, room] of roomManager.getActiveMatches()) {
    try {
      await apiClient.archiveMatch(room.getPartialResults());
      logger.info('Saved partial results', { roomId });
    } catch (e) {
      logger.error('Failed to save partial results', { roomId, error: String(e) });
    }
  }
  
  // 4. Esperar máximo 5s y salir
  setTimeout(() => process.exit(0), 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

#### API (Server 2)
```typescript
// apps/api/src/index.ts
const shutdown = async () => {
  logger.info('Shutting down...');
  
  // 1. Cerrar pool de conexiones PostgreSQL
  await sql.end();
  
  // 2. Salir limpiamente
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

### Notas
- Dokploy envía `SIGTERM` antes de matar el proceso. Configurar el **stop timeout** a `10s` para dar tiempo al graceful shutdown.
- Las partidas parciales guardadas por el Game Server no aseguran integridad total; es un "best-effort" para no perder datos completamente.

---

## 6. Rate Limiting en la API

### Problema
Con 1 vCPU compartido, la API necesita protección contra abuso (creación masiva de cuentas, spam de salas).

### Diseño
Rate limiting ligero usando un `Map` en memoria con cleanup periódico:

```typescript
// apps/api/src/infrastructure/middleware/rate-limit.ts
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup cada 5 minutos para evitar memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(options: { windowMs: number; max: number }) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();
    
    const entry = store.get(key);
    if (entry && entry.resetAt > now) {
      entry.count++;
      if (entry.count > options.max) {
        return c.json({ error: 'Too many requests' }, 429);
      }
    } else {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
    }
    
    await next();
  };
}
```

### Aplicación por Endpoint
| Endpoint | Límite | Ventana | Razón |
|---|---|---|---|
| `POST /auth/login` | 3 | 1 hora | Evitar creación masiva de cuentas |
| `POST /rooms` | 5 | 10 min | Evitar creación masiva de salas |
| `PATCH /auth/profile` | 10 | 1 min | Evitar spam de actualizaciones |
| `GET /rooms` | 30 | 1 min | Consulta frecuente pero limitada |
| `GET /leaderboard/:id` | 20 | 1 min | Consulta frecuente pero limitada |

### Integración
```typescript
// apps/api/src/index.ts
app.post('/auth/login', rateLimit({ windowMs: 60 * 60 * 1000, max: 3 }), authController.login);
app.post('/rooms', rateLimit({ windowMs: 10 * 60 * 1000, max: 5 }), roomController.create);
```

### Notas
- El rate limiting del WebSocket (chat spam, flood de eventos) se gestiona en el Game Server, no aquí. Está documentado en [`WS_Routes.md`](WS_Routes.md).
- La ruta interna `POST /matches/archive` **NO tiene rate limit** porque está protegida por API key y solo la consume el Game Server.
- Con 2GB RAM, un `Map` de rate limiting consume ~100 bytes por entrada. Incluso con 10,000 IPs únicas, eso son ~1MB. Negligible.

---

## 7. Consideraciones de Memoria para gp.nano

### Presupuesto de RAM (2GB por servidor)

#### Server 1 (Game Server)
| Componente | Estimación | Notas |
|---|---|---|
| Bun Runtime | ~50MB | Base runtime |
| Código de la app | ~10MB | Modules, compiled code |
| `RoomState` por sala | ~10-20KB | 12 jugadores × state × historial |
| Chat por sala | ~5KB | 50 mensajes × ~100 bytes |
| OS + overhead | ~200MB | Linux kernel, sistema |
| **Disponible para salas** | **~1.7GB** | |
| **Salas simultáneas máx** | **~4,000-8,000** | Más que suficiente |

#### Server 2 (API + Frontend)
| Componente | Estimación | Notas |
|---|---|---|
| Bun Runtime | ~50MB | Base runtime |
| Hono + App | ~15MB | Framework + routes |
| PostgreSQL Client Pool | ~20MB | 10 conexiones |
| Rate Limit Map | ~1MB | Worst case 10K entries |
| Archivos estáticos en caché | ~30MB | Frontend build |
| OS + overhead | ~200MB | Linux kernel, sistema |
| **Disponible** | **~1.7GB** | Holgado para HTTP |

### Recomendaciones de Optimización
1. **Chat histórico**: Limitar a 20 mensajes en lobby (✅ ya documentado) y 50 en discusión.
2. **Limpieza de salas**: Las salas `FINISHED` se eliminan de RAM inmediatamente tras enviar resultados a la API.
3. **Limpieza de rate limit**: Cada 5 minutos, eliminar entradas expiradas del `Map`.
4. **Monitoreo**: El health check del Game Server expone `memoryUsage` para alertas de Dokploy.
5. **Pool de DB**: Máximo 10 conexiones al pool de PostgreSQL. Con 1 vCPU, más conexiones no mejoran el throughput.

### Límites Operativos Sugeridos
| Métrica | Límite | Acción |
|---|---|---|
| Salas activas | 500 | Bloquear creación de nuevas salas (soft limit) |
| Jugadores conectados | 2,000 | Mostrar "Servidor lleno" |
| Memoria heap | 1.5GB | Log `WARN` + considerar restart |
| DB connections activas | 10 | Max pool (hard limit) |

---

## Variables de Entorno Consolidadas

```env
# Database
DATABASE_URL=postgres://user:pass@host:5432/el_impostor

# Seguridad
INTERNAL_API_KEY=super-secret-key-for-s2s
GEMINI_API_KEY=your-gemini-api-key

# Frontend (prefijo VITE_ requerido por Vite)
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3001

# Opcional
LOG_LEVEL=INFO
```
