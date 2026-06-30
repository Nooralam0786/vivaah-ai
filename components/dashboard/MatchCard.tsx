'use client';

import { useEffect, useState } from 'react';
import { Heart, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

interface ApiMatch {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  religion: string | null;
  caste: string | null;
  height: string | null;
  matchPercent: number;
  isOnline: boolean;
  isVerified: boolean;
  photo: string | null;
  mutualInterests: string[];
}

function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-500';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[3/2.5] bg-neutral-200" />
      <div className="px-2.5 pt-2 pb-2 space-y-1.5">
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
        <div className="h-2.5 bg-neutral-100 rounded w-1/2" />
        <div className="h-2.5 bg-neutral-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: ApiMatch; index?: number }) {
  const [liked, setLiked]   = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const tags = [match.religion, match.caste, match.height].filter(Boolean) as string[];

  const handleLike = async () => {
    setLiked((prev) => !prev);
    if (liked) return;
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/matches', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ targetUserId: match.userId }),
      });
    } catch { /* non-fatal */ }
  };

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group w-full flex flex-col">
      {/* Photo */}
      <div className="relative overflow-hidden aspect-[3/2.5]">
        {match.photo && !imgErr ? (
          <img
            src={match.photo}
            alt={match.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-3xl">👤</div>
          </div>
        )}

        {/* Match % badge */}
        <div className={`absolute top-2.5 left-2.5 ${scoreBg(match.matchPercent)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow`}>
          {match.matchPercent}% Match
        </div>

        {/* Online + Heart */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {match.isOnline && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block" />
              <span className="text-white text-[9px] font-medium">Online</span>
            </div>
          )}
          <button
            onClick={handleLike}
            aria-label={liked ? 'Unlike profile' : 'Like profile'}
            aria-pressed={liked}
            className="w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Heart size={13} className={liked ? 'text-rose-400 fill-rose-400' : 'text-white'} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-2.5 pt-1.5 pb-1 min-w-0">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[11px] font-bold text-neutral-900 leading-tight truncate min-w-0">
            {match.name}{match.age ? `, ${match.age}` : ''}
          </span>
          {match.isVerified && (
            <CheckCircle2 size={11} className="text-blue-500 flex-shrink-0" fill="#3b82f6" strokeWidth={0} />
          )}
        </div>
        {match.profession && (
          <p className="text-[10px] text-neutral-500 truncate">{match.profession}</p>
        )}
        {match.location && (
          <div className="flex items-center gap-0.5 min-w-0">
            <MapPin size={8} className="text-neutral-400 flex-shrink-0" />
            <p className="text-[10px] text-neutral-400 truncate min-w-0">{match.location}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="px-2.5 pb-2 flex flex-wrap gap-1">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-full text-[9px] font-medium">
            {tag}
          </span>
        ))}
        {match.mutualInterests.slice(0, 1).map((i) => (
          <span key={i} className="px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[9px] font-medium">
            💡 {i}
          </span>
        ))}
      </div>

      {/* View Profile button */}
      <div className="px-2.5 pb-2.5">
        <a
          href={`/profile/${match.userId}`}
          className="flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-primary-gradient text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
        >
          View Profile <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}

// ─── AI Recommended Matches (used on dashboard) ───────────────────────────────

export function AIRecommendedMatches() {
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) { setLoading(false); return; }

    fetch('/api/matches?limit=4&tab=new', {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => { if (json.success) setMatches(json.data.matches.slice(0, 4)); })
      .catch(() => {/* show empty */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-1.5">
            <span className="text-primary-700">✨</span>
            AI Recommended Matches
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">Based on your preferences &amp; compatibility</p>
        </div>
        <a
          href="/matches"
          className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-0.5 whitespace-nowrap mt-0.5"
        >
          See all <ChevronRight size={13} />
        </a>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && matches.length === 0 && (
        <div className="text-center py-8 text-neutral-400">
          <div className="text-4xl mb-2">💕</div>
          <p className="text-sm font-medium text-neutral-500">No matches yet</p>
          <p className="text-xs mt-1">Complete your profile to get recommendations</p>
          <a href="/profile" className="inline-block mt-3 text-xs font-semibold text-primary-700 hover:underline">
            Complete Profile →
          </a>
        </div>
      )}

      {/* Cards */}
      {!loading && matches.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {matches.map((match, i) => (
            <MatchCard key={match.id} match={match} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
