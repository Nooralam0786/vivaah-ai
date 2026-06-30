'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getAuthFromStorage } from '@/lib/auth';
import { DEFAULT_FILTERS } from './_components/constants';
import type { MatchData, Filters } from './_components/types';
import PageHeader from './_components/PageHeader';
import TabBar from './_components/TabBar';
import FilterPanel from './_components/FilterPanel';
import MatchGrid from './_components/MatchGrid';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const [tab, setTab]           = useState('new');
  const [filters, setFilters]   = useState<Filters>(DEFAULT_FILTERS);
  const [matches, setMatches]   = useState<MatchData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]       = useState(0);
  const [error, setError]       = useState<string | null>(null);
  const [liked, setLiked]       = useState<Set<string>>(new Set());
  const [passed, setPassed]     = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const hasFilters = Object.values(filters).some(Boolean);

  const fetchMatches = useCallback(async (pg: number, currentTab: string, f: Filters) => {
    const auth = getAuthFromStorage();
    if (!auth) {
      setError('Please log in to see your matches.');
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ tab: currentTab, page: String(pg), limit: '12' });
      if (f.religion) params.set('religion', f.religion);
      if (f.state)    params.set('state',    f.state);
      if (f.minAge)   params.set('minAge',   f.minAge);
      if (f.maxAge)   params.set('maxAge',   f.maxAge);

      const res  = await fetch(`/api/matches?${params}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        signal:  abortRef.current.signal,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to load matches');

      const data = json.data;
      setMatches(pg === 1 ? data.matches : (prev) => [...prev, ...data.matches]);
      setTotal(data.total);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever tab or filters change
  useEffect(() => {
    setPage(1);
    setMatches([]);
    fetchMatches(1, tab, filters);
  }, [tab, filters, fetchMatches]);

  // Load more
  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMatches(next, tab, filters);
  };

  const handleLike = useCallback(async (match: MatchData) => {
    setLiked((prev) => {
      const s = new Set(prev);
      s.has(match.id) ? s.delete(match.id) : s.add(match.id);
      return s;
    });

    if (liked.has(match.id)) return;
    const auth = getAuthFromStorage();
    if (!auth) return;

    try {
      await fetch('/api/matches', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ targetUserId: match.userId }),
      });
    } catch { /* non-fatal, UI is already updated */ }
  }, [liked]);

  const handlePass = useCallback(async (match: MatchData) => {
    setPassed((prev) => new Set([...prev, match.id]));
    setMatches((prev) => prev.filter((m) => m.id !== match.id));
    setTotal((t) => Math.max(0, t - 1));

    const auth = getAuthFromStorage();
    if (!auth) return;
    try {
      await fetch('/api/matches/pass', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ passedUserId: match.userId }),
      });
    } catch { /* non-fatal */ }
  }, []);

  const visibleMatches = matches.filter((m) => !passed.has(m.id));

  // Premium lock
  if (tab === 'premium') {
    return (
      <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
        <PageHeader total={total} hasFilters={hasFilters} filterOpen={filterOpen} onToggleFilter={() => setFilterOpen(!filterOpen)} />
        <TabBar tab={tab} setTab={setTab} matches={matches} />
        <div className="bg-premium-gradient rounded-2xl p-10 text-white text-center">
          <div className="text-5xl mb-3">👑</div>
          <h3 className="text-xl font-bold mb-2">Unlock Premium Matches</h3>
          <p className="text-white/70 text-sm mb-5 max-w-sm mx-auto">
            Access highly compatible profiles with AI-powered deep matching, verified profiles, and priority visibility.
          </p>
          <a href="/premium-benefits" className="inline-block px-8 py-3 bg-gold-gradient text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
            Upgrade Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <PageHeader
        total={total}
        hasFilters={hasFilters}
        filterOpen={filterOpen}
        onToggleFilter={() => setFilterOpen(!filterOpen)}
      />

      <TabBar tab={tab} setTab={setTab} matches={matches} />

      <div className="flex gap-5 items-start">
        {/* ── Filter sidebar (desktop) ─────────────────────────────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-4">
          <FilterPanel
            filters={filters}
            onChange={(f) => { setFilters(f); }}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        {/* ── Mobile filter panel ──────────────────────────────────────── */}
        {filterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <div className="relative w-full bg-transparent px-4 pb-4">
              <FilterPanel
                filters={filters}
                onChange={(f) => { setFilters(f); }}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <MatchGrid
            loading={loading}
            error={error}
            isLoggedIn={!!getAuthFromStorage()}
            visibleMatches={visibleMatches}
            liked={liked}
            onLike={handleLike}
            onPass={handlePass}
            tab={tab}
            hasFilters={hasFilters}
            page={page}
            totalPages={totalPages}
            total={total}
            onLoadMore={loadMore}
          />
        </main>
      </div>
    </div>
  );
}
