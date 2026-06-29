/**
 * Redis client — ioredis singleton.
 *
 * Graceful degradation: if REDIS_URL is not set (local dev without Redis),
 * getRedis() returns null and every caller must handle the null case.
 * This keeps the app fully functional without Redis — Redis is an optimisation,
 * not a hard dependency.
 */

import Redis from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var _redis: Redis | null | undefined;
}

let _initialised = false;

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  // Reuse across hot-reloads in Next.js dev mode
  if (global._redis) return global._redis;
  if (_initialised) return null; // init already attempted and failed

  try {
    const client = new Redis(url, {
      password:           process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 2,
      connectTimeout:     3000,
      lazyConnect:        true,
      enableOfflineQueue: false,
    });

    client.on('error', (err) => {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('[Redis] connection error:', err.message);
      }
    });

    global._redis = client;
    _initialised  = true;
    return client;
  } catch {
    _initialised = true;
    return null;
  }
}

/** Close the Redis connection (used in tests / graceful shutdown). */
export async function closeRedis(): Promise<void> {
  if (global._redis) {
    await global._redis.quit().catch(() => {});
    global._redis = null;
  }
  _initialised = false;
}
