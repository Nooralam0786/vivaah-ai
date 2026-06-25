/**
 * Sliding-window in-memory rate limiter.
 * Runs server-side only (Node.js). Used in server.ts before requests reach Next.js.
 */

export interface RateLimitConfig {
  windowMs: number; // window size in milliseconds
  max:      number; // max requests allowed per window
}

export interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetAt:    number; // epoch ms when the window resets
  retryAfter: number; // seconds to wait (0 if allowed)
}

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

// Prune stale keys every 10 minutes to avoid memory leaks
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour
  for (const [key, entry] of store.entries()) {
    if (!entry.timestamps.length || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000).unref(); // .unref() so this doesn't block process exit

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now         = Date.now();
  const windowStart = now - config.windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps that have fallen outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const count   = entry.timestamps.length;
  const allowed = count < config.max;

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
