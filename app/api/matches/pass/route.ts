/**
 * POST /api/matches/pass
 *
 * Records a "pass" (skip) so the profile is excluded from future match
 * computations. Also removes any pending Match record between the two users.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const passedUserId: unknown = body?.passedUserId ?? body?.targetUserId;
    if (typeof passedUserId !== 'string' || !passedUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'passedUserId is required' } },
        { status: 400 },
      );
    }

    await Promise.all([
      prisma.pass.upsert({
        where:  { fromUserId_toUserId: { fromUserId: userId, toUserId: passedUserId } },
        update: {},
        create: { fromUserId: userId, toUserId: passedUserId },
      }),
      prisma.match.deleteMany({
        where: { userAId: userId, userBId: passedUserId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data:    { passed: true, message: 'Profile skipped' },
      meta:    { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/matches/pass]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to record pass' } },
      { status: 500 },
    );
  }
}
