/**
 * PATCH /api/admin/reports/[id] — review, action, or dismiss a report
 * Optional: ban the reported user at the same time
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  status:     z.enum(['reviewed', 'actioned', 'dismissed']),
  adminNotes: z.string().max(500).optional(),
  banUser:    z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request' } },
      { status: 400 },
    );
  }

  const { status, adminNotes, banUser } = parsed.data;

  const report = await prisma.userReport.findUnique({
    where:   { id: params.id },
    include: {
      reporter: { select: { fullName: true } },
      reported: { select: { fullName: true } },
    },
  });
  if (!report) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Report not found' } },
      { status: 404 },
    );
  }

  const ip = req.headers.get('x-forwarded-for') ?? undefined;

  await prisma.userReport.update({
    where: { id: params.id },
    data:  { status, adminNotes: adminNotes ?? null },
  });

  const auditAction = status === 'actioned' ? 'report_actioned' : 'report_dismissed';
  writeAuditLog({
    action:     auditAction,
    actorId:    auth.userId,
    actorName:  auth.fullName,
    targetId:   report.reportedId,
    targetName: report.reported.fullName,
    meta:       { reportId: report.id, status, adminNotes },
    ip,
  });

  if (banUser && status === 'actioned') {
    await prisma.user.update({
      where: { id: report.reportedId },
      data:  { onboardingStep: 'suspended' },
    });

    writeAuditLog({
      action:     'ban',
      actorId:    auth.userId,
      actorName:  auth.fullName,
      targetId:   report.reportedId,
      targetName: report.reported.fullName,
      meta:       { reason: 'report', reportId: report.id },
      ip,
    });
  }

  return NextResponse.json({ success: true, data: { id: params.id, status } });
}
