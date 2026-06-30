/**
 * GET /api/chat/unread — total unread message count for the current user.
 * Used by Navbar to show badge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });

  const counts = await Promise.all(
    conversations.map((c) => {
      const isA      = c.userAId === userId;
      const lastRead = isA ? c.userALastReadAt : c.userBLastReadAt;
      const otherId  = isA ? c.userBId : c.userAId;

      return prisma.message.count({
        where: {
          conversationId: c.id,
          senderId:       otherId,
          ...(lastRead ? { createdAt: { gt: lastRead } } : {}),
        },
      });
    })
  );

  const total = counts.reduce((sum, n) => sum + n, 0);

  return NextResponse.json({ success: true, data: { unread: total } });
}
