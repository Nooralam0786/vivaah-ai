import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminOrReject } from '@/lib/admin-auth';

/* GET /api/admin/success-stories — list all stories with filter */
export async function GET(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? ''; // pending | approved | rejected | ''
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit  = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10));

  const where = status ? { status } : {};

  const [stories, total] = await Promise.all([
    prisma.successStory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.successStory.count({ where }),
  ]);

  // Count by status
  const [pending, approved, rejected] = await Promise.all([
    prisma.successStory.count({ where: { status: 'pending' } }),
    prisma.successStory.count({ where: { status: 'approved' } }),
    prisma.successStory.count({ where: { status: 'rejected' } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      stories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      counts: { pending, approved, rejected },
    },
  });
}

/* PATCH /api/admin/success-stories — approve / reject / toggle publish */
export async function PATCH(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { id, action } = await req.json() as {
    id: string;
    action: 'approve' | 'reject' | 'publish' | 'unpublish';
  };

  if (!id || !action) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS' } }, { status: 400 });
  }

  let data: Record<string, unknown> = {};
  if (action === 'approve')   data = { status: 'approved', isPublished: true };
  if (action === 'reject')    data = { status: 'rejected', isPublished: false };
  if (action === 'publish')   data = { isPublished: true };
  if (action === 'unpublish') data = { isPublished: false };

  const story = await prisma.successStory.update({ where: { id }, data });

  return NextResponse.json({ success: true, data: story });
}

/* DELETE /api/admin/success-stories — delete a story */
export async function DELETE(req: NextRequest) {
  const auth = await getAdminOrReject(req);
  if (!auth.ok) return auth.res;

  const { id } = await req.json() as { id: string };
  if (!id) return NextResponse.json({ success: false, error: { code: 'MISSING_ID' } }, { status: 400 });

  await prisma.successStory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
