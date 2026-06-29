/**
 * GET /api/admin/reports — paginated list of user reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? '';     // pending | reviewed | actioned | dismissed
  const reason = searchParams.get('reason') ?? '';
  const search = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (reason) where.reason = reason;

  const [total, reports] = await Promise.all([
    prisma.userReport.count({ where }),
    prisma.userReport.findMany({
      where,
      include: {
        reporter: { select: { id: true, fullName: true, email: true, phone: true } },
        reported: {
          select: {
            id: true, fullName: true, email: true, phone: true,
            profile: { select: { photo: true, city: true, isVerified: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * PAGE_SIZE,
      take:  PAGE_SIZE,
    }),
  ]);

  // Client-side search filter on names (Prisma SQLite has no ILIKE)
  const filtered = search
    ? reports.filter((r) =>
        r.reporter.fullName.toLowerCase().includes(search) ||
        r.reported.fullName.toLowerCase().includes(search) ||
        r.reporter.email.toLowerCase().includes(search),
      )
    : reports;

  return NextResponse.json({
    success: true,
    data: {
      reports: filtered,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  });
}
