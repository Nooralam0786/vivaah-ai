/**
 * GET /api/admin/verifications — verification queue
 * PATCH /api/admin/verifications — approve/reject a verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const reviewSchema = z.object({
  userId: z.string(),
  action: z.enum(['approve', 'reject']),
});

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'unverified';
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit  = 20;

  const [verifications, total] = await Promise.all([
    prisma.verification.findMany({
      where:   { overallStatus: status },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true, createdAt: true, profile: { select: { photo: true } } } } },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.verification.count({ where: { overallStatus: status } }),
  ]);

  return NextResponse.json({
    success: true,
    data: { verifications, total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const body   = await req.json().catch(() => ({}));
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request' } },
      { status: 400 },
    );
  }

  const { userId, action } = parsed.data;

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true } });

  await prisma.verification.upsert({
    where:  { userId },
    update: {
      overallStatus: action === 'approve' ? 'verified' : 'rejected',
      verifiedAt:    action === 'approve' ? new Date() : null,
    },
    create: {
      userId,
      overallStatus: action === 'approve' ? 'verified' : 'rejected',
      verifiedAt:    action === 'approve' ? new Date() : null,
    },
  });

  if (action === 'approve') {
    await prisma.profile.update({
      where: { userId },
      data:  { isVerified: true },
    });
  }

  writeAuditLog({
    action:     'verify',
    actorId:    auth.userId,
    actorName:  auth.fullName,
    targetId:   userId,
    targetName: target?.fullName,
    meta:       { action },
    ip:         req.headers.get('x-forwarded-for') ?? undefined,
  });

  return NextResponse.json({
    success: true,
    data:    { message: action === 'approve' ? 'Verification approved' : 'Verification rejected' },
  });
}
