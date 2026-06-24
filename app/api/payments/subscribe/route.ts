/**
 * Payment/Subscription API Routes.
 *
 * No live Razorpay credentials are configured, so actual payment capture is
 * stubbed (a fake order ID is returned) — but the Subscription row created
 * here is real, persisted, and tied to the signed-in user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { tierEnum } from '@/lib/validation';

const TIER_PRICES: Record<string, number> = {
  gold: 49900,
  platinum: 99900,
  diamond: 249900,
};

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsedTier = tierEnum.safeParse(body.tier);

    if (!parsedTier.success || parsedTier.data === 'free') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid subscription tier' } },
        { status: 400 }
      );
    }

    const tier = parsedTier.data;
    const amount = TIER_PRICES[tier] ?? 0;

    const subscription = await prisma.subscription.create({
      data: { userId, tier, status: 'pending' },
    });

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        razorpayOrderId: 'order_' + Math.random().toString(36).substring(7),
        amount,
        currency: 'INR',
        tier,
        status: subscription.status,
      },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create subscription' } },
      { status: 500 }
    );
  }
}
