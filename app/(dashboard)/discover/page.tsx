'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import { DEFAULT_FILTERS } from './_components/constants';
import type { DiscoverProfile, FreeLimit, Filters } from './_components/types';
import FreeLimitBanner from './_components/FreeLimitBanner';
import DiscoverFilterPanel from './_components/DiscoverFilterPanel';
import ProfileGrid from './_components/ProfileGrid';

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

  const handleLike = useCallback(async (profile: DiscoverProfile) => {
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
  }, [liked]);

  const handleSave = useCallback(async (profile: DiscoverProfile) => {
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
  }, []);

  const resetFilters = () => { setFilters(DEFAULT_FILTERS); setFiltersOpen(false); };
  const isAtLimit    = freeLimit?.isLimited === true && profiles.length === 0;

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-neutral-900 truncate">Discover Profiles</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {total > 0 ? `${total} profiles found` : 'Browse all members'}
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
            hasFilters || filtersOpen
              ? 'border-primary-700 text-primary-700 bg-primary-50'
              : 'border-vivaah-border text-neutral-600 hover:border-primary-700/40 bg-white'
          }`}
        >
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-primary-700 rounded-full" aria-label="Filters active" />}
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
        <DiscoverFilterPanel
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
          onApply={() => setFiltersOpen(false)}
        />
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-medium text-neutral-600">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <ProfileGrid
          profiles={profiles}
          loading={loading}
          liked={liked}
          saved={saved}
          onLike={handleLike}
          onSave={handleSave}
          freeLimit={freeLimit}
          isAtLimit={isAtLimit}
          search={search}
          hasFilters={hasFilters}
          onClearAll={() => { setSearch(''); resetFilters(); }}
          page={page}
          totalPages={totalPages}
          total={total}
          onLoadMore={() => { const next = page + 1; setPage(next); fetchProfiles(next, search, filters); }}
        />
      )}
    </div>
  );
}
