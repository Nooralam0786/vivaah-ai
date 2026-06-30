/**
 * @jest-environment node
 *
 * Unit tests for the VivaahAI matching engine.
 * All functions are pure — no mocks required.
 */

import {
  calculateAge,
  calculateMatchScore,
  collaborativeBoost,
  explainMatch,
  type CurrentUserContext,
  type CandidateProfile,
} from '@/services/matching.engine';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeUser(overrides: Partial<CurrentUserContext> = {}): CurrentUserContext {
  return {
    userId:         'user-1',
    gender:         'Male',
    dob:            '1995-06-15',
    religion:       'Hindu',
    caste:          'Brahmin',
    qualification:  "Bachelor's",
    city:           'Mumbai',
    state:          'Maharashtra',
    country:        'India',
    interests:      ['Reading', 'Travel', 'Music'],
    smokingHabit:   'never',
    drinkingHabit:  'never',
    dietPreference: 'vegetarian',
    preferences: {
      ageMin:            24,
      ageMax:            30,
      religion:          'Hindu',
      education:         'Any',
      location:          null,
      castePreference:   null,
      maritalStatusPref: null,
      smokingPref:       null,
      drinkingPref:      null,
    },
    ...overrides,
  };
}

function makeCandidate(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
  return {
    userId:        'cand-1',
    fullName:      'Priya Sharma',
    gender:        'Female',
    dob:           '1997-03-20',
    religion:      'Hindu',
    caste:         'Brahmin',
    qualification: "Bachelor's",
    occupation:    'Engineer',
    country:       'India',
    state:         'Maharashtra',
    city:          'Mumbai',
    interests:     ['Reading', 'Travel', 'Cooking'],
    smokingHabit:  'never',
    drinkingHabit: 'never',
    dietPreference:'vegetarian',
    photo:         '/photo.jpg',
    photos:        [],
    isVerified:    true,
    isOnline:      true,
    lastActiveAt:  new Date(),
    maritalStatus: 'Never Married',
    height:        "5'5\"",
    annualIncome:  '5-10 LPA',
    ...overrides,
  };
}

// ── calculateAge ──────────────────────────────────────────────────────────────

describe('calculateAge', () => {
  it('returns correct age for a known DOB', () => {
    // someone born exactly 28 years ago
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 28);
    const age = calculateAge(dob.toISOString().split('T')[0]);
    expect(age).toBe(28);
  });

  it('returns null for null input', () => {
    expect(calculateAge(null)).toBeNull();
  });

  it('returns null for invalid date string', () => {
    expect(calculateAge('not-a-date')).toBeNull();
  });

  it('returns 0 for someone born today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(calculateAge(today)).toBe(0);
  });
});

// ── calculateMatchScore ───────────────────────────────────────────────────────

