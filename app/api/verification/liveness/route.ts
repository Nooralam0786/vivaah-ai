/**
 * POST /api/verification/liveness
 *
 * Accepts a selfie upload URL (already uploaded to S3 via presign, or a
 * base64 data-URL for local dev) and marks liveness as approved.
 *
 * In production this would call a TensorFlow/ML liveness service.
 * For MVP we perform basic validation and auto-approve.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { z } from 'zod';
import { sensitiveLimit } from '@/lib/api-rate-limit';

const livenessSchema = z.object({
  selfieUrl: z.string().min(1, 'Selfie URL is required'),
});

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 },
    );
  }

  const rl = await sensitiveLimit(req, `liveness:${userId}`);
  if (rl) return rl;

  const body = await req.json().catch(() => ({}));
  const parsed = livenessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message ?? 'Invalid input' } },
      { status: 400 },
    );
  }

  const { selfieUrl } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phoneVerified: true },
    });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 },
      );
    }

    await prisma.verification.upsert({
      where:  { userId },
      create: {
        userId,
        phoneVerified:  user.phoneVerified,
        livenessStatus: 'approved',
        selfieUrl,
        livenessAt:     new Date(),
        overallStatus:  'pending',
      },
      update: {
        phoneVerified:  user.phoneVerified,
        livenessStatus: 'approved',
        selfieUrl,
        livenessAt:     new Date(),
      },
    });

    // Try to promote overall status to verified
    await tryPromoteToVerified(userId);

    const updated = await prisma.verification.findUnique({ where: { userId } });

    return NextResponse.json({
      success: true,
      data: {
        livenessStatus: 'approved',
        overallStatus:  updated?.overallStatus ?? 'pending',
        isFullyVerified: updated?.overallStatus === 'verified',
        message: updated?.overallStatus === 'verified'
          ? 'Congratulations! Your profile is now verified.'
          : 'Selfie verified. Complete remaining steps to get your verified badge.',
      },
    });
  } catch (error) {
    console.error('[POST /api/verification/liveness]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to process liveness check' } },
      { status: 500 },
    );
  }
}

async function tryPromoteToVerified(userId: string) {
  const [user, verification] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { phoneVerified: true } }),
    prisma.verification.findUnique({ where: { userId } }),
  ]);

  if (!user || !verification) return;

  const allDone =
    user.phoneVerified &&
    verification.idVerified &&
    verification.livenessStatus === 'approved';

  if (allDone && verification.overallStatus !== 'verified') {
    await Promise.all([
      prisma.verification.update({
        where: { userId },
        data:  { overallStatus: 'verified', verifiedAt: new Date() },
      }),
      prisma.profile.updateMany({
        where: { userId },
        data:  { isVerified: true },
      }),
    ]);
  }
}
