/**
 * Custom Next.js server with Socket.IO and rate limiting.
 * Run via: tsx server.ts  (replaces `next dev` / `next start`)
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocketServer } from './lib/socket-server';
import { checkRateLimit, type RateLimitConfig } from './lib/rate-limit';

const dev  = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

// ── Rate limit rules (most specific first) ────────────────────────────────────
// Key format: `${ip}:${pathname}`
const RATE_RULES: Array<{ match: (p: string) => boolean; config: RateLimitConfig }> = [
  // Brute-force sensitive auth routes — strict
  { match: (p) => p === '/api/auth/login',             config: { windowMs: 15 * 60_000, max: 10  } },
  { match: (p) => p === '/api/auth/register-init',     config: { windowMs: 60 * 60_000, max: 5   } },
  { match: (p) => p === '/api/auth/forgot-password',   config: { windowMs: 60 * 60_000, max: 5   } },
  { match: (p) => p === '/api/auth/send-otp',          config: { windowMs: 60 * 60_000, max: 5   } },
  { match: (p) => p === '/api/auth/verify-phone-otp',  config: { windowMs: 15 * 60_000, max: 10  } },
  { match: (p) => p === '/api/auth/verify-reset-otp',  config: { windowMs: 15 * 60_000, max: 10  } },
  { match: (p) => p === '/api/auth/reset-password',    config: { windowMs: 15 * 60_000, max: 10  } },
  // Upload presign — prevent abuse
  { match: (p) => p === '/api/upload/presign',         config: { windowMs: 60 * 60_000, max: 30  } },
  // All other API routes — generous general limit
  { match: (p) => p.startsWith('/api/'),               config: { windowMs: 60_000,       max: 120 } },
];

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

function send429(res: ServerResponse, retryAfter: number): void {
  const body = JSON.stringify({
    success: false,
    error: { code: 'RATE_LIMITED', message: `Too many requests. Please try again in ${retryAfter} seconds.` },
  });
  res.writeHead(429, {
    'Content-Type':  'application/json',
    'Retry-After':   String(retryAfter),
    'X-RateLimit-Remaining': '0',
  });
  res.end(body);
}

// ── Boot ──────────────────────────────────────────────────────────────────────

const app    = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl  = parse(req.url ?? '/', true);
    const pathname   = parsedUrl.pathname ?? '/';

    // Apply rate limiting only to API routes
    const rule = RATE_RULES.find((r) => r.match(pathname));
    if (rule) {
      const ip     = getClientIp(req);
      const key    = `${ip}:${pathname}`;
      const result = checkRateLimit(key, rule.config);

      res.setHeader('X-RateLimit-Limit',     String(rule.config.max));
      res.setHeader('X-RateLimit-Remaining', String(result.remaining));
      res.setHeader('X-RateLimit-Reset',     String(Math.ceil(result.resetAt / 1000)));

      if (!result.allowed) {
        send429(res, result.retryAfter);
        return;
      }
    }

    handle(req, res, parsedUrl);
  });

  initSocketServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`\n> VivaahAI ready on http://localhost:${port}`);
    console.log(`> Socket.IO attached`);
    console.log(`> Rate limiting active\n`);
  });
});
