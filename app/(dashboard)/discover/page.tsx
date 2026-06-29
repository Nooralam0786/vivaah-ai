'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X, Bookmark, Heart, Eye, Crown, Lock, Zap, ArrowRight } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiscoverProfile {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  religion: string | null;
  caste: string | null;
  height: string | null;
  income: string | null;
  matchPercent: number;
  isOnline: boolean;
  isVerified: boolean;
  photo: string | null;
}

interface FreeLimit { total: number; used: number; remaining: number; isLimited: boolean; }

interface Filters { religion: string; state: string; minAge: string; maxAge: string; }
const DEFAULT_FILTERS: Filters = { religion: '', state: '', minAge: '', maxAge: '' };

const RELIGIONS = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Other'];
const STATES    = ['Any','Delhi','Maharashtra','Karnataka','Tamil Nadu','Uttar Pradesh','Gujarat','Rajasthan','West Bengal','Telangana','Kerala','Punjab','Haryana','Madhya Pradesh','Bihar'];
const AGE_PRESETS = [{ label: '18–25', min: '18', max: '25' }, { label: '25–30', min: '25', max: '30' }, { label: '30–35', min: '30', max: '35' }, { label: '35–40', min: '35', max: '40' }, { label: '40+', min: '40', max: '' }];

function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-7 bg-neutral-100 rounded-xl flex-1" />
          <div className="h-7 bg-neutral-100 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  isLiked,
  isSaved,
  onLike,
  onSave,
}: {
  profile: DiscoverProfile;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0">
        {profile.photo && !imgErr ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">👤</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Match % */}
        <div className={`absolute top-2.5 left-2.5 ${scoreBg(profile.matchPercent)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {profile.matchPercent}%
        </div>

        {/* Online dot */}
        {profile.isOnline && (
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Save bookmark */}
        <button
          onClick={onSave}
          className={`absolute top-8 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isSaved ? 'bg-amber-400 text-white' : 'bg-black/40 text-white hover:bg-amber-400'
          }`}
        >
          <Bookmark size={13} className={isSaved ? 'fill-white' : ''} />
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1">
            <h3 className="text-white font-bold text-sm leading-tight truncate">
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h3>
            {profile.isVerified && <span className="text-blue-300 text-xs flex-shrink-0">✓</span>}
          </div>
          {profile.profession && <p className="text-white/80 text-xs truncate">{profile.profession}</p>}
          {profile.location && (
            <p className="text-white/60 text-[10px] truncate">📍 {profile.location}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2">
        <button
          onClick={onLike}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            isLiked ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'
          }`}
        >
          <Heart size={12} className={isLiked ? 'fill-white' : ''} />
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <a
          href={`/profile/${profile.userId}`}
          className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1"
        >
          <Eye size={12} /> View
        </a>
      </div>
    </div>
  );
}

// ─── Upgrade Wall Card ────────────────────────────────────────────────────────

function UpgradeWallCard() {
  return (
    <div className="col-span-full">
      <div className="bg-gradient-to-br from-primary-50 to-amber-50 border-2 border-dashed border-primary-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary-700" />
        </div>
        <h3 className="text-lg font-extrabold text-neutral-900 mb-1">Daily Limit Reached</h3>
        <p className="text-sm text-neutral-500 mb-5 max-w-xs mx-auto">
          Free plan lets you view 5 profiles per day. Upgrade to Gold to see unlimited profiles.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/select-plan"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Gold — ₹499/mo
          </Link>
          <Link
            href="/select-plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-400 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            View All Plans
          </Link>
        </div>
        <p className="text-xs text-neutral-400 mt-4">Your free limit resets every day at midnight UTC</p>
      </div>
    </div>
  );
}

// ─── Free Limit Banner ────────────────────────────────────────────────────────

