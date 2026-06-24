'use client';

import { useEffect, useState } from 'react';
import { getAuthFromStorage } from '@/lib/auth';

interface BookmarkedProfile {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  isVerified: boolean;
  photo: string | null;
  savedAt: string;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError('Please log in to see your saved profiles.');
      return;
    }
    fetch('/api/bookmarks', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Failed to load bookmarks');
        setBookmarks(json.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load bookmarks'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (b: BookmarkedProfile) => {
    setBookmarks((prev) => prev.filter((x) => x.id !== b.id));
    if (!auth) return;
    try {
      await fetch(`/api/bookmarks?targetUserId=${b.userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
    } catch {
      // Optimistic removal stays even if the network call fails.
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto"><p className="text-sm text-neutral-400">Loading your saved profiles…</p></div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-neutral-400">
        <p className="font-medium text-neutral-600">{error}</p>
        {!auth && <a href="/login" className="text-sm mt-2 inline-block text-primary-700 font-semibold hover:underline">Go to login</a>}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Saved Profiles</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{bookmarks.length} profiles saved</p>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bookmarks.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                <img src={b.photo ?? undefined} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div className="absolute inset-0 bg-card-gradient" />
                <button onClick={() => remove(b)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors text-xs"
                  title="Remove bookmark">
                  🗑️
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1">
                    <h3 className="text-white font-bold text-sm">{b.name}{b.age ? `, ${b.age}` : ''}</h3>
                    {b.isVerified && <span className="text-blue-300 text-xs">✅</span>}
                  </div>
                  <p className="text-white/80 text-xs">{[b.profession, b.location].filter(Boolean).join(' · ')}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">Saved {timeAgo(b.savedAt)}</p>
                </div>
              </div>
              <div className="p-3 flex gap-2">
                <button className="flex-1 py-2 border border-primary-700 text-primary-700 rounded-xl text-xs font-semibold hover:bg-primary-50 transition-colors">
                  🤍 Send Interest
                </button>
                <button className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-16 text-center">
          <div className="text-5xl mb-3">🔖</div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">No Saved Profiles</h3>
          <p className="text-neutral-400 text-sm mb-5">Profiles you bookmark will appear here for easy access</p>
          <a href="/discover" className="inline-block px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">
            Discover Matches →
          </a>
        </div>
      )}
    </div>
  );
}
