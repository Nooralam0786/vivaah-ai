/**
 * OTP Verification API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePhone, validateOTP } from '@/lib/validation';

// POST /api/auth/verify-otp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    // Validation
    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PHONE',
            message: 'Invalid phone number',
          },
        },
        { status: 400 }
      );
    }

    if (!validateOTP(otp)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_OTP',
            message: 'Invalid OTP format',
          },
        },
        { status: 400 }
      );
    }

    // TODO: Verify OTP from cache
    // TODO: Create/update user in database
    // TODO: Generate JWT tokens
    // TODO: Return tokens

    const mockUserId = Math.random().toString(36).substring(7);
    const accessToken = 'mock-access-token-' + mockUserId;
    const refreshToken = 'mock-refresh-token-' + mockUserId;

    return NextResponse.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        userId: mockUserId,
        expiresIn: 86400,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(7),
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to verify OTP',
        },
      },
      { status: 500 }
    );
  }
}
