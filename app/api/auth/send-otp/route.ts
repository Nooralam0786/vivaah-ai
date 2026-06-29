/**
 * POST /api/auth/send-otp — generates a real OTP, stores it with a 10-minute
 * expiry, and "delivers" it by logging to the server console (no live Twilio
 * credentials are configured, so this is the dev-mode substitute for SMS).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { phoneSchema } from '@/lib/validation';
import { sendOtpSms } from '@/lib/sms';
import { otpSendLimit, getIP } from '@/lib/api-rate-limit';

export async function POST(req: NextRequest) {
  const limited = otpSendLimit(req, `send-otp:${getIP(req)}`);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsedPhone = phoneSchema.safeParse(body.phone);

    if (!parsedPhone.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PHONE', message: 'Invalid phone number' } },
        { status: 400 }
      );
    }

    const phone = parsedPhone.data;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({ data: { phone, code, expiresAt } });

    await sendOtpSms(phone, code);

    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      success: true,
      data: { otp_sent: true, expires_in: 600, ...(isDev ? { devOtp: code } : {}) },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to send OTP' } },
      { status: 500 }
    );
  }
}
