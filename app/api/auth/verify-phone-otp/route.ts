/**
 * POST /api/auth/verify-phone-otp
 * Unauthenticated OTP verification for the signup flow.
 * Takes { userId, phone, otp }, marks phoneVerified = true, advances onboardingStep
 * to "set_password", and returns a short-lived "phone verify token" (1 h)
 * that the next step (set-password) uses to prove the phone was verified.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signPhoneVerifyToken } from '@/lib/jwt';
import { verifyPhoneOtpSchema } from '@/lib/validation';
import { loginLimit, getIP } from '@/lib/api-rate-limit';

export async function POST(req: NextRequest) {
  const limited = loginLimit(req, `verify-phone:${getIP(req)}`);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = verifyPhoneOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid request' } },
        { status: 400 }
      );
    }

    const { userId, phone, otp } = parsed.data;

    // Confirm the user exists and owns this phone
    const user = await prisma.user.findFirst({
      where: { id: userId, phone },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Find a valid, unconsumed OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: { phone, code: otp, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_OTP', message: 'That code is invalid or has expired' } },
        { status: 400 }
      );
    }

    // Mark OTP consumed + user phone verified
    await prisma.$transaction([
      prisma.otpCode.update({ where: { id: otpRecord.id }, data: { consumed: true } }),
      prisma.user.update({ where: { id: userId }, data: { phoneVerified: true, onboardingStep: 'set_password' } }),
    ]);

    // Issue a short-lived phone-verify token (1 h) to bridge to the set-password step
    const verifyToken = signPhoneVerifyToken(userId);

    return NextResponse.json({
      success: true,
      data: { verified: true, verifyToken },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Verify-phone-otp error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to verify OTP' } },
      { status: 500 }
    );
  }
}
