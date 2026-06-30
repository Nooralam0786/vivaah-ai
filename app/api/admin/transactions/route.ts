/**
 * GET /api/admin/transactions — real payment history from Subscription table
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

const PAGE_SIZE = 30;
const TIER_PRICE: Record<string, number> = { gold: 499, platinum: 999, diamond: 2499, free: 0 };

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? '';      // active | cancelled | failed | pending
  const tier   = searchParams.get('tier')   ?? '';      // gold | platinum | diamond
  const search = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (tier)   where.tier   = tier;

  const [total, subs, totalRevenue] = await Promise.all([
    prisma.subscription.count({ where }),
    prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true, fullName: true, email: true, phone: true,
            profile: { select: { city: true, photo: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * PAGE_SIZE,
      take:  PAGE_SIZE,
    }),
    // Total revenue from all active subscriptions
    prisma.subscription.findMany({
      where:  { status: 'active' },
      select: { tier: true, amount: true },
    }),
  ]);

  const revenueSum = totalRevenue.reduce(
    (sum, s) => sum + (s.amount > 0 ? s.amount / 100 : (TIER_PRICE[s.tier] ?? 0)),
    0,
  );

  const filtered = search
    ? subs.filter((s) =>
        s.user.fullName.toLowerCase().includes(search) ||
        s.user.email.toLowerCase().includes(search) ||
        (s.razorpayPaymentId ?? '').toLowerCase().includes(search),
      )
    : subs;

  const transactions = filtered.map((s) => ({
    id:                s.id,
    userId:            s.userId,
    userName:          s.user.fullName,
    userEmail:         s.user.email,
    userPhone:         s.user.phone,
    userPhoto:         s.user.profile?.photo ?? null,
    userCity:          s.user.profile?.city  ?? null,
    tier:              s.tier,
    status:            s.status,
    amount:            s.amount > 0 ? s.amount / 100 : (TIER_PRICE[s.tier] ?? 0),
    razorpayOrderId:   s.razorpayOrderId   ?? null,
    razorpayPaymentId: s.razorpayPaymentId ?? null,
    startedAt:         s.startedAt   ?? null,
    expiresAt:         s.expiresAt   ?? null,
    createdAt:         s.createdAt,
  }));

  return NextResponse.json({
    success: true,
    data: {
      transactions,
      total,
      page,
      totalPages:    Math.ceil(total / PAGE_SIZE),
      totalRevenue:  revenueSum,
    },
  });
}
