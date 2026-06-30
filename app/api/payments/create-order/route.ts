/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for the selected subscription tier.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { razorpay, TIER_AMOUNTS, TIER_LABELS } from '@/lib/razorpay';
import { writeApiLimit } from '@/lib/api-rate-limit';

const schema = z.object({
  tier: z.enum(['gold', 'platinum', 'diamond']),
});

export async function POST(req: NextRequest) {
  /* Rate limit */
  const rl = await writeApiLimit(req, `create-order:${req.headers.get('x-forwarded-for') ?? 'local'}`);
  if (rl) return rl;

  /* Auth */
  const authHeader = req.headers.get('authorization');
  const token      = authHeader?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload?.userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, { status: 401 });

  /* Validate */
  const body   = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid tier' } }, { status: 400 });

  const { tier } = parsed.data;
  const amount   = TIER_AMOUNTS[tier];
  const user     = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, { status: 404 });

  /* Create Razorpay order */
  const receipt = `vzh_${payload.userId.slice(-8)}_${tier}_${Date.now()}`;

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId: payload.userId,
        tier,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('[Payments] Razorpay order creation failed:', err);
    return NextResponse.json(
      { success: false, error: { code: 'PAYMENT_ERROR', message: 'Failed to create payment order. Check Razorpay credentials.' } },
      { status: 502 },
    );
  }

  /* Save pending subscription */
  await prisma.subscription.create({
    data: {
      userId:          payload.userId,
      tier,
      status:          'pending',
      amount,
      razorpayOrderId: razorpayOrder.id,
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      orderId:     razorpayOrder.id,
      amount,
      currency:    'INR',
      keyId:       process.env.RAZORPAY_KEY_ID ?? '',
      tier,
      description: TIER_LABELS[tier],
      prefill: {
        name:    user.fullName,
        email:   user.email.includes('@pending.vivaah') ? '' : user.email,
        contact: user.phone,
      },
    },
  });
}
