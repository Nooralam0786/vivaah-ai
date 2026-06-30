'use client';

import { useEffect, useState } from 'react';
import { Heart, Clock, Users } from 'lucide-react';

const EXAMPLE_MATCHES = [
  { user1: 'Ananya Singh',   user2: 'Rohit Verma',    compatibility: 94, status: 'Active',    date: '29 Jun 2026' },
  { user1: 'Pooja Sharma',   user2: 'Arjun Mehta',    compatibility: 88, status: 'In Chat',   date: '28 Jun 2026' },
  { user1: 'Kavitha Nair',   user2: 'Siddharth Rao',  compatibility: 91, status: 'Active',    date: '27 Jun 2026' },
  { user1: 'Meera Kapoor',   user2: 'Vikram Singh',   compatibility: 85, status: 'Pending',   date: '27 Jun 2026' },
];

const token = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

export default function MatchesPage() {
  const [totalMatches, setTotalMatches] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((j) => { if (j.success) setTotalMatches(j.data?.kpis?.totalMatches ?? null); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Matches</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered compatibility matches between users</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
          <Heart size={18} className="text-rose-500" />
        </div>
      </div>

      {/* Stat */}
      {totalMatches !== null && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 w-full sm:max-w-xs">
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
            <Heart size={20} className="text-rose-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Total Matches</p>
            <p className="text-2xl font-extrabold text-gray-900">{totalMatches.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Full Match Management Dashboard</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Browse all matches, filter by compatibility score, status, and date range. View conversation history, send admin notifications, and manage match quality.
        </p>
      </div>

      {/* Example cards (grayed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLE_MATCHES.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 opacity-60 pointer-events-none select-none">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-xs font-bold">{m.user1[0]}</div>
                <Heart size={14} className="text-rose-400" fill="currentColor" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-white text-xs font-bold">{m.user2[0]}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : m.status === 'In Chat' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                {m.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{m.user1} &amp; {m.user2}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${m.compatibility}%` }} />
                </div>
                <span className="text-xs text-gray-500">{m.compatibility}% match</span>
              </div>
              <span className="text-[10px] text-gray-400">{m.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Users size={13} />
        <span>Example data shown above — real match management interface launching soon</span>
      </div>
    </div>
  );
}