function FreeLimitBanner({ freeLimit }: { freeLimit: FreeLimit }) {
  const pct = Math.round((freeLimit.used / freeLimit.total) * 100);
  const isLow = freeLimit.remaining <= 2;
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-sm ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {isLow
            ? <span className="text-lg">⚠️</span>
            : <span className="text-lg">ℹ️</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-xs ${isLow ? 'text-amber-800' : 'text-blue-800'}`}>
            {freeLimit.remaining > 0
              ? `${freeLimit.remaining} of ${freeLimit.total} free profiles remaining today`
              : 'Daily limit reached'}
          </p>
          <div className="mt-1.5 h-1.5 bg-white/70 rounded-full overflow-hidden w-36">
            <div
              className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <Link
        href="/select-plan"
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-gradient text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <Crown className="w-3 h-3" />
        Upgrade
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [search, setSearch]       = useState('');
  const [filters, setFilters]     = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [profiles, setProfiles]   = useState<DiscoverProfile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [liked, setLiked]         = useState<Set<string>>(new Set());
  const [saved, setSaved]         = useState<Set<string>>(new Set());
  const [error, setError]         = useState<string | null>(null);
  const [freeLimit, setFreeLimit] = useState<FreeLimit | null>(null);
  const abortRef                  = useRef<AbortController | null>(null);

  const hasFilters = Object.values(filters).some(Boolean);

  const fetchProfiles = useCallback(async (pg: number, s: string, f: Filters) => {
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in.'); setLoading(false); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true); setError(null);

    try {
      const params = new URLSearchParams({ page: String(pg), limit: '20' });
      if (s)          params.set('search',   s);
      if (f.religion) params.set('religion', f.religion);
      if (f.state)    params.set('state',    f.state);
      if (f.minAge)   params.set('minAge',   f.minAge);
      if (f.maxAge)   params.set('maxAge',   f.maxAge);

      const res  = await fetch(`/api/discover?${params}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        signal: abortRef.current.signal,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed');

      setProfiles(pg === 1 ? json.data.profiles : (prev: DiscoverProfile[]) => [...prev, ...json.data.profiles]);
      setTotal(json.data.total);
      setTotalPages(json.data.totalPages ?? 1);
      if (json.data.freeLimit) setFreeLimit(json.data.freeLimit);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search + filter trigger
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setProfiles([]);
      fetchProfiles(1, search, filters);
    }, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [search, filters, fetchProfiles]);

  const handleLike = async (profile: DiscoverProfile) => {
    setLiked((prev) => { const s = new Set(prev); s.has(profile.id) ? s.delete(profile.id) : s.add(profile.id); return s; });
    if (liked.has(profile.id)) return;
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

  const handleSave = async (profile: DiscoverProfile) => {
    setSaved((prev) => { const s = new Set(prev); s.has(profile.id) ? s.delete(profile.id) : s.add(profile.id); return s; });
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

  const resetFilters = () => { setFilters(DEFAULT_FILTERS); setFiltersOpen(false); };
  const isAtLimit    = freeLimit?.isLimited === true && profiles.length === 0;

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Discover Profiles</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {total > 0 ? `${total} profiles found` : 'Browse all members'}
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
            hasFilters || filtersOpen
              ? 'border-primary-700 text-primary-700 bg-primary-50'
              : 'border-vivaah-border text-neutral-600 hover:border-primary-700/40 bg-white'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-primary-700 rounded-full" />}
        </button>
      </div>

      {/* Free limit banner (only for free users) */}
      {freeLimit && !isAtLimit && (
        <FreeLimitBanner freeLimit={freeLimit} />
      )}

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, location, profession…"
          className="w-full pl-11 pr-10 py-3 bg-white border border-vivaah-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 shadow-card"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 space-y-4">
          {/* Religion */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Religion</p>
            <div className="flex flex-wrap gap-2">
              {RELIGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters((f) => ({ ...f, religion: r === 'Any' ? '' : r }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    (filters.religion === r || (!filters.religion && r === 'Any'))
                      ? 'bg-primary-gradient text-white shadow-sm'
                      : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Age Range</p>
            <div className="flex flex-wrap gap-2">
              {AGE_PRESETS.map((a) => {
                const active = filters.minAge === a.min && filters.maxAge === a.max;
                return (
                  <button
                    key={a.label}
                    onClick={() => setFilters((f) => active ? { ...f, minAge: '', maxAge: '' } : { ...f, minAge: a.min, maxAge: a.max })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active ? 'bg-primary-gradient text-white shadow-sm' : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* State */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">State</p>
            <div className="flex flex-wrap gap-2">
              {STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters((f) => ({ ...f, state: s === 'Any' ? '' : s }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    (filters.state === s || (!filters.state && s === 'Any'))
                      ? 'bg-primary-gradient text-white shadow-sm'
                      : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-vivaah-border">
            <button onClick={resetFilters} className="px-4 py-2 border border-vivaah-border rounded-xl text-sm text-neutral-600 hover:bg-vivaah-bg transition-colors">
              Reset All
            </button>
            <button onClick={() => setFiltersOpen(false)} className="px-6 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-medium text-neutral-600">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {profiles.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                isLiked={liked.has(p.id)}
                isSaved={saved.has(p.id)}
                onLike={() => handleLike(p)}
                onSave={() => handleSave(p)}
              />
            ))}
            {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}

            {/* Upgrade wall — shown when limit is reached mid-grid */}
            {!loading && freeLimit?.isLimited && profiles.length > 0 && (
              <UpgradeWallCard />
            )}
          </div>

          {/* Full-screen upgrade wall — when limit was reached before first load */}
          {!loading && isAtLimit && (
            <div className="py-10">
              <UpgradeWallCard />
            </div>
          )}

          {/* Empty state (no results, not a limit issue) */}
          {!loading && profiles.length === 0 && !isAtLimit && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-medium text-neutral-600">No profiles found</p>
              <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
              {(search || hasFilters) && (
                <button onClick={() => { setSearch(''); resetFilters(); }} className="mt-3 text-sm text-primary-700 font-semibold hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Load more — only for paid users */}
          {!loading && !freeLimit && page < totalPages && (
            <div className="text-center">
              <button
                onClick={() => { const next = page + 1; setPage(next); fetchProfiles(next, search, filters); }}
                className="px-6 py-3 border border-primary-700 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Load more profiles
              </button>
            </div>
          )}

          {!loading && profiles.length > 0 && !freeLimit && (
            <p className="text-center text-xs text-neutral-400">
              Showing {profiles.length} of {total} profiles
            </p>
          )}
        </>
      )}
    </div>
  );
}
