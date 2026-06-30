import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { writeApiLimit } from '@/lib/api-rate-limit';

const REWARD_DAYS = 30; // 1 month free Gold on successful referral

/* GET /api/referral — get my referral code + stats */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const [user, rewards] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } }),
    prisma.referralReward.findMany({
      where:   { referrerId: userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalReferred = rewards.length;
  const totalRewarded = rewards.filter((r) => r.status === 'rewarded').length;
  const totalDaysEarned = rewards
    .filter((r) => r.status === 'rewarded')
    .reduce((sum, r) => sum + r.rewardDays, 0);

  return NextResponse.json({
    success: true,
    data: {
      referralCode:   user?.referralCode ?? '',
      referralLink:   `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/signup?ref=${user?.referralCode}`,
      stats: {
        totalReferred,
        totalRewarded,
        totalDaysEarned,
        pending: totalReferred - totalRewarded,
      },
      rewards: rewards.map((r) => ({
        refereeId:  r.refereeId,
        status:     r.status,
        rewardDays: r.rewardDays,
        createdAt:  r.createdAt,
        rewardedAt: r.rewardedAt,
      })),
    },
  });
}

/* POST /api/referral/apply — apply referral code at signup */
export async function POST(req: NextRequest) {
  const rl = await writeApiLimit(req, `referral-apply:${req.headers.get('x-forwarded-for') ?? 'unknown'}`);
  if (rl) return rl;

  const { referralCode, newUserId } = await req.json() as {
    referralCode?: string;
    newUserId?: string;
  };

  if (!referralCode || !newUserId) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }

  const referrer = await prisma.user.findUnique({
    where:  { referralCode },
    select: { id: true },
  });

  if (!referrer || referrer.id === newUserId) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_CODE' } }, { status: 400 });
  }

  // Mark new user as referred
  await prisma.user.update({
    where: { id: newUserId },
    data:  { referredBy: referrer.id },
  });

  // Create pending reward (rewarded when referee upgrades)
  await prisma.referralReward.upsert({
    where:  { referrerId_refereeId: { referrerId: referrer.id, refereeId: newUserId } },
    update: {},
    create: { referrerId: referrer.id, refereeId: newUserId, status: 'pending', rewardDays: REWARD_DAYS },
  });

  return NextResponse.json({ success: true, data: { referrerId: referrer.id } });
}
