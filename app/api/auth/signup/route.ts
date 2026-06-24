/**
 * POST /api/auth/signup — creates a real user account and issues tokens.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { signupSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.errors[0]?.message || 'Invalid signup details',
          },
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message:
              existing.email === email
                ? 'An account with this email already exists'
                : 'An account with this phone number already exists',
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        profile: { create: {} },
      },
    });

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create account' } },
      { status: 500 }
    );
  }
}
