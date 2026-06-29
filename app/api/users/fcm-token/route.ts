/**
 * POST /api/users/fcm-token — save or refresh the caller's FCM registration token.
 * DELETE /api/users/fcm-token — clear the token on logout / notification opt-out.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED' } },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({})) as { token?: string };
  const { token } = body;

  if (!token || typeof token !== 'string' || token.length < 10) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid FCM token' } },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data:  { fcmToken: token },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED' } },
      { status: 401 },
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data:  { fcmToken: null },
  });

  return NextResponse.json({ success: true });
}
