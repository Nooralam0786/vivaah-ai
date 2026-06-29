/**
 * POST /api/chat/conversations/:id/read
 * Marks all messages in a conversation as read for the current user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId  = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv || (conv.userAId !== userId && conv.userBId !== userId)) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  const isA = conv.userAId === userId;
  await prisma.conversation.update({
    where: { id },
    data:  isA ? { userALastReadAt: new Date() } : { userBLastReadAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
