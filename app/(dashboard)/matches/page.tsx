'use client';

import { useEffect, useState } from 'react';
import { getAuthFromStorage } from '@/lib/auth';

const TABS = [
  { id: 'new', label: 'New Matches' },
  { id: 'compatible', label: 'Compatible' },
  { id: 'mutual', label: 'Mutual Interest' },
  { id: 'premium', label: 'Premium Matches', premium: true },
];

interface MatchData {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  matchPercent: number;
  isOnline: boolean;
  isVerified: boolean;
  tag: string;
  photo: string | null;
  mutualInterests: string[];
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuthFromStorage();
    if (!auth) {
      setLoading(false);
      setError('Please log in to see your matches.');
      return;
    }

    fetch('/api/matches', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Failed to load matches');
        setMatches(json.data.matches);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load matches'))
      .finally(() => setLoading(false));
  }, []);

  const toggleLike = async (match: MatchData) => {
    const wasLiked = liked.has(match.id);
    setLiked((prev) => {
      const s = new Set(prev);
      wasLiked ? s.delete(match.id) : s.add(match.id);
      return s;
    });

    if (wasLiked) return; // un-liking is local-only; only "like" needs to be recorded
    const auth = getAuthFromStorage();
    if (!auth) return;

    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: match.userId }),
      });
    } catch {
      // Non-fatal — the optimistic UI state already reflects the user's intent.
    }
  };

  const counts = TABS.reduce<Record<string, number>>((acc, t) => {
    acc[t.id] = matches.filter((m) => m.tag === t.id).length;
    return acc;
  }, {});

  const filtered = matches.filter((m) => m.tag === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Your Matches</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Explore profiles that match your preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id
              ? (tab.premium ? 'bg-gold-gradient text-neutral-900' : 'bg-primary-gradient text-white shadow-sm')
              : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-primary-50 text-primary-700'}`}>
              {counts[tab.id] ?? 0}
            </span>
            {tab.premium && <span className="text-xs">👑</span>}
          </button>
        ))}
      </div>

      {/* Premium lock for premium tab */}
      {activeTab === 'premium' && (
        <div className="bg-premium-gradient rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-2">👑</div>
          <h3 className="text-lg font-bold mb-1">Unlock Premium Matches</h3>
          <p className="text-white/70 text-sm mb-4">Get access to highly compatible premium profiles with advanced filters</p>
          <a href="/premium-benefits" className="inline-block px-6 py-2.5 bg-gold-gradient text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
            Upgrade to Premium
          </a>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-sm">Loading your matches…</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-medium text-neutral-600">{error}</p>
          {!getAuthFromStorage() && (
            <a href="/login" className="text-sm mt-2 inline-block text-primary-700 font-semibold hover:underline">Go to login</a>
          )}
        </div>
      )}

      {/* Match Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                <img src={match.photo ?? undefined} alt={match.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${match.matchPercent >= 90 ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {match.matchPercent}% Match
                </div>
                {match.isOnline && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-[10px]">Online</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white font-bold">{match.name}{match.age ? `, ${match.age}` : ''}</h3>
                    {match.isVerified && <span className="text-blue-300 text-sm">✅</span>}
                  </div>
                  <p className="text-white/80 text-sm">{[match.profession, match.location].filter(Boolean).join(' · ')}</p>
                </div>
              </div>

              {/* Mutual Interests */}
              {match.mutualInterests.length > 0 && (
                <div className="px-4 pt-3 pb-1">
                  <p className="text-xs text-neutral-400 font-medium mb-1.5">💡 Mutual Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.mutualInterests.map((i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">{i}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 flex gap-2">
                <button onClick={() => toggleLike(match)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${liked.has(match.id) ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'}`}>
                  {liked.has(match.id) ? '❤️ Interested' : '🤍 Send Interest'}
                </button>
                <button className="flex-1 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && activeTab !== 'premium' && (
        <div className="text-center py-16 text-neutral-400">
          <div className="text-5xl mb-3">💕</div>
          <p className="font-medium text-neutral-600">No matches in this category</p>
          <p className="text-sm mt-1">Check back soon for new recommendations</p>
        </div>
      )}
    </div>
  );
}