describe('calculateMatchScore', () => {
  it('score is between 0 and 100', () => {
    const { score } = calculateMatchScore(makeUser(), makeCandidate());
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('high score for near-perfect match', () => {
    const { score } = calculateMatchScore(makeUser(), makeCandidate());
    expect(score).toBeGreaterThan(60);
  });

  it('age score is 0 when candidate is outside preference range', () => {
    const user = makeUser();                             // ageMin: 24, ageMax: 30
    const cand = makeCandidate({ dob: '1985-01-01' });  // ~41 years old
    const { breakdown } = calculateMatchScore(user, cand);
    expect(breakdown.age).toBe(0); // hard filter — outside age pref → 0 age score
  });

  it('breakdown totals match overall score', () => {
    const { score, breakdown } = calculateMatchScore(makeUser(), makeCandidate());
    expect(breakdown.total).toBe(score);
  });

  it('adds collaborative boost but caps at 100', () => {
    const { score } = calculateMatchScore(makeUser(), makeCandidate(), 5);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('different city lowers location score vs same city', () => {
    const sameCity  = calculateMatchScore(makeUser(), makeCandidate({ city: 'Mumbai' }));
    const diffCity  = calculateMatchScore(makeUser(), makeCandidate({ city: 'Delhi' }));
    expect(sameCity.breakdown.location).toBeGreaterThan(diffCity.breakdown.location);
  });

  it('shared interests increase interest score', () => {
    const manyShared = calculateMatchScore(makeUser(), makeCandidate({ interests: ['Reading', 'Travel', 'Music'] }));
    const noneShared = calculateMatchScore(makeUser(), makeCandidate({ interests: ['Cricket', 'Gaming', 'Fishing'] }));
    expect(manyShared.breakdown.interests).toBeGreaterThan(noneShared.breakdown.interests);
  });

  it('matching lifestyle gives higher lifestyle score', () => {
    const match  = calculateMatchScore(makeUser(), makeCandidate({ smokingHabit: 'never', drinkingHabit: 'never', dietPreference: 'vegetarian' }));
    const differ = calculateMatchScore(makeUser(), makeCandidate({ smokingHabit: 'regularly', drinkingHabit: 'regularly', dietPreference: 'non-vegetarian' }));
    expect(match.breakdown.lifestyle).toBeGreaterThan(differ.breakdown.lifestyle);
  });

  it('complete profile gives higher profileCompletion score', () => {
    const complete   = calculateMatchScore(makeUser(), makeCandidate());
    const incomplete = calculateMatchScore(makeUser(), makeCandidate({
      dob: null, religion: null, qualification: null, city: null, photo: null,
    }));
    expect(complete.breakdown.profileCompletion).toBeGreaterThan(incomplete.breakdown.profileCompletion);
  });

  it('recently active candidate scores higher than inactive', () => {
    const active   = calculateMatchScore(makeUser(), makeCandidate({ lastActiveAt: new Date() }));
    const inactive = calculateMatchScore(makeUser(), makeCandidate({ lastActiveAt: new Date('2020-01-01') }));
    expect(active.breakdown.activity).toBeGreaterThan(inactive.breakdown.activity);
  });
});

// ── collaborativeBoost ────────────────────────────────────────────────────────

describe('collaborativeBoost', () => {
  it('returns 0 when either list is empty', () => {
    expect(collaborativeBoost([], ['a', 'b'])).toBe(0);
    expect(collaborativeBoost(['a', 'b'], [])).toBe(0);
  });

  it('returns max 5 for full overlap', () => {
    const boost = collaborativeBoost(['a', 'b', 'c'], ['a', 'b', 'c']);
    expect(boost).toBe(5);
  });

  it('returns 0 for zero overlap', () => {
    const boost = collaborativeBoost(['a', 'b', 'c'], ['x', 'y', 'z']);
    expect(boost).toBe(0);
  });

  it('partial overlap returns proportional score', () => {
    // 1 overlap out of 3 likers → 1/3 * 5 ≈ 2
    const boost = collaborativeBoost(['a', 'b', 'c'], ['a', 'x', 'y']);
    expect(boost).toBeGreaterThan(0);
    expect(boost).toBeLessThan(5);
  });

  it('is capped at 5', () => {
    const big = Array.from({ length: 50 }, (_, i) => `u${i}`);
    const boost = collaborativeBoost(big, big);
    expect(boost).toBe(5);
  });
});

// ── explainMatch ─────────────────────────────────────────────────────────────

describe('explainMatch', () => {
  it('returns an array of strings', () => {
    const user  = makeUser();
    const cand  = makeCandidate();
    const { breakdown } = calculateMatchScore(user, cand);
    const reasons = explainMatch(user, cand, breakdown);
    expect(Array.isArray(reasons)).toBe(true);
    expect(reasons.length).toBeGreaterThan(0);
  });

  it('returns at most 4 reasons', () => {
    const user  = makeUser();
    const cand  = makeCandidate();
    const { breakdown } = calculateMatchScore(user, cand);
    const reasons = explainMatch(user, cand, breakdown);
    expect(reasons.length).toBeLessThanOrEqual(4);
  });

  it('mentions shared city when same city', () => {
    const user  = makeUser();
    const cand  = makeCandidate({ city: 'Mumbai' });
    const { breakdown } = calculateMatchScore(user, cand);
    const reasons = explainMatch(user, cand, breakdown);
    expect(reasons.some((r) => r.toLowerCase().includes('city') || r.toLowerCase().includes('mumbai'))).toBe(true);
  });

  it('mentions verified profile when no stronger reasons consume the 4-slot limit', () => {
    // Use a low-match candidate so "Verified profile" isn't displaced by 4 other reasons
    const user  = makeUser({ interests: [], religion: 'Hindu', city: 'Mumbai' });
    const cand  = makeCandidate({
      religion:  'Christian',
      city:      'Bangalore', state: 'Karnataka',
      interests: [],
      isVerified: true,
      smokingHabit:  'regularly',
      drinkingHabit: 'regularly',
    });
    const { breakdown } = calculateMatchScore(user, cand);
    const reasons = explainMatch(user, cand, breakdown);
    expect(reasons.some((r) => r.toLowerCase().includes('verified'))).toBe(true);
  });

  it('returns fallback reason when no strong matches', () => {
    const user = makeUser({ religion: 'Hindu', city: 'Mumbai', interests: [] });
    const cand = makeCandidate({
      religion: 'Christian', city: 'Kolkata', state: 'West Bengal',
      interests: [], isVerified: false,
      smokingHabit: 'regularly', drinkingHabit: 'regularly',
    });
    const { breakdown } = calculateMatchScore(user, cand);
    const reasons = explainMatch(user, cand, breakdown);
    expect(reasons.length).toBeGreaterThan(0);
  });
});
