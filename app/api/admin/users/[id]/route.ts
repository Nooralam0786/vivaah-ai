/**
 * GET  /api/admin/users/[id] — user detail
 * PATCH /api/admin/users/[id] — admin actions: suspend, activate, promote
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const actionSchema = z.object({
  action: z.enum(['suspend', 'activate', 'delete']),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile:       true,
      verification:  true,
      subscriptions: { orderBy: { createdAt: 'desc' } },
      _count: { select: { likesGiven: true, likesReceived: true, messagesSent: true } },
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
      { status: 404 },
    );
  }

  const { passwordHash: _pw, ...safeUser } = user;
  return NextResponse.json({ success: true, data: safeUser });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;
  const body   = await req.json().catch(() => ({}));
  const parsed = actionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid action' } },
      { status: 400 },
    );
  }

  const { action } = parsed.data;

  const ip = req.headers.get('x-forwarded-for') ?? undefined;

  try {
    const target = await prisma.user.findUnique({ where: { id }, select: { fullName: true } });

    if (action === 'delete') {
      await prisma.user.delete({ where: { id } });
      writeAuditLog({ action: 'delete_user', actorId: auth.userId, actorName: auth.fullName, targetId: id, targetName: target?.fullName, ip });
      return NextResponse.json({ success: true, data: { message: 'User deleted' } });
    }

    // suspend / activate — toggle onboardingStep as a suspension flag
    const onboardingStep = action === 'suspend' ? 'suspended' : 'complete';
    await prisma.user.update({ where: { id }, data: { onboardingStep } });

    writeAuditLog({
      action:     action === 'suspend' ? 'ban' : 'unban',
      actorId:    auth.userId,
      actorName:  auth.fullName,
      targetId:   id,
      targetName: target?.fullName,
      ip,
    });

    return NextResponse.json({
      success: true,
      data: { message: action === 'suspend' ? 'User suspended' : 'User activated' },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Action failed' } },
      { status: 500 },
    );
  }
}
