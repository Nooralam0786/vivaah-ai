/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature and activates subscription.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { sendPaymentReceiptEmail } from '@/lib/email';
import { TIER_AMOUNTS } from '@/lib/razorpay';

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  tier:                z.enum(['gold', 'platinum', 'diamond']),
});

export async function POST(req: NextRequest) {
  try {
  /* Auth */
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload?.userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  /* Validate */
  const body   = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing payment details' } }, { status: 400 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = parsed.data;

  /* Verify signature */
  const secret   = process.env.RAZORPAY_KEY_SECRET ?? '';
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    await prisma.subscription.updateMany({
      where: { razorpayOrderId: razorpay_order_id, userId: payload.userId },
      data:  { status: 'failed' },
    });
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_SIGNATURE', message: 'Payment verification failed' } },
      { status: 400 },
    );
  }

  /* Load user for email */
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  /* Activate subscription */
  const now       = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month

  await prisma.$transaction([
    /* Cancel old active subs */
    prisma.subscription.updateMany({
      where: { userId: payload.userId, status: 'active' },
      data:  { status: 'cancelled' },
    }),
    /* Activate new sub */
    prisma.subscription.updateMany({
      where: { razorpayOrderId: razorpay_order_id, userId: payload.userId },
      data:  {
        status:            'active',
        razorpayPaymentId: razorpay_payment_id,
        startedAt:         now,
        expiresAt,
      },
    }),
    /* Mark onboarding complete */
    prisma.user.update({
      where: { id: payload.userId },
      data:  { onboardingStep: 'complete' },
    }),
  ]);

  /* Fire-and-forget receipt email */
  if (user) {
    sendPaymentReceiptEmail(
      user.email,
      user.fullName,
      tier,
      TIER_AMOUNTS[tier],
      razorpay_payment_id,
      expiresAt.toISOString(),
    ).catch(() => {});
  }

  /* Trigger referral reward if this user was referred */
  if (user?.referredBy) {
    prisma.referralReward.updateMany({
      where:  { referrerId: user.referredBy, refereeId: payload.userId, status: 'pending' },
      data:   { status: 'rewarded', rewardedAt: new Date() },
    }).catch(() => {});
  }

  return NextResponse.json({
    success: true,
    data: {
      message:   'Payment successful! Your subscription is now active.',
      tier,
      expiresAt: expiresAt.toISOString(),
    },
  });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Payment verification failed' } },
      { status: 500 },
    );
  }
}
