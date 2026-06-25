/**
 * POST /api/auth/reset-password
 * Accepts a password-reset token (Bearer) and new password.
 * Updates the user's passwordHash.
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { verifyResetToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Reset token missing or invalid.' } },
        { status: 401 },
      );
    }

    const token = authHeader.slice('Bearer '.length);
    const payload = verifyResetToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Reset link has expired. Please request a new one.' } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const password: unknown = body?.password;

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters.' } },
        { status: 400 },
      );
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must contain an uppercase letter, a number, and a special character.' } },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Password updated successfully.' },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/auth/reset-password]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' } },
      { status: 500 },
    );
  }
}
