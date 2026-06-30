'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, Heart } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Visitor {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  religion: string | null;
  photo: string | null;
  isVerified: boolean;
  isOnline: boolean;
  matchPercent: number;
  viewedAt: string;
  viewedAgo: string;
}

function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-neutral-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-neutral-200 rounded w-36" />
        <div className="h-3 bg-neutral-100 rounded w-24" />
        <div className="h-3 bg-neutral-100 rounded w-20" />
      </div>
      <div className="flex-shrink-0 space-y-2">
        <div className="h-7 bg-neutral-100 rounded-xl w-20" />
        <div className="h-7 bg-neutral-100 rounded-xl w-20" />
      </div>
    </div>
  );
}

// ─── Visitor Card ─────────────────────────────────────────────────────────────

function VisitorCard({
  visitor,
  isLiked,
  onLike,
}: {
  visitor: Visitor;
  isLiked: boolean;
  onLike: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
              {visitor.photo && !imgErr ? (
                <img
                  src={visitor.photo}
                  alt={visitor.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgErr(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
              )}
            </div>
            {visitor.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-neutral-900 text-sm truncate">
                {visitor.name}{visitor.age ? `, ${visitor.age}` : ''}
              </h3>
              {visitor.isVerified && <span className="text-blue-500 text-xs">✓</span>}
            </div>
            {visitor.profession && (
              <p className="text-xs text-neutral-500 truncate mt-0.5">{visitor.profession}</p>
            )}
            {visitor.location && (
              <p className="text-xs text-neutral-400 truncate">📍 {visitor.location}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${scoreBg(visitor.matchPercent)}`}>
                {visitor.matchPercent}% match
              </span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Eye size={10} /> {visitor.viewedAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={onLike}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              isLiked
                ? 'bg-primary-gradient text-white'
                : 'border border-primary-700 text-primary-700 hover:bg-primary-50'
            }`}
          >
            <Heart size={12} className={isLiked ? 'fill-white' : ''} />
            {isLiked ? 'Liked' : 'Like Back'}
          </button>
          <a
            href={`/profile/${visitor.userId}`}
            className="flex-1 sm:flex-initial px-3 py-1.5 border border-vivaah-border text-neutral-600 rounded-xl text-xs font-semibold hover:border-primary-700/40 hover:text-primary-700 transition-colors text-center"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VisitorsPage() {
  const [visitors, setVisitors]     = useState<Visitor[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [liked, setLiked]           = useState<Set<string>>(new Set());

  const fetchVisitors = useCallback(async (pg: number) => {
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in.'); setLoading(false); return; }

    setLoading(true); setError(null);
    try {
      const res  = await fetch(`/api/visitors?page=${pg}&limit=20`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed');
      setVisitors((prev) => pg === 1 ? json.data.visitors : [...prev, ...json.data.visitors]);
      setTotal(json.data.total);
      setTotalPages(json.data.totalPages ?? 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVisitors(1); }, [fetchVisitors]);

  const handleLike = async (visitor: Visitor) => {
    setLiked((prev) => {
      const s = new Set(prev);
      s.has(visitor.userId) ? s.delete(visitor.userId) : s.add(visitor.userId);
      return s;
    });
    if (liked.has(visitor.userId)) return;
    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: visitor.userId }),
      });
    } catch { /* non-fatal */ }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-neutral-900">Profile Visitors</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {total > 0 ? `${total} people viewed your profile` : 'See who viewed your profile'}
          </p>
        </div>
        {total > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl px-3 py-2 text-center flex-shrink-0">
            <p className="text-lg font-bold text-primary-700">{total}</p>
            <p className="text-[10px] text-primary-600 font-medium">Visitors</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="font-medium text-neutral-600">{error}</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && visitors.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* List */}
      {!error && (
        <>
          <div className="space-y-3">
            {visitors.map((v) => (
              <VisitorCard
                key={v.id}
                visitor={v}
                isLiked={liked.has(v.userId)}
                onLike={() => handleLike(v)}
              />
            ))}
          </div>

          {/* Empty state */}
          {!loading && visitors.length === 0 && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">👀</div>
              <h2 className="font-bold text-neutral-700 text-lg">No visitors yet</h2>
              <p className="text-sm text-neutral-400 mt-1.5 max-w-xs mx-auto">
                Complete your profile to attract more visitors. A strong profile with a photo gets 5× more views.
              </p>
              <a
                href="/edit-profile"
                className="inline-block mt-4 px-6 py-2.5 bg-primary-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Complete Profile
              </a>
            </div>
          )}

          {/* Load more */}
          {!loading && page < totalPages && (
            <div className="text-center">
              <button
                onClick={() => { const next = page + 1; setPage(next); fetchVisitors(next); }}
                className="px-6 py-3 border border-primary-700 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Load more
              </button>
            </div>
          )}

          {!loading && visitors.length > 0 && (
            <p className="text-center text-xs text-neutral-400">
              Showing {visitors.length} of {total} visitors
            </p>
          )}
        </>
      )}
    </div>
  );
}
