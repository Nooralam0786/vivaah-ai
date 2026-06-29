import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { writeApiLimit, readApiLimit } from '@/lib/api-rate-limit';

const submitSchema = z.object({
  partnerName:  z.string().min(2).max(100),
  story:        z.string().min(50).max(2000),
  marriageDate: z.string().optional(),
  city:         z.string().max(100).optional(),
  photo:        z.string().url().optional(),
});

/* GET /api/success-stories — list approved stories (public) */
export async function GET(req: NextRequest) {
  const rl = await readApiLimit(req, `success-stories:${req.headers.get('x-forwarded-for') ?? 'anon'}`);
  if (rl) return rl;

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') ?? '6', 10)));

  const [stories, total] = await Promise.all([
    prisma.successStory.findMany({
      where:   { isPublished: true, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
      select: {
        id: true, partnerName: true, story: true,
        marriageDate: true, city: true, photo: true, createdAt: true,
      },
    }),
    prisma.successStory.count({ where: { isPublished: true, status: 'approved' } }),
  ]);

  return NextResponse.json({
    success: true,
    data: { stories, total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

/* POST /api/success-stories — submit your story */
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const rl = await writeApiLimit(req, `submit-story:${userId}`);
  if (rl) return rl;

  const body   = await req.json().catch(() => ({}));
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message },
    }, { status: 400 });
  }

  const story = await prisma.successStory.create({
    data: { userId, ...parsed.data, status: 'pending' },
  });

  return NextResponse.json({
    success: true,
    data: { id: story.id, message: 'Story submitted! It will appear after admin review (1-2 days).' },
  });
}
