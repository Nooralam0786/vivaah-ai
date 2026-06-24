/**
 * GET /api/dashboard/stats
 * Returns real-time counts for the logged-in user:
 *   matches, likesReceived, messages, profileStrength
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

function calcStrength(profile: {
  photo: string | null;
  dob: string | null;
  religion: string | null;
  qualification: string | null;
  occupation: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  maritalStatus: string | null;
  aboutMe: string | null;
  interests: string;
} | null): number {
  if (!profile) return 0;
  const checks = [
    !!profile.photo,
    !!profile.dob,
    !!profile.religion,
    !!profile.qualification,
    !!profile.occupation,
    !!profile.country,
    !!profile.state,
    !!profile.city,
    !!profile.maritalStatus,
    !!profile.aboutMe,
    (() => { try { return JSON.parse(profile.interests).length > 0; } catch { return false; } })(),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    const [matchCount, likesReceived, messageCount, profile] = await Promise.all([
      prisma.match.count({ where: { userAId: userId } }),
      prisma.like.count({ where: { toUserId: userId } }),
      prisma.message.count({
        where: {
          conversation: { OR: [{ userAId: userId }, { userBId: userId }] },
          senderId: { not: userId },
        },
      }),
      prisma.profile.findUnique({
        where: { userId },
        select: {
          photo: true, dob: true, religion: true, qualification: true,
          occupation: true, country: true, state: true, city: true,
          maritalStatus: true, aboutMe: true, interests: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        matches:         matchCount,
        likesReceived,
        messages:        messageCount,
        profileStrength: calcStrength(profile),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[GET /api/dashboard/stats]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch stats' } },
      { status: 500 },
    );
  }
}
