/**
 * POST /api/reports — user reports another user's profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { writeApiLimit } from '@/lib/api-rate-limit';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  reportedId:  z.string().min(1),
  reason:      z.enum(['harassment', 'fake_profile', 'spam', 'inappropriate_photos', 'scam', 'other']),
  description: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    const rl = await writeApiLimit(req, `report:${userId}`);
    if (rl) return rl;

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: parsed.error.issues } },
        { status: 400 },
      );
    }

    const { reportedId, reason, description } = parsed.data;

    if (reportedId === userId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Cannot report yourself' } },
        { status: 400 },
      );
    }

    const reported = await prisma.user.findUnique({ where: { id: reportedId }, select: { id: true, fullName: true } });
    if (!reported) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 },
      );
    }

    // Upsert — one active report per pair
    const report = await prisma.userReport.upsert({
      where:  { reporterId_reportedId: { reporterId: userId, reportedId } },
      update: { reason, description: description ?? null, status: 'pending', adminNotes: null },
      create: { reporterId: userId, reportedId, reason, description: description ?? null },
    });

    const reporter = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true } });

    writeAuditLog({
      action:     'report',
      actorId:    userId,
      actorName:  reporter?.fullName,
      targetId:   reportedId,
      targetName: reported.fullName,
      meta:       { reason, reportId: report.id },
      ip:         req.headers.get('x-forwarded-for') ?? undefined,
    });

    return NextResponse.json({ success: true, data: { reportId: report.id } }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reports]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to submit report' } },
      { status: 500 },
    );
  }
}
