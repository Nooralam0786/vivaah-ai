/**
 * GET /api/visitors
 * Returns profiles of users who viewed my profile, most recent first.
 * Includes their name, photo, match score, and when they viewed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import {
  calculateMatchScore,
  calculateAge,
  type CurrentUserContext,
  type CandidateProfile,
} from '@/services/matching.engine';

function safeJson(str: string | null | undefined, fallback: string[] = []): string[] {
  if (!str) return fallback;
  try { const v = JSON.parse(str); return Array.isArray(v) ? v : fallback; }
  catch { return fallback; }
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60)    return 'Just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  if (d === 1)   return 'Yesterday';
  if (d < 7)     return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    const page  = Math.max(1, parseInt(new URL(req.url).searchParams.get('page')  ?? '1',  10));
    const limit = Math.min(50, Math.max(1, parseInt(new URL(req.url).searchParams.get('limit') ?? '20', 10)));

    // Get raw views of my profile — dedupe per viewer, keep most recent
    const rawViews = await prisma.profileView.findMany({
      where: { profileId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        viewer: {
          include: { profile: true, preference: true },
        },
      },
    });

    // Dedupe: one entry per viewer (most recent)
    const seen = new Set<string>();
    const uniqueViews = rawViews.filter((v) => {
      if (seen.has(v.viewerId)) return false;
      seen.add(v.viewerId);
      return true;
    });

    const total      = uniqueViews.length;
    const totalPages = Math.ceil(total / limit);
    const paginated  = uniqueViews.slice((page - 1) * limit, page * limit);

    // Fetch current user for scoring
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, preference: true },
    });

    const vp  = currentUser?.profile;
    const vpr = currentUser?.preference;
    const userCtx: CurrentUserContext = {
      userId,
      gender:        currentUser?.gender ?? vp?.gender ?? null,
      dob:           vp?.dob           ?? null,
      religion:      vp?.religion      ?? null,
      caste:         vp?.caste         ?? null,
      qualification: vp?.qualification ?? null,
      city:          vp?.city          ?? null,
      state:         vp?.state         ?? null,
      country:       vp?.country       ?? null,
      interests:     safeJson(vp?.interests),
      smokingHabit:  (vp as Record<string, unknown>)?.smokingHabit  as string ?? null,
      drinkingHabit: (vp as Record<string, unknown>)?.drinkingHabit as string ?? null,
      dietPreference:(vp as Record<string, unknown>)?.dietPreference as string ?? null,
      preferences:   vpr ? {
        ageMin: vpr.ageMin, ageMax: vpr.ageMax,
        religion: vpr.religion, education: vpr.education, location: vpr.location,
        castePreference:   (vpr as Record<string, unknown>).castePreference   as string ?? null,
        maritalStatusPref: (vpr as Record<string, unknown>).maritalStatusPref as string ?? null,
        smokingPref:       (vpr as Record<string, unknown>).smokingPref       as string ?? null,
        drinkingPref:      (vpr as Record<string, unknown>).drinkingPref      as string ?? null,
      } : null,
    };

    const visitors = paginated.map(({ viewerId, viewer, createdAt }) => {
      const u = viewer;
      const p = u.profile;

      let matchPercent = 0;
      if (p) {
        const cp: CandidateProfile = {
          userId: u.id, fullName: u.fullName,
          gender: u.gender ?? p.gender ?? null, dob: p.dob ?? null,
          religion: p.religion ?? null, caste: p.caste ?? null,
          qualification: p.qualification ?? null, occupation: p.occupation ?? null,
          country: p.country ?? null, state: p.state ?? null, city: p.city ?? null,
          interests: safeJson(p.interests),
          smokingHabit:   (p as Record<string, unknown>).smokingHabit   as string ?? null,
          drinkingHabit:  (p as Record<string, unknown>).drinkingHabit  as string ?? null,
          dietPreference: (p as Record<string, unknown>).dietPreference as string ?? null,
          photo: p.photo ?? null, photos: safeJson(p.photos),
          isVerified: p.isVerified, isOnline: p.isOnline,
          lastActiveAt: (p as Record<string, unknown>).lastActiveAt as Date ?? null,
          maritalStatus: p.maritalStatus ?? null,
          height: p.height ?? null, annualIncome: p.annualIncome ?? null,
        };
        const result = calculateMatchScore(userCtx, cp);
        matchPercent = result.score;
      }

      return {
        id:           `vis_${viewerId}_${createdAt.getTime()}`,
        userId:       viewerId,
        name:         u.fullName,
        age:          p ? calculateAge(p.dob) : null,
        profession:   p?.occupation ?? null,
        location:     p ? [p.city, p.state].filter(Boolean).join(', ') || null : null,
        religion:     p?.religion ?? null,
        photo:        p?.photo ?? null,
        isVerified:   p?.isVerified ?? false,
        isOnline:     p?.isOnline ?? false,
        matchPercent,
        viewedAt:     createdAt.toISOString(),
        viewedAgo:    timeAgo(createdAt),
      };
    });

    return NextResponse.json({
      success: true,
      data: { visitors, total, page, limit, totalPages },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[GET /api/visitors]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch visitors' } },
      { status: 500 },
    );
  }
}
