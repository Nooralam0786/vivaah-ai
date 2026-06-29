/**
 * GET  /api/users/public-key?userId=xxx  — fetch any user's E2E public key
 * POST /api/users/public-key             — register my own E2E public key
 *
 * Public keys are safe to expose — they are designed to be public.
 * Private keys never leave the client browser.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'userId is required' } },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { e2ePublicKey: true },
    });

    return NextResponse.json({
      success: true,
      data:    { publicKey: user?.e2ePublicKey ?? null },
    });
  } catch (error) {
    console.error('GET public-key error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch public key' } },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const myId = getUserIdFromRequest(req);
    if (!myId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { publicKey } = body as { publicKey?: string };

    if (!publicKey || typeof publicKey !== 'string' || publicKey.length < 40) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid public key' } },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: myId },
      data:  { e2ePublicKey: publicKey },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST public-key error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to save public key' } },
      { status: 500 },
    );
  }
}
