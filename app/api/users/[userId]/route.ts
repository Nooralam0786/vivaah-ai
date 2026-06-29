/**
 * GET /api/users/[userId]
 * Returns the public profile of any user.
 * Also records a profile view (fire-and-forget, does not delay response).
 * Calculates compatibility score with the requesting user.
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
import { createViewNotification } from '@/lib/notifications';

function safeJson(str: string | null | undefined, fallback: string[] = []): string[] {
  if (!str) return fallback;
  try { const v = JSON.parse(str); return Array.isArray(v) ? v : fallback; }
  catch { return fallback; }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const viewerId = getUserIdFromRequest(req);
    if (!viewerId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
        { status: 401 },
      );
    }

    if (userId === viewerId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Use /api/users/profile for your own profile' } },
        { status: 400 },
      );
    }

    // Fetch target user + viewer in parallel
    const [target, viewer] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId, onboardingStep: 'complete' },
        include: { profile: true, preference: true },
      }),
      prisma.user.findUnique({
        where: { id: viewerId },
        include: { profile: true, preference: true },
      }),
    ]);

    if (!target || !target.profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } },
        { status: 404 },
      );
    }

    // Record view + notify — fire and forget
    const viewerName  = viewer?.fullName ?? 'Someone';
    const viewerPhoto = viewer?.profile?.photo ?? null;
    prisma.profileView.create({ data: { viewerId, profileId: userId } }).catch(() => {});
    createViewNotification(userId, viewerId, viewerName, viewerPhoto).catch(() => {});

    // Calculate match score
    const vp = viewer?.profile;
    const vpr = viewer?.preference;
    const tp  = target.profile;

    const userCtx: CurrentUserContext = {
      userId: viewerId,
      gender: viewer?.gender ?? vp?.gender ?? null,
      dob: vp?.dob ?? null,
      religion: vp?.religion ?? null,
      caste: vp?.caste ?? null,
      qualification: vp?.qualification ?? null,
      city: vp?.city ?? null,
      state: vp?.state ?? null,
      country: vp?.country ?? null,
      interests: safeJson(vp?.interests),
      smokingHabit: (vp as Record<string, unknown>)?.smokingHabit as string ?? null,
      drinkingHabit: (vp as Record<string, unknown>)?.drinkingHabit as string ?? null,
      dietPreference: (vp as Record<string, unknown>)?.dietPreference as string ?? null,
      preferences: vpr ? {
        ageMin: vpr.ageMin,
        ageMax: vpr.ageMax,
        religion: vpr.religion,
        education: vpr.education,
        location: vpr.location,
        castePreference: (vpr as Record<string, unknown>).castePreference as string ?? null,
        maritalStatusPref: (vpr as Record<string, unknown>).maritalStatusPref as string ?? null,
        smokingPref: (vpr as Record<string, unknown>).smokingPref as string ?? null,
        drinkingPref: (vpr as Record<string, unknown>).drinkingPref as string ?? null,
      } : null,
    };

    const candidateProfile: CandidateProfile = {
      userId: target.id,
      fullName: target.fullName,
      gender: target.gender ?? tp.gender ?? null,
      dob: tp.dob ?? null,
      religion: tp.religion ?? null,
      caste: tp.caste ?? null,
      qualification: tp.qualification ?? null,
      occupation: tp.occupation ?? null,
      country: tp.country ?? null,
      state: tp.state ?? null,
      city: tp.city ?? null,
      interests: safeJson(tp.interests),
      smokingHabit: (tp as Record<string, unknown>).smokingHabit as string ?? null,
      drinkingHabit: (tp as Record<string, unknown>).drinkingHabit as string ?? null,
      dietPreference: (tp as Record<string, unknown>).dietPreference as string ?? null,
      photo: tp.photo ?? null,
      photos: safeJson(tp.photos),
      isVerified: tp.isVerified,
      isOnline: tp.isOnline,
      lastActiveAt: (tp as Record<string, unknown>).lastActiveAt as Date ?? null,
      maritalStatus: tp.maritalStatus ?? null,
      height: tp.height ?? null,
      annualIncome: tp.annualIncome ?? null,
    };

    const { score, breakdown } = calculateMatchScore(userCtx, candidateProfile);

    // Mutual interests
    const myInterests  = safeJson(vp?.interests);
    const mutualInterests = candidateProfile.interests.filter((i) =>
      myInterests.some((m) => m.toLowerCase() === i.toLowerCase()),
    );

    // Like status
    const [iLiked, theyLiked] = await Promise.all([
      prisma.like.findUnique({ where: { fromUserId_toUserId: { fromUserId: viewerId, toUserId: userId } } }),
      prisma.like.findUnique({ where: { fromUserId_toUserId: { fromUserId: userId, toUserId: viewerId } } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        userId:        target.id,
        name:          target.fullName,
        age:           calculateAge(tp.dob),
        gender:        target.gender ?? tp.gender ?? null,
        photo:         tp.photo,
        photos:        safeJson(tp.photos),
        coverPhoto:    tp.coverPhoto,
        isVerified:    tp.isVerified,
        isOnline:      tp.isOnline,
        matchPercent:  score,
        breakdown,
        mutualInterests,
        iLiked:        !!iLiked,
        isMutual:      !!iLiked && !!theyLiked,

        // Personal
        dob:           tp.dob,
        height:        tp.height,
        religion:      tp.religion,
        caste:         tp.caste,
        motherTongue:  tp.motherTongue,
        maritalStatus: tp.maritalStatus,

        // Career
        qualification: tp.qualification,
        occupation:    tp.occupation,
        company:       tp.company,
        annualIncome:  tp.annualIncome,

        // Location
        city:    tp.city,
        state:   tp.state,
        country: tp.country,

        // About
        aboutMe:   tp.aboutMe,
        interests: safeJson(tp.interests),

        // Lifestyle
        smokingHabit:   (tp as Record<string, unknown>).smokingHabit  ?? null,
        drinkingHabit:  (tp as Record<string, unknown>).drinkingHabit ?? null,
        dietPreference: (tp as Record<string, unknown>).dietPreference ?? null,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[GET /api/users/[userId]]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch profile' } },
      { status: 500 },
    );
  }
}
