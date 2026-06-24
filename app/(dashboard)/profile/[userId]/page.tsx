'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, MapPin, Heart, Bookmark,
  Flag, Share2, MessageSquare,
} from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFull {
  userId: string;
  name: string;
  age: number | null;
  gender: string | null;
  photo: string | null;
  photos: string[];
  coverPhoto: string | null;
  isVerified: boolean;
  isOnline: boolean;
  matchPercent: number;
  breakdown: Record<string, number>;
  mutualInterests: string[];
  iLiked: boolean;
  isMutual: boolean;
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
  city: string | null;
  state: string | null;
  country: string | null;
  aboutMe: string | null;
  interests: string[];
  smokingHabit: string | null;
  drinkingHabit: string | null;
  dietPreference: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}

function scoreLabel(pct: number) {
  if (pct >= 90) return 'Excellent Match';
  if (pct >= 80) return 'Great Match';
  if (pct >= 70) return 'Good Match';
  return 'Fair Match';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-4">
      <div className="h-72 bg-neutral-200 rounded-2xl" />
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <div className="h-6 bg-neutral-200 rounded w-48" />
        <div className="h-4 bg-neutral-100 rounded w-32" />
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-neutral-100 rounded-xl flex-1" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-vivaah-border last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-800">{value}</span>
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-500">{label}</span>
        <span className="font-semibold text-neutral-700">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-gradient rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfileViewPage() {
  const params   = useParams();
  const router   = useRouter();
  const userId   = params.userId as string;

  const [profile, setProfile]   = useState<ProfileFull | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'insights'>('about');
  const [imgIdx, setImgIdx]     = useState(0);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in to view profiles.'); setLoading(false); return; }

    fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Profile not found');
        setProfile(json.data);
        setLiked(json.data.iLiked);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLike = async () => {
    if (!profile) return;
    setLiked((v) => !v);
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: profile.userId }),
      });
    } catch { /* non-fatal */ }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaved((v) => !v);
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: profile.userId }),
      });
    } catch { /* non-fatal */ }
  };

  if (loading) return <div className="max-w-4xl mx-auto pt-2"><Skeleton /></div>;

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="font-bold text-neutral-700 text-lg mb-1">Profile not found</h2>
        <p className="text-sm text-neutral-400 mb-4">{error ?? 'This profile may have been removed.'}</p>
        <button onClick={() => router.back()} className="text-primary-700 font-semibold text-sm hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const allPhotos = [profile.photo, ...profile.photos].filter(Boolean) as string[];
  const location  = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in pb-8">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden">

        {/* Main photo */}
        <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-50">
          {allPhotos[imgIdx] ? (
            <img
              src={allPhotos[imgIdx]}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">👤</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Thumbnail strip */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-16 left-4 flex gap-1.5">
              {allPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-white' : 'border-transparent opacity-60'}`}
                >
                  <img src={allPhotos[i]} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Match badge */}
          <div className={`absolute top-4 left-4 ${scoreBg(profile.matchPercent)} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
            {profile.matchPercent}% · {scoreLabel(profile.matchPercent)}
          </div>

          {/* Online */}
          {profile.isOnline && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse block" />
              <span className="text-white text-xs font-medium">Online Now</span>
            </div>
          )}

          {/* Name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2">
              <h1 className="text-white text-2xl font-bold leading-tight">
                {profile.name}{profile.age ? `, ${profile.age}` : ''}
              </h1>
              {profile.isVerified && (
                <CheckCircle2 size={20} className="text-blue-300 flex-shrink-0" fill="#93c5fd" strokeWidth={0} />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {profile.occupation && <span className="text-white/80 text-sm">{profile.occupation}</span>}
              {profile.occupation && location && <span className="text-white/50">·</span>}
              {location && (
                <span className="text-white/70 text-sm flex items-center gap-1">
                  <MapPin size={12} /> {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 divide-x divide-vivaah-border border-t border-vivaah-border">
          {[
            { label: 'Religion', value: profile.religion },
            { label: 'Height',   value: profile.height },
            { label: 'Education',value: profile.qualification },
          ].map(({ label, value }) => (
            <div key={label} className="py-3 text-center">
              <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-neutral-800 truncate px-2">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <button
          onClick={handleLike}
          className={`flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            liked
              ? 'bg-primary-gradient text-white shadow-sm'
              : 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-white' : ''} />
          {liked ? 'Interest Sent ✓' : 'Send Interest'}
        </button>

        <a
          href={`/messages?userId=${profile.userId}`}
          className="flex-1 py-3 bg-white border border-vivaah-border rounded-2xl font-semibold text-sm text-neutral-700 hover:border-primary-700/40 hover:text-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare size={16} /> Message
        </a>

        <button
          onClick={handleSave}
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
            saved ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-white border-vivaah-border text-neutral-400 hover:text-amber-500'
          }`}
        >
          <Bookmark size={18} className={saved ? 'fill-amber-400' : ''} />
        </button>

        <button className="w-12 h-12 rounded-2xl border border-vivaah-border bg-white flex items-center justify-center text-neutral-400 hover:text-primary-700 transition-colors">
          <Share2 size={18} />
        </button>
      </div>

      {/* ── Mutual Interests Banner ────────────────────────────────────────── */}
      {profile.mutualInterests.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-2">
            💡 {profile.mutualInterests.length} Mutual Interest{profile.mutualInterests.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.mutualInterests.map((i) => (
              <span key={i} className="px-3 py-1 bg-white border border-primary-200 text-primary-700 rounded-full text-xs font-semibold">
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {(['about', 'photos', 'insights'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              activeTab === t
                ? 'bg-primary-gradient text-white shadow-sm'
                : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'
            }`}
          >
            {t === 'insights' ? '📊 Match Insights' : t === 'photos' ? '📷 Photos' : '👤 About'}
          </button>
        ))}
      </div>

      {/* ── Tab: About ─────────────────────────────────────────────────────── */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          {/* About Me */}
          {profile.aboutMe && (
            <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
              <h2 className="text-sm font-bold text-neutral-900 mb-2">About Me</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">{profile.aboutMe}</p>
            </div>
          )}

          {/* Personal Details */}
          <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
            <h2 className="text-sm font-bold text-neutral-900 mb-1">Personal Details</h2>
            <InfoRow label="Date of Birth"   value={profile.dob} />
            <InfoRow label="Height"          value={profile.height} />
            <InfoRow label="Religion"        value={profile.religion} />
            <InfoRow label="Caste"           value={profile.caste} />
            <InfoRow label="Mother Tongue"   value={profile.motherTongue} />
            <InfoRow label="Marital Status"  value={profile.maritalStatus} />
          </div>

          {/* Career */}
          <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
            <h2 className="text-sm font-bold text-neutral-900 mb-1">Education &amp; Career</h2>
            <InfoRow label="Education"   value={profile.qualification} />
            <InfoRow label="Occupation"  value={profile.occupation} />
            <InfoRow label="Company"     value={profile.company} />
            <InfoRow label="Income"      value={profile.annualIncome} />
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
            <h2 className="text-sm font-bold text-neutral-900 mb-1">Location</h2>
            <InfoRow label="City"    value={profile.city} />
            <InfoRow label="State"   value={profile.state} />
            <InfoRow label="Country" value={profile.country} />
          </div>

          {/* Lifestyle */}
          {(profile.smokingHabit || profile.drinkingHabit || profile.dietPreference) && (
            <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
              <h2 className="text-sm font-bold text-neutral-900 mb-1">Lifestyle</h2>
              <InfoRow label="Smoking"  value={profile.smokingHabit} />
              <InfoRow label="Drinking" value={profile.drinkingHabit} />
              <InfoRow label="Diet"     value={profile.dietPreference} />
            </div>
          )}

          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
              <h2 className="text-sm font-bold text-neutral-900 mb-3">Interests &amp; Hobbies</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      profile.mutualInterests.includes(i)
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-neutral-50 border-vivaah-border text-neutral-600'
                    }`}
                  >
                    {profile.mutualInterests.includes(i) && '💡 '}{i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Photos ────────────────────────────────────────────────────── */}
      {activeTab === 'photos' && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
          <h2 className="text-sm font-bold text-neutral-900 mb-3">Photos</h2>
          {allPhotos.length === 0 ? (
            <div className="text-center py-10 text-neutral-400">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">No photos added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allPhotos.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square rounded-xl overflow-hidden cursor-pointer ring-2 transition-all ${
                    i === imgIdx ? 'ring-primary-700' : 'ring-transparent hover:ring-primary-700/40'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Match Insights ────────────────────────────────────────────── */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {/* Overall score */}
          <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900">Compatibility Score</h2>
              <div className={`${scoreBg(profile.matchPercent)} text-white font-bold text-lg px-4 py-1 rounded-xl`}>
                {profile.matchPercent}%
              </div>
            </div>
            <div className="space-y-3">
              <ScoreBar label="Religion & Background" value={profile.breakdown.religion ?? 0}    max={20} />
              <ScoreBar label="Shared Interests"      value={profile.breakdown.interests ?? 0}   max={20} />
              <ScoreBar label="Location"              value={profile.breakdown.location ?? 0}    max={15} />
              <ScoreBar label="Lifestyle"             value={profile.breakdown.lifestyle ?? 0}   max={10} />
              <ScoreBar label="Age Compatibility"     value={profile.breakdown.age ?? 0}         max={10} />
              <ScoreBar label="Education"             value={profile.breakdown.education ?? 0}   max={10} />
              <ScoreBar label="Recent Activity"       value={profile.breakdown.activity ?? 0}    max={10} />
              <ScoreBar label="Profile Completion"    value={profile.breakdown.profileCompletion ?? 0} max={5} />
            </div>
          </div>

          {/* Mutual interests */}
          {profile.mutualInterests.length > 0 && (
            <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
              <h2 className="text-sm font-bold text-neutral-900 mb-3">Things You Have in Common</h2>
              <div className="flex flex-wrap gap-2">
                {profile.mutualInterests.map((i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-xs font-semibold">
                    💡 {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mutual match */}
          {profile.isMutual && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">💕</div>
              <p className="font-bold text-green-700">Mutual Interest!</p>
              <p className="text-sm text-green-600 mt-1">You both liked each other. Start a conversation!</p>
              <a href={`/messages?userId=${profile.userId}`} className="inline-block mt-3 px-5 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                💬 Start Chatting
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── Report ─────────────────────────────────────────────────────────── */}
      <div className="text-center">
        <button className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto">
          <Flag size={12} /> Report this profile
        </button>
      </div>
    </div>
  );
}
