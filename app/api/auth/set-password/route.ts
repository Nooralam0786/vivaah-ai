/**
 * POST /api/auth/set-password
 * Final step of the signup flow.
 * Requires the phone-verify token (from /api/auth/verify-phone-otp) as Bearer.
 * Body: { password }
 * Sets the user's password, advances onboardingStep → "profile_wizard",
 * and returns a full JWT pair so the client can log in.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signAccessToken, signRefreshToken, verifyPhoneVerifyToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const bodySchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate using the phone-verify token
    const header = req.headers.get('authorization');
    if (!header?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing verify token' } },
        { status: 401 }
      );
    }

    const verifyToken = header.slice('Bearer '.length);
    const verifyPayload = verifyPhoneVerifyToken(verifyToken);

    if (!verifyPayload) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired verify token. Please restart the signup process.' } },
        { status: 401 }
      );
    }

    const { userId } = verifyPayload;

    // Validate body
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid password' } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Account not found' } },
        { status: 404 }
      );
    }

    if (!user.phoneVerified) {
      return NextResponse.json(
        { success: false, error: { code: 'PHONE_NOT_VERIFIED', message: 'Phone number must be verified first' } },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, onboardingStep: 'profile_wizard' },
    });

    // Fire-and-forget welcome email
    if (user.email && !user.email.endsWith('@pending.vivaah')) {
      sendWelcomeEmail(user.email, user.fullName).catch(() => {});
    }

    const token = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    return NextResponse.json({
      success: true,
      data: { token, refreshToken, userId, expiresIn: 24 * 60 * 60, onboardingStep: 'profile_wizard' },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Set-password error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to set password' } },
      { status: 500 }
    );
  }
}
