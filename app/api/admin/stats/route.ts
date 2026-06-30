/**
 * GET /api/admin/stats
 * Aggregated dashboard metrics + chart data for the admin panel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

const TIER_PRICE: Record<string, number> = { gold: 499, platinum: 999, diamond: 2499 };

function groupByDay(items: { createdAt: Date }[], days: number) {
  const map: Record<string, number> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map[d.toISOString().slice(0, 10)] = 0;
  }
  for (const { createdAt } of items) {
    const key = new Date(createdAt).toISOString().slice(0, 10);
    if (key in map) map[key]++;
  }
  return Object.entries(map).map(([date, count]) => ({
    date,
    label: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    count,
  }));
}

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const since7  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers7d,
    verifiedProfiles,
    totalMatches,
    totalLikes,
    mutualMatches,
    activeSubscriptions,
    pendingVerifications,
    recentUsers,
    recentLikes,
    subscriptionsByTier,
    usersByGender,
    verificationStatuses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7 } } }),
    prisma.profile.count({ where: { isVerified: true } }),
    prisma.match.count(),
    prisma.like.count(),
    prisma.match.count({ where: { tag: 'mutual' } }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.verification.count({ where: { overallStatus: 'unverified' } }),
    prisma.user.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true } }),
    prisma.like.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true } }),
    prisma.subscription.groupBy({ by: ['tier'], where: { status: 'active' }, _count: { tier: true } }),
    prisma.user.groupBy({ by: ['gender'], _count: { gender: true } }),
    prisma.verification.groupBy({ by: ['overallStatus'], _count: { overallStatus: true } }),
  ]);

  // Monthly revenue estimate
  const monthlyRevenue = activeSubscriptions > 0
    ? (await prisma.subscription.findMany({ where: { status: 'active' }, select: { tier: true } }))
        .reduce((sum, s) => sum + (TIER_PRICE[s.tier] ?? 0), 0)
    : 0;

  // Tier distribution for pie chart
  const tierData = subscriptionsByTier.map((t) => ({
    tier:  t.tier,
    label: t.tier.charAt(0).toUpperCase() + t.tier.slice(1),
    count: t._count.tier,
  }));
  const freeCount = totalUsers - activeSubscriptions;
  if (freeCount > 0) tierData.unshift({ tier: 'free', label: 'Free', count: freeCount });

  // Gender distribution
  const genderData = usersByGender
    .filter((g) => g.gender)
    .map((g) => ({ gender: g.gender ?? 'Unknown', count: g._count.gender }));

  // Verification breakdown
  const verifyData = verificationStatuses.map((v) => ({
    status: v.overallStatus,
    label:  v.overallStatus.charAt(0).toUpperCase() + v.overallStatus.slice(1),
    count:  v._count.overallStatus,
  }));

  return NextResponse.json({
    success: true,
    data: {
      kpis: {
        totalUsers,
        newUsers7d,
        verifiedProfiles,
        totalMatches,
        totalLikes,
        mutualMatches,
        activeSubscriptions,
        pendingVerifications,
        monthlyRevenue,
      },
      charts: {
        registrations: groupByDay(recentUsers, 30),
        dailyLikes:    groupByDay(recentLikes,  30),
        tierBreakdown: tierData,
        genderBreakdown: genderData,
        verificationBreakdown: verifyData,
      },
    },
  });
}
