/**
 * Authentication API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePhone } from '@/lib/validation';

// POST /api/auth/login - Send OTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

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

    // TODO: Integrate with Twilio to send OTP
    // const otp = generateOTP();
    // await sendOTP(phone, otp);
    // Store OTP in cache with 10-minute expiry

    return NextResponse.json({
      success: true,
      data: {
        otp_sent: true,
        expires_in: 600,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(7),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to send OTP',
        },
      },
      { status: 500 }
    );
  }
}
