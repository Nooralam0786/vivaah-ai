/**
 * POST /api/auth/register-init
 * Phase-1 of the new signup flow.
 * If a previous incomplete attempt exists (passwordHash = 'NOT_SET'), we
 * update that record and resend OTP instead of blocking the user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { registerInitSchema } from '@/lib/validation';
import { sendOtpSms } from '@/lib/sms';
import { otpSendLimit, getIP } from '@/lib/api-rate-limit';

export async function POST(req: NextRequest) {
  const limited = await otpSendLimit(req, `register:${getIP(req)}`);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = registerInitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid details' } },
        { status: 400 }
      );
    }

    const { fullName, phone, email } = parsed.data;
    // Normalize gender to lowercase so matching filters work consistently
    const gender = parsed.data.gender ? parsed.data.gender.toLowerCase() : parsed.data.gender;

    // Use placeholder email when user skips the optional field
    const resolvedEmail = email && email.trim() ? email.trim().toLowerCase() : `${phone}@pending.vivaah`;

    const existingByPhone = await prisma.user.findUnique({ where: { phone } });

    // Completed account — must log in instead
    if (existingByPhone && existingByPhone.passwordHash !== 'NOT_SET') {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this phone number already exists. Please log in.' } },
        { status: 409 }
      );
    }

    // Check email conflict only against OTHER completed accounts
    if (email && email.trim()) {
      const existingByEmail = await prisma.user.findUnique({ where: { email: resolvedEmail } });
      if (existingByEmail && existingByEmail.phone !== phone && existingByEmail.passwordHash !== 'NOT_SET') {
        return NextResponse.json(
          { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email already exists. Please log in.' } },
          { status: 409 }
        );
      }
    }

    let user;

    if (existingByPhone && existingByPhone.passwordHash === 'NOT_SET') {
      // Incomplete previous attempt — update and resend OTP
      user = await prisma.user.update({
        where: { phone },
        data: {
          fullName, email: resolvedEmail, gender, onboardingStep: 'verify_otp', phoneVerified: false,
          profile: { upsert: { create: { gender: gender ?? null }, update: { gender: gender ?? null } } },
        },
      });
    } else {
      // Fresh registration
      user = await prisma.user.create({
        data: {
          fullName,
          email: resolvedEmail,
          phone,
          passwordHash: 'NOT_SET',
          phoneVerified: false,
          onboardingStep: 'verify_otp',
          gender,
          profile: { create: { gender: gender ?? null } },
        },
      });
    }

    // Invalidate any previous unused OTPs for this phone
    await prisma.otpCode.updateMany({
      where: { phone, consumed: false },
      data: { consumed: true },
    });

    // Generate fresh OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpCode.create({ data: { phone, code, expiresAt } });

    await sendOtpSms(phone, code);

    const isDev = process.env.NODE_ENV === 'development';

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        phone,
        ...(isDev ? { devOtp: code } : {}),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Register-init error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create account' } },
      { status: 500 }
    );
  }
}
