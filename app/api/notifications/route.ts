import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { readApiLimit, writeApiLimit } from '@/lib/api-rate-limit';

/* GET /api/notifications — fetch latest 30 notifications */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const rl = await readApiLimit(req, `notifs:${userId}`);
  if (rl) return rl;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    30,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return NextResponse.json({ success: true, data: { notifications, unreadCount } });
}

/* POST /api/notifications/read — mark all (or specific) as read */
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });

  const rl = await writeApiLimit(req, `notifs-read:${userId}`);
  if (rl) return rl;

  const body = await req.json().catch(() => ({})) as { id?: string };

  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId },
      data:  { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    });
  }

  return NextResponse.json({ success: true });
}
