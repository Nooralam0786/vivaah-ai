/**
 * VivaahAI Matching Engine
 *
 * Hybrid scoring: rule-based hard filters (in the API layer) +
 * weighted soft scoring here (0–100) + collaborative filtering boost.
 *
 * Score breakdown:
 *   Age compatibility   — 10 pts
 *   Education match     — 10 pts
 *   Location match      — 15 pts
 *   Religion / caste    — 20 pts
 *   Shared interests    — 20 pts
 *   Lifestyle           — 10 pts
 *   Profile completion  —  5 pts
 *   Recent activity     — 10 pts
 *   Collaborative boost —  5 pts (bonus, capped at 100 total)
 */

export interface CandidateProfile {
  userId: string;
  fullName: string;
  gender: string | null;
  dob: string | null;
  religion: string | null;
  caste: string | null;
  qualification: string | null;
  occupation: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  interests: string[];
  smokingHabit: string | null;
  drinkingHabit: string | null;
  dietPreference: string | null;
  photo: string | null;
  photos: string[];
  isVerified: boolean;
  isOnline: boolean;
  lastActiveAt: Date | null;
  maritalStatus: string | null;
  height: string | null;
  annualIncome: string | null;
}

export interface UserPreferenceContext {
  ageMin: number;
  ageMax: number;
  religion: string;
  education: string;
  location: string | null;
  castePreference: string | null;
  maritalStatusPref: string | null;
  smokingPref: string | null;
  drinkingPref: string | null;
}

export interface CurrentUserContext {
  userId: string;
  gender: string | null;
  dob: string | null;
  religion: string | null;
  caste: string | null;
  qualification: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  interests: string[];
  smokingHabit: string | null;
  drinkingHabit: string | null;
  dietPreference: string | null;
  preferences: UserPreferenceContext | null;
}

