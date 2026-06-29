/**
 * POST /api/auth/login — password-based login.
 * Accepts either an email or a 10-digit phone number as `identifier`.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { loginCredentialsSchema } from '@/lib/validation';
import { loginLimit, getIP } from '@/lib/api-rate-limit';

export async function POST(req: NextRequest) {
  const limited = await loginLimit(req, `login:${getIP(req)}`);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = loginCredentialsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.errors[0]?.message || 'Invalid login details',
          },
        },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;
    const normalized = identifier.trim();

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: normalized.toLowerCase() }, { phone: normalized }] },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email/phone or password' } },
        { status: 401 }
      );
    }

    // Guard against accounts that haven't completed signup yet
    if (!user.passwordHash || user.passwordHash === 'NOT_SET') {
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_INCOMPLETE', message: 'Please complete your account setup by verifying your mobile number.' } },
        { status: 400 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email/phone or password' } },
        { status: 401 }
      );
    }

    const token = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    return NextResponse.json({
      success: true,
      data: {
        token,
        refreshToken,
        userId: user.id,
        expiresIn: 24 * 60 * 60,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(7),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to log in' } },
      { status: 500 }
    );
  }
}
