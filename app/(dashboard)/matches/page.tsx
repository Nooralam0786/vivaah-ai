'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  MapPin, CheckCircle2, SlidersHorizontal, X,
  ChevronDown, RefreshCw, SkipForward, Eye,
} from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MatchData {
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
  tag: string;
  photo: string | null;
  mutualInterests: string[];
}

interface Filters {
  minAge: string;
  maxAge: string;
  religion: string;
  state: string;
}

const DEFAULT_FILTERS: Filters = { minAge: '', maxAge: '', religion: '', state: '' };

const TABS = [
  { id: 'new',        label: 'Suggested',       emoji: '✨' },
  { id: 'compatible', label: 'Compatible',       emoji: '💯' },
  { id: 'mutual',     label: 'Mutual Interest',  emoji: '💕' },
  { id: 'premium',    label: 'Premium',          emoji: '👑', premium: true },
];

const RELIGIONS = ['Any', 'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const STATES    = [
  'Any', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// ─── Score Badge ──────────────────────────────────────────────────────────────

function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-500';
}

function scoreLabel(pct: number) {
  if (pct >= 90) return 'Excellent';
  if (pct >= 80) return 'Great';
  if (pct >= 70) return 'Good';
  return 'Fair';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden animate-pulse">
      <div className="h-56 bg-neutral-200" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 bg-neutral-100 rounded-full w-16" />
          <div className="h-5 bg-neutral-100 rounded-full w-20" />
        </div>
        <div className="flex gap-2 mt-3">
          <div className="h-9 bg-neutral-100 rounded-xl flex-1" />
          <div className="h-9 bg-neutral-100 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

interface MatchCardProps {
  match: MatchData;
  isLiked: boolean;
  onLike: (m: MatchData) => void;
  onPass: (m: MatchData) => void;
}

function MatchCard({ match, isLiked, onLike, onPass }: MatchCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Photo */}
      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden flex-shrink-0">
        {match.photo && !imgErr ? (
          <img
            src={match.photo}
            alt={match.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">👤</div>
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Match % badge */}
        <div className={`absolute top-3 left-3 ${scoreBg(match.matchPercent)} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
          {match.matchPercent}% · {scoreLabel(match.matchPercent)}
        </div>

        {/* Online pill */}
        {match.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block" />
            <span className="text-white text-[10px] font-medium">Online</span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-white font-bold text-base leading-tight">
              {match.name}{match.age ? `, ${match.age}` : ''}
            </h3>
            {match.isVerified && (
              <CheckCircle2 size={14} className="text-blue-300 flex-shrink-0" fill="#93c5fd" strokeWidth={0} />
            )}
          </div>
          {(match.profession || match.location) && (
            <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
              {match.location && <MapPin size={10} className="flex-shrink-0" />}
              {[match.profession, match.location].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Info pills */}
        <div className="flex flex-wrap gap-1.5">
          {match.religion && (
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">
              {match.religion}
            </span>
          )}
          {match.caste && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.caste}
            </span>
          )}
          {match.height && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.height}
            </span>
          )}
          {match.income && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.income}
            </span>
          )}
        </div>

        {/* Mutual interests */}
        {match.mutualInterests.length > 0 && (
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide mb-1">
              💡 Mutual interests
            </p>
            <div className="flex flex-wrap gap-1">
              {match.mutualInterests.slice(0, 4).map((i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-medium">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onPass(match)}
            title="Skip this profile"
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-colors"
          >
            <SkipForward size={15} />
          </button>
          <button
            onClick={() => onLike(match)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              isLiked
                ? 'bg-primary-gradient text-white shadow-sm'
                : 'border border-primary-700 text-primary-700 hover:bg-primary-50'
            }`}
          >
            {isLiked ? '❤️ Interested' : '🤍 Send Interest'}
          </button>
          <a
            href={`/profile/${match.userId}`}
            className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
          >
            <Eye size={14} /> View
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  onClose?: () => void;
}

function FilterPanel({ filters, onChange, onReset, onClose }: FilterPanelProps) {
  const field = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value });

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-neutral-900 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-700" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button onClick={onReset} className="text-xs text-primary-700 font-semibold hover:underline">
              Reset
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Age range */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          Age Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={18} max={60}
            value={filters.minAge}
            onChange={field('minAge')}
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-vivaah-border rounded-xl text-sm focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          />
          <span className="text-neutral-400 text-sm">–</span>
          <input
            type="number"
            min={18} max={70}
            value={filters.maxAge}
            onChange={field('maxAge')}
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-vivaah-border rounded-xl text-sm focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          />
        </div>
      </div>

      {/* Religion */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          Religion
        </label>
        <div className="relative">
          <select
            value={filters.religion}
            onChange={field('religion')}
            className="w-full px-3 py-2 border border-vivaah-border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          >
            {RELIGIONS.map((r) => (
              <option key={r} value={r === 'Any' ? '' : r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* State */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          State / Region
        </label>
        <div className="relative">
          <select
            value={filters.state}
            onChange={field('state')}
            className="w-full px-3 py-2 border border-vivaah-border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          >
            {STATES.map((s) => (
              <option key={s} value={s === 'Any' ? '' : s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {hasActive && (
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs text-primary-700 font-medium">
            <span className="w-1.5 h-1.5 bg-primary-700 rounded-full block" />
            Filters active
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ tab, hasFilters }: { tab: string; hasFilters: boolean }) {
  const msgs: Record<string, { emoji: string; title: string; sub: string }> = {
    new:        { emoji: '💕', title: 'No suggestions yet',      sub: 'Complete your profile to get personalised matches.' },
    compatible: { emoji: '💯', title: 'No highly compatible matches', sub: 'Broaden your preferences or check back soon.' },
    mutual:     { emoji: '🤝', title: 'No mutual interests yet', sub: 'Send interests to profiles you like and wait for them to respond.' },
  };
  const m = msgs[tab] ?? msgs['new'];
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4 select-none">{m.emoji}</div>
      <h3 className="font-bold text-neutral-700 text-lg mb-1">
        {hasFilters ? 'No results for these filters' : m.title}
      </h3>
      <p className="text-sm text-neutral-400 max-w-xs mx-auto">
        {hasFilters ? 'Try adjusting or resetting your filters to see more profiles.' : m.sub}
      </p>
    </div>
  );
}

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

  const handleLike = async (match: MatchData) => {
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
  };

  const handlePass = async (match: MatchData) => {
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
  };

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
          {/* Loading — first page */}
          {loading && matches.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="font-medium text-neutral-600">{error}</p>
              {!getAuthFromStorage() && (
                <a href="/login" className="text-sm mt-2 inline-block text-primary-700 font-semibold hover:underline">
                  Go to login →
                </a>
              )}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && visibleMatches.length === 0 && (
            <EmptyState tab={tab} hasFilters={hasFilters} />
          )}

          {/* Cards grid */}
          {visibleMatches.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    isLiked={liked.has(m.id)}
                    onLike={handleLike}
                    onPass={handlePass}
                  />
                ))}

                {/* Skeleton cards while loading more */}
                {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
              </div>

              {/* Load more / pagination */}
              {!loading && page < totalPages && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary-700 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <RefreshCw size={15} />
                    Load more matches
                  </button>
                </div>
              )}

              {/* Totals */}
              {!loading && (
                <p className="text-center text-xs text-neutral-400 mt-4">
                  Showing {visibleMatches.length} of {total} profiles
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader({
  total,
  hasFilters,
  filterOpen,
  onToggleFilter,
}: {
  total: number;
  hasFilters: boolean;
  filterOpen: boolean;
  onToggleFilter: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Your Matches</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {total > 0 ? `${total} compatible profiles found` : 'Explore profiles that match your preferences'}
        </p>
      </div>
      <button
        onClick={onToggleFilter}
        className={`lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
          hasFilters || filterOpen
            ? 'border-primary-700 text-primary-700 bg-primary-50'
            : 'border-vivaah-border text-neutral-600 hover:border-primary-700/40'
        }`}
      >
        <SlidersHorizontal size={15} />
        Filters
        {hasFilters && <span className="w-2 h-2 bg-primary-700 rounded-full" />}
      </button>
    </div>
  );
}

function TabBar({
  tab,
  setTab,
  matches,
}: {
  tab: string;
  setTab: (t: string) => void;
  matches: MatchData[];
}) {
  const counts: Record<string, number> = {};
  for (const m of matches) {
    counts[m.tag] = (counts[m.tag] ?? 0) + 1;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
            tab === t.id
              ? t.premium
                ? 'bg-gold-gradient text-neutral-900'
                : 'bg-primary-gradient text-white shadow-sm'
              : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'
          }`}
        >
          <span>{t.emoji}</span>
          {t.label}
          {!t.premium && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.id ? 'bg-white/20' : 'bg-primary-50 text-primary-700'
            }`}>
              {counts[t.id] ?? 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
