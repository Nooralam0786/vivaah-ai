/**
 * PATCH /api/users/plan
 * Saves the user's chosen plan during onboarding.
 * Free tier → no subscription row needed (profile API defaults to 'free').
 * Paid tiers → create an active subscription immediately (no payment in dev).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { z } from 'zod';

const planSchema = z.object({
  tier: z.enum(['free', 'gold', 'platinum', 'diamond']),
});

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = planSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid plan tier' } },
      { status: 400 },
    );
  }

  const { tier } = parsed.data;

  try {
    if (tier !== 'free') {
      // Cancel any existing pending subscriptions first
      await prisma.subscription.updateMany({
        where:  { userId, status: 'pending' },
        data:   { status: 'cancelled' },
      });

      // Create active subscription
      await prisma.subscription.create({
        data: { userId, tier, status: 'active' },
      });
    }

    // Mark onboarding as complete
    await prisma.user.update({
      where: { id: userId },
      data:  { onboardingStep: 'complete' },
    });

    return NextResponse.json({
      success: true,
      data: { tier, message: tier === 'free' ? 'Free plan activated' : `${tier} plan activated` },
    });
  } catch (error) {
    console.error('[PATCH /api/users/plan]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to save plan' } },
      { status: 500 },
    );
  }
}
