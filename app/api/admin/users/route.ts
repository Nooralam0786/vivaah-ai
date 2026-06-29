/**
 * GET /api/admin/users — paginated user list with search + filter
 * PATCH /api/admin/users — bulk actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const page    = Math.max(1, parseInt(searchParams.get('page')   ?? '1',  10));
  const limit   = Math.min(50, Math.max(1, parseInt(searchParams.get('limit')  ?? '20', 10)));
  const search  = searchParams.get('search')  ?? '';
  const tier    = searchParams.get('tier')    ?? '';
  const verified = searchParams.get('verified') ?? '';

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email:    { contains: search } },
      { phone:    { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: { select: { isVerified: true, photo: true, city: true, occupation: true } },
        subscriptions: { where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 1 },
        verification: { select: { overallStatus: true } },
        _count: { select: { likesGiven: true, likesReceived: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.user.count({ where }),
  ]);

  const data = users
    .filter((u) => {
      if (tier && (u.subscriptions[0]?.tier ?? 'free') !== tier) return false;
      if (verified === 'true'  && !u.profile?.isVerified) return false;
      if (verified === 'false' &&  u.profile?.isVerified) return false;
      return true;
    })
    .map((u) => ({
      id:             u.id,
      fullName:       u.fullName,
      email:          u.email,
      phone:          u.phone,
      gender:         u.gender,
      onboardingStep: u.onboardingStep,
      createdAt:      u.createdAt,
      photo:          u.profile?.photo ?? null,
      city:           u.profile?.city ?? null,
      occupation:     u.profile?.occupation ?? null,
      isVerified:     u.profile?.isVerified ?? false,
      subscriptionTier: u.subscriptions[0]?.tier ?? 'free',
      verificationStatus: u.verification?.overallStatus ?? 'unverified',
      likesGiven:     u._count.likesGiven,
      likesReceived:  u._count.likesReceived,
    }));

  return NextResponse.json({
    success: true,
    data: { users: data, total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
