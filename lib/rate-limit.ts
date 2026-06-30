/**
 * Sliding-window rate limiter.
 *
 * Strategy:
 *  - When Redis is available: ZSET-based sliding window (shared across all
 *    server instances — correct in multi-pod deployments on Railway).
 *  - When Redis is unavailable: in-memory Map (single-instance fallback for
 *    local dev or when REDIS_URL is not configured).
 *
 * Callers (lib/api-rate-limit.ts, server.ts) use the same interface either way.
 */

import { getRedis } from './redis';

export interface RateLimitConfig {
  windowMs: number; // window size in milliseconds
  max:      number; // max requests allowed per window
}

export interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetAt:    number; // epoch ms when the oldest entry expires
  retryAfter: number; // seconds to wait if blocked (0 when allowed)
}

// ── In-memory fallback ────────────────────────────────────────────────────────

interface Entry { timestamps: number[] }
const _store = new Map<string, Entry>();

// Prune stale keys every 10 min to prevent memory leaks in long-running servers
setInterval(() => {
  const cutoff = Date.now() - 60 * 60_000;
  for (const [k, e] of _store.entries()) {
    if (!e.timestamps.length || e.timestamps[e.timestamps.length - 1] < cutoff) _store.delete(k);
  }
}, 10 * 60_000).unref();

function checkInMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const now         = Date.now();
  const windowStart = now - config.windowMs;

  let entry = _store.get(key);
  if (!entry) { entry = { timestamps: [] }; _store.set(key, entry); }

  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const allowed = entry.timestamps.length < config.max;
  if (allowed) entry.timestamps.push(now);

  const oldest  = entry.timestamps[0] ?? now;
  const resetAt = oldest + config.windowMs;

  return {
    allowed,
    remaining:  Math.max(0, config.max - entry.timestamps.length),
    resetAt,
    retryAfter: allowed ? 0 : Math.ceil((resetAt - now) / 1000),
  };
}

// ── Redis ZSET sliding window ─────────────────────────────────────────────────
//
// Key: `rl:{key}`   Member: `{timestamp}:{random}`   Score: timestamp ms
// Lua script ensures atomicity across ZREMRANGEBYSCORE + ZADD + ZCARD.

const RATE_LIMIT_LUA = `
local key      = KEYS[1]
local now      = tonumber(ARGV[1])
local winStart = tonumber(ARGV[2])
local max      = tonumber(ARGV[3])
local ttl      = tonumber(ARGV[4])
local member   = ARGV[5]

redis.call('ZREMRANGEBYSCORE', key, '-inf', winStart)
local count = redis.call('ZCARD', key)

if count < max then
  redis.call('ZADD', key, now, member)
  redis.call('EXPIRE', key, ttl)
  count = count + 1
  return {1, max - count, 0}
else
  local oldest     = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local oldestTs   = oldest[2] and tonumber(oldest[2]) or now
  local resetAt    = oldestTs + (now - winStart)
  local retryAfter = math.ceil((resetAt - now) / 1000)
  if retryAfter < 1 then retryAfter = 1 end
  return {0, 0, retryAfter}
end
`;

async function checkRedis(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) return checkInMemory(key, config);

  const rKey   = `rl:${key}`;
  const now    = Date.now();
  const winStart = now - config.windowMs;
  const ttlSec   = Math.ceil(config.windowMs / 1000);
  const member   = `${now}:${Math.random().toString(36).slice(2, 7)}`;

  try {
    const result = await redis.eval(
      RATE_LIMIT_LUA, 1, rKey,
      String(now), String(winStart), String(config.max), String(ttlSec), member,
    ) as [number, number, number];

    const allowed    = result[0] === 1;
    const remaining  = result[1];
    const retryAfter = result[2];

    return {
      allowed,
      remaining,
      resetAt:    now + (allowed ? config.windowMs : retryAfter * 1000),
      retryAfter: allowed ? 0 : retryAfter,
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[RateLimit] Redis error, using in-memory fallback:', (err as Error).message);
    }
    return checkInMemory(key, config);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Async rate-limit check — uses Redis when available, in-memory as fallback. */
export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  return checkRedis(key, config);
}

/**
 * Synchronous in-memory check — for use in server.ts HTTP middleware
 * where async is not possible. Redis accuracy requires checkRateLimit().
 */
export function checkRateLimitSync(key: string, config: RateLimitConfig): RateLimitResult {
  return checkInMemory(key, config);
}
