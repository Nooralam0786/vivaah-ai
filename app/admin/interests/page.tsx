'use client';

import { Zap, Clock } from 'lucide-react';

const EXAMPLE_INTERESTS = [
  { from: 'Ananya Singh',  to: 'Karan Patel',    status: 'Accepted', date: '29 Jun 2026', time: '14:32' },
  { from: 'Rohit Verma',   to: 'Priya Sharma',   status: 'Pending',  date: '29 Jun 2026', time: '13:15' },
  { from: 'Neha Gupta',    to: 'Arjun Mehta',    status: 'Accepted', date: '28 Jun 2026', time: '18:44' },
  { from: 'Vikram Singh',  to: 'Meera Kapoor',   status: 'Declined', date: '28 Jun 2026', time: '11:22' },
  { from: 'Divya Menon',   to: 'Siddharth Rao',  status: 'Pending',  date: '27 Jun 2026', time: '09:05' },
];

const STATUS_STYLE: Record<string, string> = {
  Accepted: 'bg-emerald-50 text-emerald-600',
  Pending:  'bg-amber-50 text-amber-600',
  Declined: 'bg-red-50 text-red-500',
};

export default function InterestsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Interest Received</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track likes and interest expressions between users</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-amber-500" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Interest & Like Records</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Full admin view of all interest expressions, likes sent and received, acceptance rates, and engagement analytics across the platform.
        </p>
      </div>

      {/* Example table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['From User', 'To User', 'Status', 'Date', 'Time'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EXAMPLE_INTERESTS.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-[10px] font-bold">{r.from[0]}</div>
                      <span className="text-sm font-semibold text-gray-800">{r.from}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">{r.to[0]}</div>
                      <span className="text-sm text-gray-700">{r.to}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500">{r.date}</p></td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-400">{r.time}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">Example interest records shown above — real data will populate once the Interest API is wired up.</p>
    </div>
  );
}
