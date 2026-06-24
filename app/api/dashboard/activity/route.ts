/**
 * GET /api/dashboard/activity
 * Returns the last 6 events (likes received + messages received),
 * merged and sorted by recency.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    const [recentLikes, recentMessages] = await Promise.all([
      prisma.like.findMany({
        where: { toUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          fromUser: {
            select: {
              id: true,
              fullName: true,
              profile: { select: { photo: true, city: true } },
            },
          },
        },
      }),
      prisma.message.findMany({
        where: {
          conversation: { OR: [{ userAId: userId }, { userBId: userId }] },
          senderId: { not: userId },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        distinct: ['senderId'],
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              profile: { select: { photo: true } },
            },
          },
        },
      }),
    ]);

    const activities = [
      ...recentLikes.map((l) => ({
        id:      `like_${l.id}`,
        type:    'like',
        emoji:   '💕',
        iconBg:  'bg-rose-100',
        title:   'Someone liked your profile!',
        desc:    `${l.fromUser.fullName} liked your profile`,
        photo:   l.fromUser.profile?.photo ?? null,
        time:    l.createdAt,
      })),
      ...recentMessages.map((m) => {
        const preview = m.text.length > 45 ? m.text.slice(0, 45) + '…' : m.text;
        return {
          id:     `msg_${m.id}`,
          type:   'message',
          emoji:  '💬',
          iconBg: 'bg-blue-100',
          title:  'New message received',
          desc:   `${m.sender.fullName}: ${preview}`,
          photo:  m.sender.profile?.photo ?? null,
          time:   m.createdAt,
        };
      }),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      data:    { activities },
      meta:    { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[GET /api/dashboard/activity]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch activity' } },
      { status: 500 },
    );
  }
}
