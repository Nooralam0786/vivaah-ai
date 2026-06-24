/**
 * GET /api/discover
 * Browse ALL complete profiles (not AI-filtered like /api/matches).
 * Supports: search (name/location/profession), religion, state, ageMin, ageMax.
 * Sorted: recently active first, with a basic compatibility score attached.
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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const search   = (searchParams.get('search')   ?? '').toLowerCase().trim();
    const religion = (searchParams.get('religion') ?? '').toLowerCase().trim();
    const state    = (searchParams.get('state')    ?? '').toLowerCase().trim();
    const fMinAge  = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!, 10) : null;
    const fMaxAge  = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : null;
    const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10));
    const limit    = Math.min(40, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

    // Fetch current user context for scoring
    const [currentUser, allUsers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, preference: true },
      }),
      prisma.user.findMany({
        where: {
          id:      { not: userId },
          profile: { isNot: null },
        },
        include: { profile: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // Build user context
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

    // Score + filter
    const results = allUsers
      .map((u) => {
        const p = u.profile!;
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
        const { score } = calculateMatchScore(userCtx, cp);
        return { u, p, cp, score };
      })
      // Search filter (client-side since SQLite has no full-text)
      .filter(({ u, cp }) => {
        if (search) {
          const haystack = [u.fullName, cp.city, cp.state, cp.occupation, cp.religion]
            .filter(Boolean).join(' ').toLowerCase();
          if (!haystack.includes(search)) return false;
        }
        if (religion && (cp.religion ?? '').toLowerCase() !== religion) return false;
        if (state    && (cp.state    ?? '').toLowerCase() !== state)    return false;
        if (fMinAge !== null) {
          const a = calculateAge(cp.dob);
          if (a !== null && a < fMinAge) return false;
        }
        if (fMaxAge !== null) {
          const a = calculateAge(cp.dob);
          if (a !== null && a > fMaxAge) return false;
        }
        return true;
      })
      .sort((a, b) => b.score - a.score);

    const total      = results.length;
    const totalPages = Math.ceil(total / limit);
    const page_data  = results.slice((page - 1) * limit, page * limit);

    const profiles = page_data.map(({ u, cp, score }) => ({
      id:           `disc_${u.id}`,
      userId:       u.id,
      name:         u.fullName,
      age:          calculateAge(cp.dob),
      profession:   cp.occupation,
      location:     [cp.city, cp.state].filter(Boolean).join(', ') || null,
      religion:     cp.religion,
      caste:        cp.caste,
      height:       cp.height,
      income:       cp.annualIncome,
      matchPercent: score,
      isOnline:     cp.isOnline,
      isVerified:   cp.isVerified,
      photo:        cp.photo,
    }));

    return NextResponse.json({
      success: true,
      data:    { profiles, total, page, limit, totalPages },
      meta:    { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[GET /api/discover]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch profiles' } },
      { status: 500 },
    );
  }
}
