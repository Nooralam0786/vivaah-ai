'use client';

import { Wallet, Clock } from 'lucide-react';

const EXAMPLE_PAYOUTS = [
  { id: 'PAY-001', partner: 'Refer & Earn – Rohit V.', amount: '₹499',    method: 'UPI',         status: 'Processed', date: '25 Jun 2026' },
  { id: 'PAY-002', partner: 'Affiliate – Blog Partner', amount: '₹2,400',  method: 'Bank Transfer', status: 'Pending',   date: '28 Jun 2026' },
  { id: 'PAY-003', partner: 'Refer & Earn – Neha G.',  amount: '₹999',    method: 'UPI',         status: 'Processed', date: '20 Jun 2026' },
  { id: 'PAY-004', partner: 'Influencer – TechReviews',amount: '₹5,000',  method: 'Bank Transfer', status: 'On Hold',   date: '29 Jun 2026' },
];

const STATUS_STYLE: Record<string, string> = {
  Processed: 'bg-emerald-50 text-emerald-600',
  Pending:   'bg-amber-50 text-amber-600',
  'On Hold': 'bg-red-50 text-red-500',
};

export default function PayoutsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage affiliate, referral, and partner payouts</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center">
          <Wallet size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#6B1B3D] to-[#9B2D5F] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={20} className="text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-bold text-sm tracking-wide uppercase">Coming Soon</span>
        </div>
        <h2 className="text-lg font-bold mb-1">Payout Management</h2>
        <p className="text-white/70 text-sm max-w-lg">
          Process affiliate commissions, referral bonuses, and partner payouts. Integrate with payment gateways for automated disbursements.
        </p>
      </div>

      {/* Example payout table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-60 pointer-events-none select-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Payout ID', 'Recipient / Partner', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EXAMPLE_PAYOUTS.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><p className="text-xs font-mono text-gray-500">{p.id}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-gray-800">{p.partner}</p></td>
                  <td className="px-4 py-3"><p className="text-sm font-bold text-[#6B1B3D]">{p.amount}</p></td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500">{p.method}</p></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3"><p className="text-xs text-gray-500">{p.date}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">Total pending: ₹7,400</p>
          <button className="text-xs text-[#6B1B3D] font-semibold">Process All →</button>
        </div>
      </div>

      <p className="text-xs text-gray-400">Example payout records shown above — payment gateway integration coming soon.</p>
    </div>
  );
}
