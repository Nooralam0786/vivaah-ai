/**
 * POST /api/contact — backs the Contact Us page form. Persists submissions;
 * no outbound email is sent (no SendGrid credentials configured).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { contactMessageSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message || 'Invalid message' },
        },
        { status: 400 }
      );
    }

    const userId = getUserIdFromRequest(req); // optional — contact form works while logged out too

    const saved = await prisma.contactMessage.create({
      data: { ...parsed.data, userId: userId ?? undefined },
    });

    return NextResponse.json({
      success: true,
      data: { id: saved.id, received: true },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to send your message' } },
      { status: 500 }
    );
  }
}
