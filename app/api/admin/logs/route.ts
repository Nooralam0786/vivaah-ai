/**
 * GET /api/admin/logs — paginated audit log
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') ?? '';
  const search = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (action) where.action = action;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * PAGE_SIZE,
      take:  PAGE_SIZE,
    }),
  ]);

  const filtered = search
    ? logs.filter((l) =>
        (l.actorName ?? '').toLowerCase().includes(search) ||
        (l.targetName ?? '').toLowerCase().includes(search) ||
        l.action.toLowerCase().includes(search),
      )
    : logs;

  return NextResponse.json({
    success: true,
    data: {
      logs: filtered,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
}
