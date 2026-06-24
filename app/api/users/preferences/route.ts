/**
 * User Match Preferences API Routes — backed by Prisma (Preference table).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

const DEFAULT_PREFERENCE = {
  ageMin: 18,
  ageMax: 35,
  religion: 'Any Religion',
  location: '',
  education: 'Any',
};

// GET /api/users/preferences - Get current user's match preferences
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const preference = await prisma.preference.findUnique({ where: { userId } });

    return NextResponse.json({
      success: true,
      data: preference ? { ...preference, location: preference.location ?? '' } : { ...DEFAULT_PREFERENCE },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch preferences' } },
      { status: 500 }
    );
  }
}

// PATCH /api/users/preferences - Update current user's match preferences
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data: Record<string, string | number> = {};

    if (Number.isFinite(body.ageMin)) data.ageMin = Math.trunc(body.ageMin);
    if (Number.isFinite(body.ageMax)) data.ageMax = Math.trunc(body.ageMax);
    if (typeof body.religion === 'string') data.religion = body.religion;
    if (typeof body.location === 'string') data.location = body.location;
    if (typeof body.education === 'string') data.education = body.education;

    const preference = await prisma.preference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...DEFAULT_PREFERENCE, ...data },
    });

    return NextResponse.json({
      success: true,
      data: { ...preference, location: preference.location ?? '' },
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update preferences' } },
      { status: 500 }
    );
  }
}
