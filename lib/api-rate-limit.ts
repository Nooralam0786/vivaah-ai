/**
 * Async rate-limit wrapper for Next.js App Router route handlers.
 *
 * Now backed by Redis when REDIS_URL is set (shared across all server instances).
 * Falls back to in-memory when Redis is unavailable.
 *
 * Usage:
 *   const limited = await rateLimit(req, `login:${getIP(req)}`, { windowMs: 15*60_000, max: 10 });
 *   if (limited) return limited;
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, type RateLimitConfig } from './rate-limit';

/** Extract the best-available client IP from Next.js request headers. */
export function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

/**
 * Check rate limit for a given key and config.
 * Returns a 429 NextResponse if the limit is exceeded, or null if allowed.
 */
export async function rateLimit(
  _req: NextRequest,
  key: string,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  const result = await checkRateLimit(key, config);

  if (!result.allowed) {
    const res = NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Please wait ${result.retryAfter} second${result.retryAfter !== 1 ? 's' : ''} before trying again.`,
        },
      },
      { status: 429 },
    );
    res.headers.set('X-RateLimit-Limit',     String(config.max));
    res.headers.set('X-RateLimit-Remaining', '0');
    res.headers.set('X-RateLimit-Reset',     String(result.resetAt));
    res.headers.set('Retry-After',           String(result.retryAfter));
    return res;
  }

  return null;
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

/** 5 requests / 15 min — OTP send (SMS abuse prevention). */
export const otpSendLimit   = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 15 * 60_000, max: 5 });

/** 10 attempts / 15 min — login + OTP verify (brute-force protection). */
export const loginLimit     = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 15 * 60_000, max: 10 });

/** 30 requests / min — read-heavy endpoints (matches, discover). */
export const readApiLimit   = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 60_000, max: 30 });

/** 60 requests / min — write-light endpoints (like, message). */
export const writeApiLimit  = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 60_000, max: 60 });

/** 5 requests / hour — sensitive one-shot actions (ID verify, liveness). */
export const sensitiveLimit = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 60 * 60_000, max: 5 });

/** 20 requests / hour — file uploads. */
export const uploadLimit    = (req: NextRequest, key: string) =>
  rateLimit(req, key, { windowMs: 60 * 60_000, max: 20 });
