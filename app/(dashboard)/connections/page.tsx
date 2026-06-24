'use client';

import { useEffect, useState } from 'react';
import { getAuthFromStorage } from '@/lib/auth';

const TABS = ['All', 'Accepted', 'Pending', 'Sent'];

interface Connection {
  id: string;
  userId: string;
  name: string;
  age: number | null;
  profession: string | null;
  location: string | null;
  status: 'Accepted' | 'Pending' | 'Sent';
  matchPercent: number;
  photo: string | null;
  connectedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  Accepted: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Sent: 'bg-blue-50 text-blue-700 border-blue-200',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuthFromStorage();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError('Please log in to see your connections.');
      return;
    }
    fetch('/api/connections', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error?.message || 'Failed to load connections');
        setConnections(json.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load connections'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptConnection = async (conn: Connection) => {
    if (!auth) return;
    setConnections((prev) => prev.map((c) => (c.id === conn.id ? { ...c, status: 'Accepted' } : c)));
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ targetUserId: conn.userId }),
      });
    } catch {
      // Optimistic state stays even if the network call fails.
    }
  };

  const declineConnection = (conn: Connection) => {
    setConnections((prev) => prev.filter((c) => c.id !== conn.id));
  };

  const filtered = connections.filter((c) => activeTab === 'All' || c.status === activeTab);

  if (loading) {
    return <div className="max-w-7xl mx-auto"><p className="text-sm text-neutral-400">Loading your connections…</p></div>;
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
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Connections</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your connection requests and accepted connections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total', count: connections.length, color: 'text-neutral-700', bg: 'bg-neutral-50' },
          { label: 'Accepted', count: connections.filter((c) => c.status === 'Accepted').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending', count: connections.filter((c) => c.status === 'Pending').length, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-vivaah-border`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${activeTab === tab ? 'bg-primary-gradient text-white shadow-sm' : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        {filtered.map((conn) => (
          <div key={conn.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary-100 flex-shrink-0">
              <img src={conn.photo ?? undefined} alt={conn.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-neutral-900">{conn.name}{conn.age ? `, ${conn.age}` : ''}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[conn.status]}`}>{conn.status}</span>
                {conn.matchPercent > 0 && <span className="text-xs font-bold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">{conn.matchPercent}% match</span>}
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">{[conn.profession, conn.location].filter(Boolean).join(' · ')}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{timeAgo(conn.connectedAt)}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {conn.status === 'Pending' && (
                <>
                  <button onClick={() => acceptConnection(conn)} className="px-3 py-1.5 bg-primary-gradient text-white rounded-lg text-xs font-semibold hover:opacity-90">Accept</button>
                  <button onClick={() => declineConnection(conn)} className="px-3 py-1.5 border border-red-300 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50">Decline</button>
                </>
              )}
              {conn.status === 'Accepted' && (
                <a href="/messages" className="px-3 py-1.5 bg-primary-gradient text-white rounded-lg text-xs font-semibold hover:opacity-90">💬 Message</a>
              )}
              {conn.status === 'Sent' && (
                <button className="px-3 py-1.5 border border-vivaah-border text-neutral-500 rounded-lg text-xs font-medium hover:bg-vivaah-bg">Pending...</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-vivaah-border p-16 text-center">
          <div className="text-5xl mb-3">🤝</div>
          <p className="font-medium text-neutral-600">No connections in this category</p>
        </div>
      )}
    </div>
  );
}
