import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import {
  calculateMatchScore,
  collaborativeBoost,
  explainMatch,
  type CurrentUserContext,
  type CandidateProfile,
} from '@/services/matching.engine';

function safeJson(str: string | null | undefined, fallback: string[] = []): string[] {
  if (!str) return fallback;
  try { const v = JSON.parse(str); return Array.isArray(v) ? v : fallback; }
  catch { return fallback; }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const myId = getUserIdFromRequest(req);
  if (!myId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const { userId: targetId } = await params;

  const [me, target, myLikers, targetLikers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: myId },
      include: { profile: true, preference: true },
    }),
    prisma.user.findUnique({
      where: { id: targetId },
      include: { profile: true },
    }),
    prisma.like.findMany({ where: { toUserId: myId }, select: { fromUserId: true } }),
    prisma.like.findMany({ where: { toUserId: targetId }, select: { fromUserId: true } }),
  ]);

  if (!me || !target?.profile) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND' } }, { status: 404 });
  }

  const vp  = me.profile;
  const vpr = me.preference;

  const userCtx: CurrentUserContext = {
    userId:        myId,
    gender:        me.gender ?? vp?.gender ?? null,
    dob:           vp?.dob ?? null,
    religion:      vp?.religion ?? null,
    caste:         vp?.caste ?? null,
    qualification: vp?.qualification ?? null,
    city:          vp?.city ?? null,
    state:         vp?.state ?? null,
    country:       vp?.country ?? null,
    interests:     safeJson(vp?.interests),
    smokingHabit:  (vp as Record<string, unknown>)?.smokingHabit  as string ?? null,
    drinkingHabit: (vp as Record<string, unknown>)?.drinkingHabit as string ?? null,
    dietPreference:(vp as Record<string, unknown>)?.dietPreference as string ?? null,
    preferences: vpr ? {
      ageMin: vpr.ageMin, ageMax: vpr.ageMax,
      religion: vpr.religion, education: vpr.education, location: vpr.location,
      castePreference:   (vpr as Record<string, unknown>).castePreference   as string ?? null,
      maritalStatusPref: (vpr as Record<string, unknown>).maritalStatusPref as string ?? null,
      smokingPref:       (vpr as Record<string, unknown>).smokingPref       as string ?? null,
      drinkingPref:      (vpr as Record<string, unknown>).drinkingPref      as string ?? null,
    } : null,
  };

  const p  = target.profile;
  const cp: CandidateProfile = {
    userId: target.id, fullName: target.fullName,
    gender: target.gender ?? p.gender ?? null, dob: p.dob ?? null,
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

  const boost = collaborativeBoost(
    myLikers.map((l) => l.fromUserId),
    targetLikers.map((l) => l.fromUserId),
  );
  const { score, breakdown } = calculateMatchScore(userCtx, cp, boost);
  const reasons = explainMatch(userCtx, cp, breakdown);

  return NextResponse.json({
    success: true,
    data: { score, breakdown, reasons },
  });
}
