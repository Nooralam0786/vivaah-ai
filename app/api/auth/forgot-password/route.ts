/**
 * POST /api/auth/forgot-password
 * Takes an email, generates a 6-digit OTP, stores it, and logs it to console.
 * Always returns success to avoid leaking whether an email is registered.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { otpSendLimit, getIP } from '@/lib/api-rate-limit';

export async function POST(req: NextRequest) {
  const limited = await otpSendLimit(req, `forgot-pw:${getIP(req)}`);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = emailSchema.safeParse(body?.email);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Enter a valid email address' } },
        { status: 400 },
      );
    }

    const email = parsed.data.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Invalidate any previous reset OTPs for this email
      await prisma.otpCode.updateMany({
        where: { phone: `reset:${email}`, consumed: false },
        data: { consumed: true },
      });

      await prisma.otpCode.create({
        data: { phone: `reset:${email}`, code, expiresAt },
      });

      await sendPasswordResetEmail(email, code);

      const isDev = process.env.NODE_ENV === 'development';
      return NextResponse.json({
        success: true,
        data: { sent: true, ...(isDev ? { devOtp: code } : {}) },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    // User not found — still return success to avoid leaking user existence
    return NextResponse.json({
      success: true,
      data: { sent: true },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' } },
      { status: 500 },
    );
  }
}
