/**
 * GET /api/bookmarks — list saved profiles.
 * POST /api/bookmarks — save a profile.
 * DELETE /api/bookmarks?targetUserId=... — remove a saved profile.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

function age(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { targetUser: { include: { profile: true } } },
    });

    const data = bookmarks.map((b) => ({
      id: b.id,
      userId: b.targetUserId,
      name: b.targetUser.fullName,
      age: age(b.targetUser.profile?.dob),
      profession: b.targetUser.profile?.occupation ?? null,
      location: b.targetUser.profile?.city ?? null,
      isVerified: b.targetUser.profile?.isVerified ?? false,
      photo: b.targetUser.profile?.photo ?? null,
      savedAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Bookmarks fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch bookmarks' } },
      { status: 500 }
    );
  }
}

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
    const targetUserId: unknown = body?.targetUserId;
    if (typeof targetUserId !== 'string' || !targetUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'targetUserId is required' } },
        { status: 400 }
      );
    }

    await prisma.bookmark.upsert({
      where: { userId_targetUserId: { userId, targetUserId } },
      update: {},
      create: { userId, targetUserId },
    });

    return NextResponse.json({
      success: true,
      data: { saved: true },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Bookmark save error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to save bookmark' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const targetUserId = req.nextUrl.searchParams.get('targetUserId');
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'targetUserId is required' } },
        { status: 400 }
      );
    }

    await prisma.bookmark.deleteMany({ where: { userId, targetUserId } });

    return NextResponse.json({
      success: true,
      data: { removed: true },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Bookmark remove error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to remove bookmark' } },
      { status: 500 }
    );
  }
}
