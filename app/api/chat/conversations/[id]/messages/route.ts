/**
 * GET /api/chat/conversations/:id/messages — messages in one conversation.
 * Verifies the requester is a participant before returning anything.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const conversation = await prisma.conversation.findUnique({ where: { id: params.id } });
    if (!conversation || (conversation.userAId !== userId && conversation.userBId !== userId)) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Conversation not found' } },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    const data = messages.map((m) => ({
      id: m.id,
      text: m.text,
      sender: m.senderId === userId ? 'me' : 'them',
      time: m.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch messages' } },
      { status: 500 }
    );
  }
}
