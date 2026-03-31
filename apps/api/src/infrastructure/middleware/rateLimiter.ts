import type { Context, Next } from 'hono';

// Stores: Key -> { count, windowStart }
interface RateLimitInfo {
  count: number;
  windowStart: number;
}

const loginAttempts = new Map<string, RateLimitInfo>();
const sessionAttempts = new Map<string, RateLimitInfo>(); // For /auth/me
const burstAttempts = new Map<string, RateLimitInfo>();   // For 2s window
const verifyAttempts = new Map<string, RateLimitInfo>();  // For 3s window (verify)

const LOGIN_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_LOGIN = 3;

const SESSION_WINDOW = 60 * 1000;    // 1 minute
const MAX_SESSION = 60;

const BURST_WINDOW = 2000;           // 2 seconds
const MAX_BURST = 10;

const VERIFY_WINDOW = 3000;          // 3 seconds
const MAX_VERIFY = 1;

/**
 * Cleanup expired rate limit entries every 10 minutes
 */
setInterval(() => {
  const now = Date.now();
  [loginAttempts, sessionAttempts, burstAttempts, verifyAttempts].forEach(map => {
    map.forEach((info, key) => {
      // Use a safe buffer (max window) to cleanup
      if (now - info.windowStart > LOGIN_WINDOW) {
        map.delete(key);
      }
    });
  });
  console.log(`[RATE LIMIT] Cleaned up maps at ${new Date().toLocaleTimeString()}`);
}, 10 * 60 * 1000);

/**
 * Middleware for login (3 per hour)
 */
export const loginLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const now = Date.now();
  const info = loginAttempts.get(ip);

  if (!info || now - info.windowStart > LOGIN_WINDOW) {
    loginAttempts.set(ip, { count: 1, windowStart: now });
  } else {
    if (info.count >= MAX_LOGIN) {
      console.warn(`[RATE LIMIT] Blocked login: ${ip}`);
      return c.json({ error: '[LOGIN_LIMIT]' }, 429);
    }
    info.count += 1;
  }

  c.set('clientIp', ip);
  await next();
};

/**
 * Middleware for session check (60/min + 10/2s)
 * Key: IP + userId
 */
export const sessionLimiter = async (c: Context, next: Next) => {
  const userId = c.req.param('id');
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const key = `${ip}:${userId}`;
  const now = Date.now();

  // 1. Burst Check (10 in 2s)
  const burstInfo = burstAttempts.get(key);
  if (!burstInfo || now - burstInfo.windowStart > BURST_WINDOW) {
    burstAttempts.set(key, { count: 1, windowStart: now });
  } else if (burstInfo.count >= MAX_BURST) {
    console.warn(`[RATE LIMIT] BURST BLOCK: ${key}`);
    return c.json({ error: 'Too Many Requests', message: 'Ráfaga de solicitudes detectada.' }, 429);
  } else {
    burstInfo.count += 1;
  }

  // 2. Sustained Check (60 in 1min)
  const sessionInfo = sessionAttempts.get(key);
  if (!sessionInfo || now - sessionInfo.windowStart > SESSION_WINDOW) {
    sessionAttempts.set(key, { count: 1, windowStart: now });
  } else if (sessionInfo.count >= MAX_SESSION) {
    console.warn(`[RATE LIMIT] SUSTAINED BLOCK: ${key}`);
    return c.json({ error: 'Too Many Requests', message: 'Frecuencia de actualización excedida.' }, 429);
  } else {
    sessionInfo.count += 1;
  }

  await next();
};

/**
 * Middleware for verification (1/3s)
 */
export const verifyLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || '127.0.0.1';
  const userId = c.req.param('id') || 'unknown';
  const key = `${ip}:${userId}`;
  const now = Date.now();
  const info = verifyAttempts.get(key);

  if (!info || now - info.windowStart > VERIFY_WINDOW) {
    verifyAttempts.set(key, { count: 1, windowStart: now });
  } else {
    if (info.count >= MAX_VERIFY) {
      console.warn(`[RATE LIMIT] Blocked verify: ${key}`);
      return c.json({ error: 'Too Many Requests', message: 'Espera 3 segundos entre verificaciones.' }, 429);
    }
    info.count += 1;
  }

  await next();
};
