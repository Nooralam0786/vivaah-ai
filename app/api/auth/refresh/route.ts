/**
 * POST /api/auth/refresh — exchanges a valid refresh token for a new access token.
 * Called automatically by lib/api.ts's response interceptor on a 401.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signAccessToken, verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken: unknown = body?.refreshToken;

    if (typeof refreshToken !== 'string' || !refreshToken) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing refresh token' } },
        { status: 400 }
      );
    }

    const payload = verifyToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Refresh token is invalid or expired' } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Account no longer exists' } },
        { status: 401 }
      );
    }

    const token = signAccessToken(user.id);

    return NextResponse.json({
      success: true,
      data: { token, expiresIn: 24 * 60 * 60 },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to refresh token' } },
      { status: 500 }
    );
  }
}
