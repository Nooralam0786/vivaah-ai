import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 },
    );
  }

  try {
    const [user, verification] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { phoneVerified: true } }),
      prisma.verification.findUnique({ where: { userId } }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        phoneVerified:  user.phoneVerified,
        idVerified:     verification?.idVerified     ?? false,
        idType:         verification?.idType         ?? null,
        livenessStatus: verification?.livenessStatus ?? 'not_started',
        overallStatus:  verification?.overallStatus  ?? 'unverified',
        verifiedAt:     verification?.verifiedAt     ?? null,
      },
    });
  } catch (error) {
    console.error('[GET /api/verification/status]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch status' } },
      { status: 500 },
    );
  }
}
