import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { GameEvents } from '@impostor/shared';

// ── App ──────────────────────────────────────────────────────
const app = new Hono();

// ── Middleware ────────────────────────────────────────────────
app.use('*', logger());

// Safer CORS: Define allowed origins in .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  })
);

// ── Internal Security Middleware ──────────────────────────────
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

const internalAuth = async (c: any, next: any) => {
  const apiKey = c.req.header('x-internal-key');
  if (!apiKey || apiKey !== INTERNAL_API_KEY) {
    return c.json({ error: 'Unauthorized: Invalid Internal Key' }, 401);
  }
  await next();
};

app.use('/internal/*', internalAuth);

// ── Injection (Repositories) ───────────────────────────────────
import { SqlPlayerRepository } from './infrastructure/repositories/SqlPlayerRepository';
import { SqlRoomRepository } from './infrastructure/repositories/SqlRoomRepository';
import { SqlMatchRepository } from './infrastructure/repositories/SqlMatchRepository';
import { SqlLeaderboardRepository } from './infrastructure/repositories/SqlLeaderboardRepository';
import { AuthUseCase } from './application/AuthUseCase';
import { createAuthController } from './infrastructure/controllers/AuthController';
import { RoomUseCase } from './application/RoomUseCase';
import { createRoomController } from './infrastructure/controllers/RoomController';
import { MatchUseCase } from './application/MatchUseCase';
import { MatchController } from './infrastructure/controllers/MatchController';
import { LeaderboardUseCase } from './application/LeaderboardUseCase';
import { LeaderboardController } from './infrastructure/controllers/LeaderboardController';
import { sql } from './infrastructure/db';
import { adminController } from './infrastructure/controllers/AdminController';
import { aiController } from './infrastructure/controllers/AiController';
import { InternalRoomController } from './infrastructure/controllers/InternalRoomController';

// Initialize Repositories
const playerRepository = new SqlPlayerRepository();
const roomRepository = new SqlRoomRepository();
const matchRepository = new SqlMatchRepository();
const leaderboardRepository = new SqlLeaderboardRepository();

// Initialize Use Cases
const authUseCase = new AuthUseCase(playerRepository);
const roomUseCase = new RoomUseCase(roomRepository, playerRepository);
const matchUseCase = new MatchUseCase(matchRepository);
const leaderboardUseCase = new LeaderboardUseCase(leaderboardRepository);

// Mount the auth controller
const authRouter = createAuthController(authUseCase);
app.route('/auth', authRouter);

// Mount the room controller
const roomRouter = createRoomController(roomUseCase);
app.route('/rooms', roomRouter);

// Mount new controllers
const matchRouter = MatchController(matchUseCase);
app.route('/internal/matches', matchRouter);

const leaderboardRouter = LeaderboardController(leaderboardUseCase);
app.route('/leaderboard', leaderboardRouter);

const adminRouter = adminController;
const aiRouter = aiController;

// Always mount internal routes (now protected by middleware)
app.route('/internal/ai', aiController);
app.route('/internal/matches', matchRouter);
app.route('/internal/rooms', InternalRoomController(roomUseCase));

// Solo montar rutas de administración y utilidades internas si NO estamos en producción
if (process.env.NODE_ENV !== 'production') {
  app.route('/admin', adminRouter);
  console.log('🛠️ Admin routes enabled (Development mode)');
}

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Background Jobs ──────────────────────────────────────────
// Cleanup old players (>48h) every 15 minutes
setInterval(async () => {
  try {
    const result = await sql`
      DELETE FROM players 
      WHERE updated_at < NOW() - INTERVAL '1 month'
      AND id NOT IN (SELECT host_id FROM rooms)
      AND id NOT IN (SELECT player_id FROM match_players)
    `;
    console.log(`[CLEANUP] Database maintenance: Old players removed at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('[CLEANUP ERROR]', error);
  }
}, 15 * 60 * 1000);

// ── Placeholder Routes ───────────────────────────────────────
app.get('/', (c) => c.json({ message: 'El Impostor API 🎭' }));

// ── Start Server ─────────────────────────────────────────────
const port = parseInt(process.env.PORT || '3000');

console.log(`🏢 API Server listening on http://localhost:${port}`);
console.log(`   Health: http://localhost:${port}/health`);
console.log(`   Events loaded: ${Object.keys(GameEvents).length} events from @impostor/shared`);

export { app };

export default {
  port,
  fetch: app.fetch,
};
