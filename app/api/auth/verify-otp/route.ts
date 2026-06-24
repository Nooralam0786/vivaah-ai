/**
 * POST /api/auth/verify-otp — confirms the OTP code sent via /api/auth/send-otp
 * and marks the signed-in user's phone as verified.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { verifyOTPSchema } from '@/lib/validation';

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
    const parsed = verifyOTPSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid OTP request' },
        },
        { status: 400 }
      );
    }

    const { phone, otp } = parsed.data;

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

    await prisma.$transaction([
      prisma.otpCode.update({ where: { id: otpRecord.id }, data: { consumed: true } }),
      prisma.user.update({ where: { id: userId }, data: { phone, phoneVerified: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { verified: true },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to verify OTP' } },
      { status: 500 }
    );
  }
}
