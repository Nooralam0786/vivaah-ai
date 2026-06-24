/**
 * GET  /api/matches — Dynamically compute & return ranked compatible profiles.
 * POST /api/matches — Record a "like" (interest sent); auto-promote to mutual.
 *
 * Matching pipeline:
 *   1. Fetch current user + profile + preferences + likes + passes (one query)
 *   2. Fetch all eligible candidates (onboardingStep=complete, has photo, opposite gender)
 *   3. Build collaborative filtering boost map (2 extra queries)
 *   4. Score every candidate with the matching engine
 *   5. Apply optional query-string filters (age, religion, state)
 *   6. Sort DESC, paginate
 *   7. Upsert top-50 scores into the Match table for bookkeeping
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeJson(str: string | null | undefined, fallback: string[] = []): string[] {
  if (!str) return fallback;
  try {
    const v = JSON.parse(str);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function requestId() {
  return Math.random().toString(36).substring(2, 9);
}

type ProfileRow = {
  gender: string | null;
  dob: string | null;
  height: string | null;
  religion: string | null;
  caste: string | null;
  motherTongue: string | null;
  maritalStatus: string | null;
  qualification: string | null;
  occupation: string | null;
  company: string | null;
  annualIncome: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  aboutMe: string | null;
  interests: string;
  photo: string | null;
  coverPhoto: string | null;
  photos: string;
  isVerified: boolean;
  isOnline: boolean;
  // New fields added in schema migration — may be undefined on old rows
  smokingHabit?: string | null;
  drinkingHabit?: string | null;
  dietPreference?: string | null;
  lastActiveAt?: Date | null;
};

function buildCandidateProfile(userId: string, fullName: string, gender: string | null, p: ProfileRow): CandidateProfile {
  return {
    userId,
    fullName,
    gender: gender ?? p.gender ?? null,
    dob: p.dob ?? null,
    religion: p.religion ?? null,
    caste: p.caste ?? null,
    qualification: p.qualification ?? null,
    occupation: p.occupation ?? null,
    country: p.country ?? null,
    state: p.state ?? null,
    city: p.city ?? null,
    interests: safeJson(p.interests),
    smokingHabit: p.smokingHabit ?? null,
    drinkingHabit: p.drinkingHabit ?? null,
    dietPreference: p.dietPreference ?? null,
    photo: p.photo ?? null,
    photos: safeJson(p.photos),
    isVerified: p.isVerified,
    isOnline: p.isOnline,
    lastActiveAt: p.lastActiveAt ?? null,
    maritalStatus: p.maritalStatus ?? null,
    height: p.height ?? null,
    annualIncome: p.annualIncome ?? null,
  };
}

// ─── GET /api/matches ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page      = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10));
    const limit     = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
    const tab       = searchParams.get('tab') ?? 'new';
    const fReligion = searchParams.get('religion') ?? '';
    const fState    = searchParams.get('state')    ?? '';
    const fMinAge   = searchParams.get('minAge')   ? parseInt(searchParams.get('minAge')!,  10) : null;
    const fMaxAge   = searchParams.get('maxAge')   ? parseInt(searchParams.get('maxAge')!,  10) : null;

    // ── 1. Current user data ──────────────────────────────────────────────────
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile:    true,
        preference: true,
        likesGiven:  { select: { toUserId: true } },
        passesGiven: { select: { toUserId: true } },
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 },
      );
    }

    // ── 2. Build exclusion set ────────────────────────────────────────────────
    const excludedIds = new Set<string>([
      userId,
      ...currentUser.likesGiven.map((l) => l.toUserId),
      ...currentUser.passesGiven.map((p) => p.toUserId),
    ]);

    // Normalize to lowercase so 'Male'/'Female'/'male'/'female' all work
    const userGenderLower = (currentUser.gender ?? currentUser.profile?.gender ?? '').toLowerCase().trim();
    const targetGender    = userGenderLower === 'male' ? 'female' : userGenderLower === 'female' ? 'male' : null;
    // Provide both casing variants since SQLite = is case-sensitive by default
    const targetGenderVariants = targetGender
      ? [targetGender, targetGender.charAt(0).toUpperCase() + targetGender.slice(1)]
      : null;

    // ── 3. Fetch candidates (hard filters in DB) ──────────────────────────────
    // Gender can be on User.gender (set at signup) OR Profile.gender (set during onboarding).
    // We check both with case-insensitive variants so no one is missed.
    const candidates = await prisma.user.findMany({
      where: {
        id:      { notIn: [...excludedIds] },
        profile: { isNot: null },
        ...(targetGenderVariants ? {
          OR: [
            { gender: { in: targetGenderVariants } },
            { profile: { gender: { in: targetGenderVariants } } },
          ],
        } : {}),
      },
      include: { profile: true, preference: true },
    });

    // ── 4. Collaborative filtering boost ─────────────────────────────────────
    const myLikedIds = currentUser.likesGiven.map((l) => l.toUserId);
    const collabBoostMap = new Map<string, number>();

    if (myLikedIds.length > 0) {
      const similarUserIds = await prisma.like
        .findMany({
          where: { toUserId: { in: myLikedIds }, fromUserId: { not: userId } },
          select: { fromUserId: true },
          distinct: ['fromUserId'],
        })
        .then((rows) => rows.map((r) => r.fromUserId));

      if (similarUserIds.length > 0) {
        const collabLikes = await prisma.like.findMany({
          where: {
            fromUserId: { in: similarUserIds },
            toUserId:   { notIn: [...excludedIds] },
          },
          select: { toUserId: true },
        });

        for (const { toUserId: tid } of collabLikes) {
          collabBoostMap.set(tid, (collabBoostMap.get(tid) ?? 0) + 1);
        }
        const maxCount = Math.max(...collabBoostMap.values(), 1);
        for (const [id, count] of collabBoostMap) {
          collabBoostMap.set(id, Math.round((count / maxCount) * 5));
        }
      }
    }

    // ── 5. Build user context ─────────────────────────────────────────────────
    const up   = currentUser.profile as ProfileRow | null;
    const uprefs = currentUser.preference;

    const userCtx: CurrentUserContext = {
      userId,
      gender:        userGenderLower || null,
      dob:           up?.dob           ?? null,
      religion:      up?.religion      ?? null,
      caste:         up?.caste         ?? null,
      qualification: up?.qualification ?? null,
      city:          up?.city          ?? null,
      state:         up?.state         ?? null,
      country:       up?.country       ?? null,
      interests:     safeJson(up?.interests),
      smokingHabit:  up?.smokingHabit  ?? null,
      drinkingHabit: up?.drinkingHabit ?? null,
      dietPreference:up?.dietPreference?? null,
      preferences:   uprefs ? {
        ageMin:            uprefs.ageMin,
        ageMax:            uprefs.ageMax,
        religion:          uprefs.religion,
        education:         uprefs.education,
        location:          uprefs.location,
        castePreference:   (uprefs as Record<string, unknown>).castePreference    as string | null ?? null,
        maritalStatusPref: (uprefs as Record<string, unknown>).maritalStatusPref  as string | null ?? null,
        smokingPref:       (uprefs as Record<string, unknown>).smokingPref        as string | null ?? null,
        drinkingPref:      (uprefs as Record<string, unknown>).drinkingPref       as string | null ?? null,
      } : null,
    };

    // ── 6. Score every candidate ──────────────────────────────────────────────
    const scored = candidates.map((c) => {
      const cp = buildCandidateProfile(c.id, c.fullName, c.gender, c.profile as ProfileRow);
      const boost = collabBoostMap.get(c.id) ?? 0;
      const { score } = calculateMatchScore(userCtx, cp, boost);
      return { candidate: c, cp, score };
    });

    // Sort DESC
    scored.sort((a, b) => b.score - a.score);

    // ── 7. Mutual-like detection ──────────────────────────────────────────────
    const myLikedSet = new Set(currentUser.likesGiven.map((l) => l.toUserId));
    const mutualRows = await prisma.like.findMany({
      where: { fromUserId: { in: [...myLikedSet] }, toUserId: userId },
      select: { fromUserId: true },
    });
    const mutualIds = new Set(mutualRows.map((r) => r.fromUserId));

    // ── 8. Tab filter ─────────────────────────────────────────────────────────
    let pool = scored;
    if (tab === 'compatible') pool = scored.filter((s) => s.score >= 70);
    else if (tab === 'mutual') pool = scored.filter((s) => mutualIds.has(s.candidate.id));

    // ── 9. Optional query-string filters ─────────────────────────────────────
    if (fReligion) {
      pool = pool.filter((s) => s.cp.religion?.toLowerCase() === fReligion.toLowerCase());
    }
    if (fState) {
      pool = pool.filter((s) => s.cp.state?.toLowerCase() === fState.toLowerCase());
    }
    if (fMinAge !== null) {
      pool = pool.filter((s) => {
        const a = calculateAge(s.cp.dob);
        return a === null || a >= fMinAge!;
      });
    }
    if (fMaxAge !== null) {
      pool = pool.filter((s) => {
        const a = calculateAge(s.cp.dob);
        return a === null || a <= fMaxAge!;
      });
    }

    // ── 10. Paginate ──────────────────────────────────────────────────────────
    const total      = pool.length;
    const totalPages = Math.ceil(total / limit);
    const paginated  = pool.slice((page - 1) * limit, page * limit);

    // ── 11. Upsert top-50 into Match table (page 1, default tab only) ─────────
    if (page === 1 && tab === 'new' && !fReligion && !fState && !fMinAge && !fMaxAge) {
      const top50 = scored.slice(0, 50);
      await Promise.allSettled(
        top50.map(({ candidate, score }) =>
          prisma.match.upsert({
            where:  { userAId_userBId: { userAId: userId, userBId: candidate.id } },
            update: {
              matchPercent: score,
              tag: mutualIds.has(candidate.id) ? 'mutual' : score >= 70 ? 'compatible' : 'new',
            },
            create: {
              userAId: userId,
              userBId: candidate.id,
              matchPercent: score,
              tag: mutualIds.has(candidate.id) ? 'mutual' : score >= 70 ? 'compatible' : 'new',
            },
          }),
        ),
      );
    }

    // ── 12. Build response ────────────────────────────────────────────────────
    const userInterests = safeJson(up?.interests);
    const matches = paginated.map(({ candidate, cp, score }) => {
      const age = calculateAge(cp.dob);
      const mutual = cp.interests.filter((i) =>
        userInterests.some((u) => u.toLowerCase() === i.toLowerCase()),
      );
      return {
        id:            `${userId}_${candidate.id}`,
        userId:        candidate.id,
        name:          candidate.fullName,
        age,
        profession:    cp.occupation,
        location:      [cp.city, cp.state].filter(Boolean).join(', ') || null,
        religion:      cp.religion,
        caste:         cp.caste,
        height:        cp.height,
        income:        cp.annualIncome,
        matchPercent:  score,
        isOnline:      cp.isOnline,
        isVerified:    cp.isVerified,
        photo:         cp.photo,
        mutualInterests: mutual,
        tag: mutualIds.has(candidate.id) ? 'mutual' : score >= 70 ? 'compatible' : 'new',
      };
    });

    return NextResponse.json({
      success: true,
      data:    { matches, total, page, limit, totalPages },
      meta:    { timestamp: new Date().toISOString(), requestId: requestId() },
    });
  } catch (error) {
    console.error('[GET /api/matches]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch matches' } },
      { status: 500 },
    );
  }
}

// ─── POST /api/matches ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const targetUserId: unknown = body?.targetUserId;
    if (typeof targetUserId !== 'string' || !targetUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'targetUserId is required' } },
        { status: 400 },
      );
    }

    await prisma.like.upsert({
      where:  { fromUserId_toUserId: { fromUserId: userId, toUserId: targetUserId } },
      update: {},
      create: { fromUserId: userId, toUserId: targetUserId },
    });

    const reciprocal = await prisma.like.findUnique({
      where: { fromUserId_toUserId: { fromUserId: targetUserId, toUserId: userId } },
    });
    const isMutual = !!reciprocal;

    if (isMutual) {
      await prisma.match.updateMany({
        where: { userAId: userId, userBId: targetUserId },
        data:  { tag: 'mutual' },
      });
    }

    return NextResponse.json({
      success: true,
      data:    { liked: true, isMutual, message: isMutual ? 'It\'s a mutual match! 💕' : 'Interest sent' },
      meta:    { timestamp: new Date().toISOString(), requestId: requestId() },
    });
  } catch (error) {
    console.error('[POST /api/matches]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to record interest' } },
      { status: 500 },
    );
  }
}
