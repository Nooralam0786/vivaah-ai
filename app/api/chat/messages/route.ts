/**
 * POST /api/chat/messages — send a message. Creates the conversation on
 * first contact between two users if it doesn't exist yet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { messageSchema } from '@/lib/validation';

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
    const parsed = messageSchema.safeParse({ content: body.content, toUserId: body.toUserId });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid message' },
        },
        { status: 400 }
      );
    }

    const { content, toUserId } = parsed.data;

    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: toUserId },
          { userAId: toUserId, userBId: userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { userAId: userId, userBId: toUserId } });
    }

    const message = await prisma.message.create({
      data: { conversationId: conversation.id, senderId: userId, text: content },
    });

    return NextResponse.json({
      success: true,
      data: { id: message.id, conversationId: conversation.id, text: message.text, time: message.createdAt },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to send message' } },
      { status: 500 }
    );
  }
}
