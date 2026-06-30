'use client';

import { RotateCcw, Clock } from 'lucide-react';

const EXAMPLE_REFUNDS = [
  { id: 'REF-001', user: 'Rohit Verma',  plan: 'Gold',     amount: '₹499',   reason: 'Duplicate payment',        status: 'Approved', date: '27 Jun 2026' },
  { id: 'REF-002', user: 'Neha Gupta',   plan: 'Platinum', amount: '₹999',   reason: 'Accidental upgrade',       status: 'Pending',  date: '29 Jun 2026' },
  { id: 'REF-003', user: 'Arjun Mehta',  plan: 'Diamond',  amount: '₹1,499', reason: 'Service not as described', status: 'Rejected', date: '20 Jun 2026' },
  { id: 'REF-004', user: 'Pooja Reddy',  plan: 'Gold',     amount: '₹499',   reason: 'Account closure',          status: 'Pending',  date: '28 Jun 2026' },
];

const STATUS_STYLE: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-600',
  Pending:  'bg-amber-50 text-amber-600',
  Rejected: 'bg-red-50 text-red-500',
};

export default function RefundsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Refund Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and process user refund requests</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
          <RotateCcw size={18} className="text-orange-500" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Refund Request Management</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Review refund requests, verify payment details, approve or reject refunds, and trigger automatic refund processing through the payment gateway.
        </p>
      </div>

      {/* Example table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Request ID', 'User', 'Plan', 'Amount', 'Reason', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EXAMPLE_REFUNDS.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-mono text-gray-500">{r.id}</p></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-[10px] font-bold">{r.user[0]}</div>
                      <span className="text-sm font-semibold text-gray-800">{r.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-600">{r.plan}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-bold text-[#6B1B3D]">{r.amount}</p></td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500 max-w-36 truncate">{r.reason}</p></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500">{r.date}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">2 pending refunds · Total value: ₹1,498</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">Example refund requests shown above — payment gateway refund processing coming soon.</p>
    </div>
  );
}