export interface ScoreBreakdown {
  age: number;
  education: number;
  location: number;
  religion: number;
  interests: number;
  lifestyle: number;
  profileCompletion: number;
  activity: number;
  collaborativeBoost: number;
  total: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function calculateAge(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function norm(s: string | null | undefined): string {
  return s?.toLowerCase().trim() ?? '';
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (!a.length && !b.length) return 0;
  const setA = new Set(a.map((s) => s.toLowerCase().trim()));
  const setB = new Set(b.map((s) => s.toLowerCase().trim()));
  let intersection = 0;
  for (const item of setA) if (setB.has(item)) intersection++;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

const EDU_LEVEL: Record<string, number> = {
  'below 10th': 0, '10th pass': 1, '12th pass': 1, 'ssc': 1, 'hsc': 1,
  'diploma': 2, 'polytechnic': 2,
  "bachelor's": 3, 'graduate': 3, 'be': 3, 'btech': 3, 'ba': 3,
  'bsc': 3, 'bcom': 3, 'bba': 3, 'bca': 3,
  "master's": 4, 'postgraduate': 4, 'me': 4, 'mtech': 4, 'ma': 4,
  'msc': 4, 'mba': 4, 'mcom': 4, 'mca': 4,
  'phd': 5, 'doctorate': 5, 'md': 5, 'ms': 4,
};

function getEduLevel(qual: string | null): number {
  if (!qual) return 0;
  const n = norm(qual).replace(/[^a-z0-9'\s]/g, '');
  if (EDU_LEVEL[n] !== undefined) return EDU_LEVEL[n];
  if (n.includes('phd') || n.includes('doct')) return 5;
  if (n.includes("master") || n.includes('mba') || n.includes('mtech')) return 4;
  if (n.includes("bachelor") || n.includes("btech") || n.includes('graduate')) return 3;
  if (n.includes("diploma")) return 2;
  return 1;
}

// ─── Individual Scorers ────────────────────────────────────────────────────────

/** Max 10 pts — also enforces hard age-range filter (returns 0 if outside pref). */
function scoreAge(user: CurrentUserContext, candidate: CandidateProfile): number {
  const cAge = calculateAge(candidate.dob);
  const uAge = calculateAge(user.dob);

  if (cAge !== null && user.preferences) {
    const { ageMin, ageMax } = user.preferences;
    if (cAge < ageMin || cAge > ageMax) return 0;
  }

  if (uAge === null || cAge === null) return 5;
  const gap = Math.abs(uAge - cAge);
  if (gap <= 2) return 10;
  if (gap <= 5) return 8;
  if (gap <= 8) return 5;
  if (gap <= 12) return 2;
  return 1;
}

/** Max 10 pts */
function scoreEducation(user: CurrentUserContext, candidate: CandidateProfile): number {
  const uLevel = getEduLevel(user.qualification);
  const cLevel = getEduLevel(candidate.qualification);
  if (uLevel === 0 || cLevel === 0) return 5;

  const prefEdu = user.preferences?.education;
  if (prefEdu && prefEdu !== 'Any') {
    const prefLevel = getEduLevel(prefEdu);
    if (prefLevel > 0 && cLevel < prefLevel) return 2;
  }

  const diff = Math.abs(uLevel - cLevel);
  if (diff === 0) return 10;
  if (diff === 1) return 7;
  if (diff === 2) return 4;
  return 1;
}

/** Max 15 pts */
function scoreLocation(user: CurrentUserContext, candidate: CandidateProfile): number {
  if (norm(user.city) && norm(candidate.city) && norm(user.city) === norm(candidate.city)) return 15;
  if (norm(user.state) && norm(candidate.state) && norm(user.state) === norm(candidate.state)) return 10;
  if (norm(user.country) && norm(candidate.country) && norm(user.country) === norm(candidate.country)) return 5;
  return 2;
}

/** Max 20 pts (15 religion + 5 caste) */
function scoreReligion(user: CurrentUserContext, candidate: CandidateProfile): number {
  let score = 0;
  const prefReligion = norm(user.preferences?.religion);
  const candReligion = norm(candidate.religion);
  const userReligion = norm(user.religion);

  if (!prefReligion || prefReligion === 'any religion' || prefReligion === 'any') {
    score += 15;
  } else if (candReligion && candReligion === prefReligion) {
    score += 15;
  } else if (candReligion && userReligion && candReligion === userReligion) {
    score += 8;
  }

  const prefCaste = norm(user.preferences?.castePreference);
  const candCaste = norm(candidate.caste);
  const userCaste = norm(user.caste);

  if (!prefCaste || prefCaste === 'any') {
    score += 5;
  } else if (candCaste && candCaste === prefCaste) {
    score += 5;
  } else if (candCaste && userCaste && candCaste === userCaste) {
    score += 3;
  }

  return Math.min(score, 20);
}

/** Max 20 pts — Jaccard similarity on interests arrays */
function scoreInterests(user: CurrentUserContext, candidate: CandidateProfile): number {
  return Math.round(jaccardSimilarity(user.interests, candidate.interests) * 20);
}

/** Max 10 pts — smoking (3) + drinking (3) + diet (4) */
function scoreLifestyle(user: CurrentUserContext, candidate: CandidateProfile): number {
  let score = 0;

  const uSmoke = norm(user.smokingHabit);
  const cSmoke = norm(candidate.smokingHabit);
  if (!uSmoke || !cSmoke) score += 1;
  else if (uSmoke === cSmoke) score += 3;
  else if (uSmoke === 'never' && cSmoke !== 'never') score += 0;
  else score += 1;

  const uDrink = norm(user.drinkingHabit);
  const cDrink = norm(candidate.drinkingHabit);
  if (!uDrink || !cDrink) score += 1;
  else if (uDrink === cDrink) score += 3;
  else score += 1;

  const uDiet = norm(user.dietPreference);
  const cDiet = norm(candidate.dietPreference);
  if (!uDiet || !cDiet) score += 2;
  else if (uDiet === cDiet) score += 4;
  else if (['vegetarian', 'vegan'].includes(uDiet) && ['vegetarian', 'vegan'].includes(cDiet)) score += 2;

  return Math.min(score, 10);
}

/** Max 5 pts — rewards fully filled profiles */
function scoreProfileCompletion(candidate: CandidateProfile): number {
  const fields = [
    candidate.dob, candidate.religion, candidate.qualification,
    candidate.occupation, candidate.country, candidate.state,
    candidate.city, candidate.maritalStatus, candidate.height, candidate.photo,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 5);
}

/** Max 10 pts — recency of last activity */
function scoreActivity(lastActiveAt: Date | null): number {
  if (!lastActiveAt) return 1;
  const days = (Date.now() - new Date(lastActiveAt).getTime()) / 86_400_000;
  if (days <= 1) return 10;
  if (days <= 7) return 7;
  if (days <= 30) return 4;
  if (days <= 90) return 2;
  return 1;
}

// ─── Main Scoring Function ────────────────────────────────────────────────────

/**
 * Computes a 0–100 compatibility score between the current user and a candidate.
 * `collaborativeBoost` (0–5) is an optional bonus from the collaborative
 * filtering layer computed in the API route.
 */
export function calculateMatchScore(
  user: CurrentUserContext,
  candidate: CandidateProfile,
  collaborativeBoost = 0,
): { score: number; breakdown: ScoreBreakdown } {
  const age = scoreAge(user, candidate);
  const education = scoreEducation(user, candidate);
  const location = scoreLocation(user, candidate);
  const religion = scoreReligion(user, candidate);
  const interests = scoreInterests(user, candidate);
  const lifestyle = scoreLifestyle(user, candidate);
  const profileCompletion = scoreProfileCompletion(candidate);
  const activity = scoreActivity(candidate.lastActiveAt);

  const raw = age + education + location + religion + interests + lifestyle + profileCompletion + activity;
  const total = Math.min(100, Math.round(raw + collaborativeBoost));

  return {
    score: total,
    breakdown: { age, education, location, religion, interests, lifestyle, profileCompletion, activity, collaborativeBoost, total },
  };
}
