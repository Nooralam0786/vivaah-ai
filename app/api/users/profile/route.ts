/**
 * User Profile API Routes — backed by Prisma (User + Profile tables).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';

const PROFILE_FIELDS = [
  'gender', 'dob', 'height', 'religion', 'caste', 'motherTongue', 'maritalStatus',
  'qualification', 'occupation', 'company', 'annualIncome',
  'country', 'state', 'city', 'aboutMe', 'photo', 'coverPhoto',
] as const;

// Plain text fields bound to controlled <input>/<textarea> elements — Prisma
// returns `null` for unset nullable columns, but a controlled form field's
// `value` must be a string, never null. `photo`/`coverPhoto` are excluded:
// the frontend treats those as `string | null` on purpose.
const TEXT_FIELDS = PROFILE_FIELDS.filter((f) => f !== 'photo' && f !== 'coverPhoto');

// Only fields a user can realistically complete are counted.
// caste, company, annualIncome, coverPhoto are optional — excluded so 100% is achievable.
const COMPLETENESS_FIELDS = [
  'fullName', 'email',
  'gender', 'dob', 'height', 'religion', 'motherTongue', 'maritalStatus',
  'qualification', 'occupation',
  'country', 'state', 'city',
  'aboutMe', 'photo',
] as const;

function computeCompleteness(user: { fullName: string; email: string; profile: Record<string, unknown> | null }) {
  const values: Record<string, unknown> = { ...user, ...(user.profile ?? {}) };
  const filled = COMPLETENESS_FIELDS.filter((f) => {
    const v = values[f];
    return v !== null && v !== undefined && v !== '' && v !== '[]';
  });
  return Math.round((filled.length / COMPLETENESS_FIELDS.length) * 100);
}

async function loadUserWithProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, subscriptions: { where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 1 } },
  });
}

function serialize(user: NonNullable<Awaited<ReturnType<typeof loadUserWithProfile>>>) {
  const { profile, subscriptions, passwordHash: _passwordHash, ...rest } = user;
  const textDefaults = Object.fromEntries(TEXT_FIELDS.map((f) => [f, profile?.[f] ?? '']));
  return {
    ...rest, // includes id, fullName, email, phone, phoneVerified, onboardingStep, gender
    ...(profile ?? {}),
    ...textDefaults,
    interests: profile?.interests ? JSON.parse(profile.interests) : [],
    photos: profile?.photos ? JSON.parse(profile.photos) : [],
    subscriptionTier: subscriptions[0]?.tier ?? 'free',
    verificationStatus: profile?.isVerified ? 'verified' : 'unverified',
    profileCompleteness: computeCompleteness(user),
  };
}

// GET /api/users/profile - Get current user profile
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
        { status: 401 }
      );
    }

    const user = await loadUserWithProfile(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serialize(user),
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch profile' } },
      { status: 500 }
    );
  }
}

// PATCH /api/users/profile - Update user profile
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

    if (typeof body.fullName === 'string') {
      await prisma.user.update({ where: { id: userId }, data: { fullName: body.fullName } });
    }

    const profileData: Record<string, string> = {};
    for (const field of PROFILE_FIELDS) {
      if (typeof body[field] === 'string') profileData[field] = body[field];
    }
    if (Array.isArray(body.interests)) {
      profileData.interests = JSON.stringify(body.interests);
    }
    if (Array.isArray(body.photos)) {
      profileData.photos = JSON.stringify(body.photos.slice(0, 4));
    }

    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData },
    });

    const user = await loadUserWithProfile(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serialize(user),
      meta: { timestamp: new Date().toISOString(), requestId: Math.random().toString(36).substring(7) },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
