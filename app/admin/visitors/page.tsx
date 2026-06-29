'use client';

import { Eye, Clock } from 'lucide-react';

const EXAMPLE_VIEWS = [
  { viewer: 'Ananya Singh',  viewed: 'Karan Patel',    duration: '2m 34s', date: '29 Jun 2026 14:30' },
  { viewer: 'Rohit Verma',   viewed: 'Priya Sharma',   duration: '1m 12s', date: '29 Jun 2026 13:45' },
  { viewer: 'Neha Gupta',    viewed: 'Arjun Mehta',    duration: '4m 02s', date: '29 Jun 2026 12:20' },
  { viewer: 'Vikram Singh',  viewed: 'Divya Menon',    duration: '0m 58s', date: '28 Jun 2026 18:11' },
  { viewer: 'Pooja Reddy',   viewed: 'Siddharth Rao',  duration: '3m 15s', date: '28 Jun 2026 10:30' },
];

export default function VisitorsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Who Viewed Me</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track profile view records and visitor analytics</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
          <Eye size={18} className="text-purple-500" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Profile View Analytics</h2>
        <p className="text-white/70 text-sm max-w-lg">
          See who viewed which profiles, view durations, most viewed profiles, and profile visibility insights across the platform.
        </p>
      </div>

      {/* Example cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 pointer-events-none select-none">
        {EXAMPLE_VIEWS.map((v, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">{v.viewer[0]}</div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{v.viewer}</p>
                <p className="text-[10px] text-gray-400">viewed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-white text-sm font-bold">{v.viewed[0]}</div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{v.viewed}</p>
                <p className="text-[10px] text-gray-400">profile</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400">{v.duration}</span>
              </div>
              <span className="text-[10px] text-gray-400">{v.date}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">Example view records shown above — full visitor analytics coming soon.</p>
    </div>
  );
}
