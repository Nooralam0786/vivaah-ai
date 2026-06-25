/**
 * POST /api/auth/verify-reset-otp
 * Verifies the OTP sent during forgot-password flow.
 * Returns a short-lived reset token (15 min) on success.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailSchema, otpSchema } from '@/lib/validation';
import { signResetToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailParsed = emailSchema.safeParse(body?.email);
    const otpParsed = otpSchema.safeParse(body?.otp);

    if (!emailParsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Enter a valid email address' } },
        { status: 400 },
      );
    }
    if (!otpParsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'OTP must be 6 digits' } },
        { status: 400 },
      );
    }

    const email = emailParsed.data.toLowerCase();
    const code = otpParsed.data;

    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone: `reset:${email}`,
        code,
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP. Please try again.' } },
        { status: 400 },
      );
    }

    // Consume the OTP
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { consumed: true },
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Account not found.' } },
        { status: 404 },
      );
    }

    const resetToken = signResetToken(user.id);

    return NextResponse.json({
      success: true,
      data: { resetToken },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/auth/verify-reset-otp]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' } },
      { status: 500 },
    );
  }
}
