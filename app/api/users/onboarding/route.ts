/**
 * PATCH /api/users/onboarding
 * Advances the authenticated user's onboardingStep.
 * Only allows moving forward (prevents downgrade).
 * Called by the profile wizard and photo-upload pages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { z } from 'zod';

const STEP_ORDER = ['verify_otp', 'set_password', 'profile_wizard', 'photo_upload', 'complete'] as const;
type OnboardingStep = (typeof STEP_ORDER)[number];

const bodySchema = z.object({
  step: z.enum(STEP_ORDER),
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid step' } },
        { status: 400 }
      );
    }

    const { step } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const currentIdx = STEP_ORDER.indexOf(user.onboardingStep as OnboardingStep);
    const targetIdx = STEP_ORDER.indexOf(step);

    // Prevent going backwards (allow going to same step for idempotency)
    if (targetIdx < currentIdx) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STEP', message: 'Cannot go back to a previous step' } },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: step },
    });

    return NextResponse.json({
      success: true,
      data: { onboardingStep: updated.onboardingStep },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Onboarding step error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update onboarding step' } },
      { status: 500 }
    );
  }
}
