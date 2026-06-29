/**
 * GET /api/chat/conversations — list conversations with real unread counts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    /* Compute unread counts in one batch query */
    const unreadCounts = await Promise.all(
      conversations.map((c) => {
        const isA       = c.userAId === userId;
        const lastRead  = isA ? c.userALastReadAt : c.userBLastReadAt;
        const otherId   = isA ? c.userBId : c.userAId;

        return prisma.message.count({
          where: {
            conversationId: c.id,
            senderId:       otherId,
            ...(lastRead ? { createdAt: { gt: lastRead } } : {}),
          },
        });
      })
    );

    const data = conversations.map((c, i) => {
      const other = c.userAId === userId ? c.userB : c.userA;
      const last  = c.messages[0];
      return {
        id:       c.id,
        userId:   other.id,
        name:     other.fullName,
        photo:    other.profile?.photo ?? null,
        isOnline: other.profile?.isOnline ?? false,
        lastMsg:  last?.text ?? '',
        time:     (last?.createdAt ?? c.createdAt).toISOString(),
        unread:   unreadCounts[i],
      };
    }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch conversations' } },
      { status: 500 }
    );
  }
}
