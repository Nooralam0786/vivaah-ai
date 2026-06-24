/**
 * GET /api/chat/conversations — list the signed-in user's conversations,
 * each with the other participant's profile and the latest message.
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
    });

    const data = conversations
      .map((c) => {
        const other = c.userAId === userId ? c.userB : c.userA;
        const last = c.messages[0];
        return {
          id:       c.id,
          userId:   other.id,
          name:     other.fullName,
          photo:    other.profile?.photo ?? null,
          isOnline: other.profile?.isOnline ?? false,
          lastMsg:  last?.text ?? '',
          time:     (last?.createdAt ?? c.createdAt).toISOString(),
          unread:   0,
        };
      })
      // Sort by latest message first
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

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
