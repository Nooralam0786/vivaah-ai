import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { z } from 'zod';
import { sensitiveLimit } from '@/lib/api-rate-limit';

const idUploadSchema = z.object({
  idType:   z.enum(['aadhaar', 'pan', 'passport', 'driving_license']),
  idNumber: z.string().min(6).max(20),
});

function validateIdNumber(idType: string, idNumber: string): string | null {
  const n = idNumber.trim().toUpperCase();
  switch (idType) {
    case 'aadhaar':
      if (!/^\d{12}$/.test(n)) return 'Aadhaar must be 12 digits';
      break;
    case 'pan':
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(n)) return 'PAN must be in format AAAAA1234A';
      break;
    case 'passport':
      if (!/^[A-Z][0-9]{7}$/.test(n)) return 'Passport must be in format A1234567';
      break;
    case 'driving_license':
      if (n.length < 8 || n.length > 16) return 'Driving license must be 8–16 characters';
      break;
  }
  return null;
}

function computeFraudScore(idType: string, idNumber: string): number {
  // Simplified heuristic: real implementation would use an ML model.
  // Repeated chars or sequential digits → higher score.
  const n = idNumber.replace(/[^0-9]/g, '');
  const allSame   = n.length > 4 && new Set(n).size === 1;
  const sequential = n.length > 4 && (n === '12345678901234'.slice(0, n.length));
  if (allSame || sequential) return 75;
  if (idType === 'aadhaar' && n.startsWith('0000')) return 60;
  return Math.floor(Math.random() * 20) + 5; // 5–25 for normal submissions
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 },
    );
  }

  const rl = await sensitiveLimit(req, `id-upload:${userId}`);
  if (rl) return rl;

  const body = await req.json().catch(() => ({}));
  const parsed = idUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message ?? 'Invalid input' } },
      { status: 400 },
    );
  }

  const { idType, idNumber } = parsed.data;
  const formatError = validateIdNumber(idType, idNumber);
  if (formatError) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: formatError } },
      { status: 400 },
    );
  }

  try {
    const fraudScore = computeFraudScore(idType, idNumber);
    const autoApprove = fraudScore < 50;

    await prisma.verification.upsert({
      where:  { userId },
      create: {
        userId,
        phoneVerified: false,
        idType,
        idNumber: idNumber.toUpperCase(),
        idVerified:   autoApprove,
        idVerifiedAt: autoApprove ? new Date() : null,
        fraudScore,
        overallStatus: 'pending',
      },
      update: {
        idType,
        idNumber: idNumber.toUpperCase(),
        idVerified:   autoApprove,
        idVerifiedAt: autoApprove ? new Date() : null,
        fraudScore,
        overallStatus: 'pending',
      },
    });

    // Sync phoneVerified from User table
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { phoneVerified: true } });
    if (user) {
      await prisma.verification.update({ where: { userId }, data: { phoneVerified: user.phoneVerified } });
    }

    // Promote to 'verified' if all 3 steps done
    await tryPromoteToVerified(userId);

    return NextResponse.json({
      success: true,
      data: {
        idVerified:    autoApprove,
        fraudScore,
        requiresReview: !autoApprove,
        message: autoApprove
          ? 'ID verified successfully'
          : 'ID submitted for manual review (within 24 hours)',
      },
    });
  } catch (error) {
    console.error('[POST /api/verification/id-upload]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to process ID verification' } },
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
