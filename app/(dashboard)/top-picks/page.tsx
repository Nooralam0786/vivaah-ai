'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Heart, MessageCircle, Star, Shield, Zap } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface TopProfile {
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  religion: string | null;
  matchPercent: number;
  photo: string | null;
  isVerified: boolean;
  isOnline: boolean;
  reasons?: string[];
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#D4AF37' : '#6B1B3D';
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="#f0e9f0" strokeWidth="5" />
        <circle
          cx="28" cy="28" r="22" fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-neutral-800">
        {score}%
      </span>
    </div>
  );
}

function MatchReasons({ reasons }: { reasons: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {reasons.map((r, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F9F0F4] text-[#6B1B3D] text-xs font-medium rounded-full border border-[#6B1B3D]/15">
          <Sparkles size={10} /> {r}
        </span>
      ))}
    </div>
  );
}

export default function TopPicksPage() {
  const [profiles, setProfiles]     = useState<TopProfile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [enriching, setEnriching]   = useState(false);
  const [likedIds, setLikedIds]     = useState<Set<string>>(new Set());

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) return;

    const fetchAndEnrich = async () => {
      setLoading(true);
      const res  = await fetch('/api/discover?limit=40', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (!json.success) { setLoading(false); return; }

      // Filter 75%+, sort desc
      const top: TopProfile[] = (json.data.profiles as TopProfile[])
        .filter((p) => p.matchPercent >= 75)
        .sort((a, b) => b.matchPercent - a.matchPercent)
        .slice(0, 20);

      setProfiles(top);
      setLoading(false);

      // Enrich with explanations (fire sequentially to avoid flooding)
      setEnriching(true);
      const enriched = [...top];
      for (let i = 0; i < enriched.length; i++) {
        try {
          const er = await fetch(`/api/matches/explain/${enriched[i].userId}`, {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          });
          const ej = await er.json();
          if (ej.success) enriched[i] = { ...enriched[i], reasons: ej.data.reasons };
        } catch { /* skip */ }
        if (i % 3 === 2) setProfiles([...enriched]); // batch update every 3
      }
      setProfiles([...enriched]);
      setEnriching(false);
    };

    fetchAndEnrich();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async (targetUserId: string) => {
    if (!auth || likedIds.has(targetUserId)) return;
    setLikedIds((prev) => new Set([...prev, targetUserId]));
    await fetch('/api/matches', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
      body:    JSON.stringify({ toUserId: targetUserId, action: 'like' }),
    });
  };

  if (!auth) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-neutral-400">
        <p>Please <a href="/login" className="text-[#6B1B3D] font-semibold">log in</a> to see your top picks.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-[#D4AF37]" size={22} />
          <h1 className="text-2xl font-bold text-neutral-900">Your Top Picks</h1>
          {enriching && (
            <span className="text-xs text-[#6B1B3D] font-medium animate-pulse flex items-center gap-1">
              <Zap size={12} /> AI analysing…
            </span>
          )}
        </div>
        <p className="text-neutral-500 text-sm">Profiles with 75%+ AI compatibility score, ranked by match quality.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-neutral-200 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-neutral-200 rounded w-32" />
                <div className="h-3 bg-neutral-100 rounded w-24" />
                <div className="h-3 bg-neutral-100 rounded w-40" />
              </div>
              <div className="w-16 h-16 rounded-full bg-neutral-200 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && profiles.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
          <div className="text-5xl mb-4">🤔</div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">No high-compatibility matches yet</h3>
          <p className="text-neutral-400 text-sm max-w-sm mx-auto">
            Complete your profile and set preferences — the AI needs more information to find your best matches.
          </p>
          <a href="/settings" className="inline-block mt-5 px-5 py-2.5 bg-[#6B1B3D] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Complete Profile
          </a>
        </div>
      )}

      {/* Cards */}
      {!loading && profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile, idx) => (
            <div key={profile.userId} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
              idx === 0 ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-neutral-100'
            }`}>
              {idx === 0 && (
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#6B1B3D]/10 px-4 py-1.5 flex items-center gap-1.5">
                  <Star size={13} className="text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-semibold text-[#6B1B3D]">Best Match</span>
                </div>
              )}

              <div className="p-4 flex gap-4">
                {/* Photo */}
                <a href={`/profile/${profile.userId}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F9F0F4]">
                    {profile.photo
                      ? <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                      : <span className="w-full h-full flex items-center justify-center text-3xl">👤</span>}
                    {profile.isOnline && (
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                </a>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <a href={`/profile/${profile.userId}`} className="font-semibold text-neutral-900 hover:text-[#6B1B3D] transition-colors">
                        {profile.name}
                        {profile.isVerified && <Shield size={12} className="inline ml-1 text-blue-500 fill-blue-100" />}
                      </a>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {[profile.age && `${profile.age} yrs`, profile.profession, profile.location]
                          .filter(Boolean).join(' · ')}
                      </p>
                      {profile.religion && (
                        <p className="text-xs text-neutral-400 mt-0.5">{profile.religion}</p>
                      )}
                    </div>
                    <ScoreRing score={profile.matchPercent} />
                  </div>

                  {/* Reasons */}
                  {profile.reasons && <MatchReasons reasons={profile.reasons} />}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => handleLike(profile.userId)}
                      disabled={likedIds.has(profile.userId)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        likedIds.has(profile.userId)
                          ? 'bg-pink-50 text-pink-500 border border-pink-200'
                          : 'bg-[#6B1B3D] text-white hover:opacity-90'
                      }`}
                    >
                      <Heart size={12} className={likedIds.has(profile.userId) ? 'fill-pink-500' : ''} />
                      {likedIds.has(profile.userId) ? 'Liked' : 'Like'}
                    </button>
                    <a
                      href={`/messages?userId=${profile.userId}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                    >
                      <MessageCircle size={12} />
                      Message
                    </a>
                    <a
                      href={`/profile/${profile.userId}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-600 hover:border-[#6B1B3D] hover:text-[#6B1B3D] transition-colors ml-auto"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
