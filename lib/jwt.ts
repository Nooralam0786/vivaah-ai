/**
 * Server-side JWT issuing/verification.
 * Used only inside app/api/** route handlers — never imported by client components.
 */

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-only-insecure-secret';
const ACCESS_TOKEN_TTL = '24h';
const REFRESH_TOKEN_TTL = '30d';

export interface JwtPayload {
  userId: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId } satisfies JwtPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId } satisfies JwtPayload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Extracts and verifies the Bearer token from a request. Returns the userId, or null if missing/invalid. */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;

  const token = header.slice('Bearer '.length);
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}

/** Issues a short-lived (1 h) token that proves phone ownership for the set-password step. */
export function signPhoneVerifyToken(userId: string): string {
  return jwt.sign({ userId, type: 'phone_verify' }, JWT_SECRET, { expiresIn: '1h' });
}

/** Verifies a phone-verify token. Returns the userId or null. */
export function verifyPhoneVerifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== 'phone_verify') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

/** Issues a short-lived (15 min) token after OTP verification, authorising a password reset. */
export function signResetToken(userId: string): string {
  return jwt.sign({ userId, type: 'password_reset' }, JWT_SECRET, { expiresIn: '15m' });
}

/** Verifies a password-reset token. Returns the userId or null. */
export function verifyResetToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== 'password_reset') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
