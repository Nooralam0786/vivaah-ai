/**
 * Matches API Routes — backed by Prisma (Match + Profile + Like tables).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

function age(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

// GET /api/matches - Get the signed-in user's matches, enriched with profile data
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const matches = await prisma.match.findMany({
      where: { userAId: userId },
      orderBy: { matchPercent: 'desc' },
      include: {
        userB: { include: { profile: true } },
      },
    });

    const likesReceived = await prisma.like.findMany({
      where: { toUserId: userId },
      select: { fromUserId: true },
    });
    const likedByIds = new Set(likesReceived.map((l) => l.fromUserId));

    const data = matches.map((m) => {
      const other = m.userB;
      const profile = other.profile;
      return {
        id: m.id,
        userId: other.id,
        name: other.fullName,
        age: age(profile?.dob),
        profession: profile?.occupation ?? null,
        location: profile?.city ?? null,
        religion: profile?.religion ?? null,
        caste: profile?.caste ?? null,
        height: profile?.height ?? null,
        income: profile?.annualIncome ?? null,
        matchPercent: m.matchPercent,
        isOnline: profile?.isOnline ?? false,
        isVerified: profile?.isVerified ?? false,
        photo: profile?.photo ?? null,
        mutualInterests: profile?.interests ? JSON.parse(profile.interests) : [],
        tag: likedByIds.has(other.id) ? 'mutual' : m.tag,
      };
    });

    return NextResponse.json({
      success: true,
      data: { matches: data, total: data.length },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Matches fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch matches' } },
      { status: 500 }
    );
  }
}

// POST /api/matches - Like a profile, records mutual match if reciprocated
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

    await prisma.like.upsert({
      where: { fromUserId_toUserId: { fromUserId: userId, toUserId: targetUserId } },
      update: {},
      create: { fromUserId: userId, toUserId: targetUserId },
    });

    const reciprocal = await prisma.like.findUnique({
      where: { fromUserId_toUserId: { fromUserId: targetUserId, toUserId: userId } },
    });
    const isMutual = !!reciprocal;

    if (isMutual) {
      await prisma.match.updateMany({
        where: { userAId: userId, userBId: targetUserId },
        data: { tag: 'mutual' },
      });
    }

    return NextResponse.json({
      success: true,
      data: { liked: true, isMutual, message: 'Like recorded' },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to record like' } },
      { status: 500 }
    );
  }
}
