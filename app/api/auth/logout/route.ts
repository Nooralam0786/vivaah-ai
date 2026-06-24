/**
 * POST /api/auth/logout
 *
 * Auth is stateless JWT with no server-side session table, so there is
 * nothing to revoke server-side (a real token-blacklist/session store is a
 * separate piece of infra this MVP doesn't include). This endpoint exists so
 * services/auth.service.ts's logout() call succeeds; the actual sign-out
 * happens client-side by clearing localStorage.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    data: { loggedOut: true },
    meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
  });
}
