/**
 * Server-side admin auth helper.
 * Admin emails are set via ADMIN_EMAILS env var (comma-separated).
 * Falls back to arun@techotd.com for local dev.
 */

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from './jwt';
import { prisma } from './db';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'arun@techotd.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function getAdminOrReject(req: NextRequest): Promise<
  | { ok: true; userId: string; email: string; fullName: string }
  | { ok: false; res: NextResponse }
> {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return {
      ok: false,
      res: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true },
  });

  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return {
      ok: false,
      res: NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 },
      ),
    };
  }

  return { ok: true, userId: user.id, email: user.email, fullName: user.fullName };
}
