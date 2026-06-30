/**
 * Redis-backed generic cache with JSON serialization.
 *
 * All operations are no-ops (return null / do nothing) when Redis is unavailable,
 * so callers never need to check — they just handle a null result as a cache miss.
 *
 * Key namespacing: `cache:{namespace}:{id}`
 */

import { getRedis } from './redis';

// ── Core helpers ─────────────────────────────────────────────────────────────

/** Read a cached value. Returns null on miss or when Redis is unavailable. */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(`cache:${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Write a value to cache with a TTL in seconds. */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(`cache:${key}`, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Cache write failures are silent — the app still works
  }
}

/** Delete a specific cache key. */
export async function cacheDel(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(`cache:${key}`);
  } catch {
    // ignore
  }
}

/** Delete all cache keys matching a pattern (e.g. `matches:user-123:*`). */
export async function cacheDelPattern(pattern: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // ignore
  }
}

// ── Domain-specific cache keys ────────────────────────────────────────────────

export const CacheKeys = {
  /** Match results for a user (discover feed). TTL: 5 min. */
  matches:     (userId: string) => `matches:${userId}`,
  /** Candidate profile (public data). TTL: 10 min. */
  profile:     (userId: string) => `profile:${userId}`,
  /** Conversation list for a user. TTL: 2 min. */
  convList:    (userId: string) => `conv-list:${userId}`,
  /** Top picks for a user. TTL: 30 min. */
  topPicks:    (userId: string) => `top-picks:${userId}`,
  /** Subscription status. TTL: 5 min. */
  subscription:(userId: string) => `subscription:${userId}`,
} as const;

export const CacheTTL = {
  MATCHES:      5  * 60,  // 5 min
  PROFILE:      10 * 60,  // 10 min
  CONV_LIST:    2  * 60,  // 2 min
  TOP_PICKS:    30 * 60,  // 30 min
  SUBSCRIPTION: 5  * 60,  // 5 min
} as const;
