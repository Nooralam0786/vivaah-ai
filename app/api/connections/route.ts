/**
 * GET /api/connections — derives connection status from the Like table:
 *  - Accepted: both users liked each other
 *  - Sent: the signed-in user liked someone who hasn't liked back yet
 *  - Pending: someone liked the signed-in user, awaiting a like back
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

    const [sentLikes, receivedLikes, matches] = await Promise.all([
      prisma.like.findMany({ where: { fromUserId: userId }, include: { toUser: { include: { profile: true } } } }),
      prisma.like.findMany({ where: { toUserId: userId }, include: { fromUser: { include: { profile: true } } } }),
      prisma.match.findMany({ where: { userAId: userId } }),
    ]);

    const matchPercentByUser = new Map(matches.map((m) => [m.userBId, m.matchPercent]));
    const sentToIds = new Set(sentLikes.map((l) => l.toUserId));
    const receivedFromIds = new Set(receivedLikes.map((l) => l.fromUserId));

    const connections: Array<{
      id: string; userId: string; name: string; age: number | null; profession: string | null;
      location: string | null; status: 'Accepted' | 'Pending' | 'Sent'; matchPercent: number;
      photo: string | null; connectedAt: string;
    }> = [];

    for (const like of sentLikes) {
      const isMutual = receivedFromIds.has(like.toUserId);
      connections.push({
        id: like.id,
        userId: like.toUserId,
        name: like.toUser.fullName,
        age: age(like.toUser.profile?.dob),
        profession: like.toUser.profile?.occupation ?? null,
        location: like.toUser.profile?.city ?? null,
        status: isMutual ? 'Accepted' : 'Sent',
        matchPercent: matchPercentByUser.get(like.toUserId) ?? 0,
        photo: like.toUser.profile?.photo ?? null,
        connectedAt: like.createdAt.toISOString(),
      });
    }

    for (const like of receivedLikes) {
      if (sentToIds.has(like.fromUserId)) continue; // already represented above as Accepted
      connections.push({
        id: like.id,
        userId: like.fromUserId,
        name: like.fromUser.fullName,
        age: age(like.fromUser.profile?.dob),
        profession: like.fromUser.profile?.occupation ?? null,
        location: like.fromUser.profile?.city ?? null,
        status: 'Pending',
        matchPercent: matchPercentByUser.get(like.fromUserId) ?? 0,
        photo: like.fromUser.profile?.photo ?? null,
        connectedAt: like.createdAt.toISOString(),
      });
    }

    connections.sort((a, b) => (a.connectedAt < b.connectedAt ? 1 : -1));

    return NextResponse.json({
      success: true,
      data: connections,
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Connections fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch connections' } },
      { status: 500 }
    );
  }
}
