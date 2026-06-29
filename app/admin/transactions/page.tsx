'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Crown } from 'lucide-react';

interface TierRow {
  tier: string;
  count: number;
  pct: number;
}

const TIER_META: Record<string, { label: string; color: string; bg: string; price: string; desc: string }> = {
  free:     { label: 'Free',     color: 'text-gray-500',   bg: 'bg-gray-100',   price: '₹0',      desc: 'Basic access, limited likes' },
  gold:     { label: 'Gold',     color: 'text-amber-600',  bg: 'bg-amber-50',   price: '₹499/mo', desc: 'Unlimited likes, chat' },
  platinum: { label: 'Platinum', color: 'text-blue-600',   bg: 'bg-blue-50',    price: '₹999/mo', desc: 'AI matching, verified badge' },
  diamond:  { label: 'Diamond',  color: 'text-[#6B1B3D]',  bg: 'bg-rose-50',    price: '₹1,499/mo',desc: 'Priority support, all features' },
};

const token = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

export default function TransactionsPage() {
  const [rows,    setRows]    = useState<TierRow[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data?.charts?.tierBreakdown) {
          const breakdown: { tier: string; count: number }[] = j.data.charts.tierBreakdown;
          const sum = breakdown.reduce((s, t) => s + t.count, 0) || 1;
          setTotal(j.data.kpis?.totalUsers ?? sum);
          setRows(breakdown.map((t) => ({ tier: t.tier, count: t.count, pct: Math.round((t.count / sum) * 100) })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const paidCount   = rows.filter((r) => r.tier !== 'free').reduce((s, r) => s + r.count, 0);
  const estRevenue  = rows.reduce((s, r) => {
    const prices: Record<string, number> = { gold: 499, platinum: 999, diamond: 1499, free: 0 };
    return s + r.count * (prices[r.tier] ?? 0);
  }, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Subscription tier breakdown and revenue overview</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center">
          <CreditCard size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Users',    value: total.toLocaleString('en-IN'),       sub: 'All registered users'     },
          { label: 'Paid Members',   value: paidCount.toLocaleString('en-IN'),   sub: 'On any paid subscription' },
          { label: 'Est. MRR',       value: `₹${estRevenue.toLocaleString('en-IN')}`, sub: 'Monthly recurring revenue' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{c.label}</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Tier Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-bold text-gray-800">Subscription Tier Breakdown</h3>
          <p className="text-xs text-gray-400 mt-0.5">Users grouped by active plan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Plan', 'Description', 'Price', 'Users', 'Share', 'Distribution'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse w-24" /></td>
                      ))}
                    </tr>
                  ))
                : rows.map((r) => {
                    const meta = TIER_META[r.tier] ?? TIER_META.free;
                    return (
                      <tr key={r.tier} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center`}>
                              <Crown size={13} className={meta.color} />
                            </div>
                            <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><p className="text-xs text-gray-500">{meta.desc}</p></td>
                        <td className="px-4 py-3"><p className="text-xs font-semibold text-gray-700">{meta.price}</p></td>
                        <td className="px-4 py-3"><p className="text-sm font-bold text-gray-800">{r.count.toLocaleString('en-IN')}</p></td>
                        <td className="px-4 py-3"><p className="text-xs text-gray-500">{r.pct}%</p></td>
                        <td className="px-4 py-3 min-w-36">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, background: meta.color.includes('[') ? '#6B1B3D' : undefined, backgroundColor: meta.color.includes('amber') ? '#D4AF37' : meta.color.includes('blue') ? '#3b82f6' : meta.color.includes('gray') ? '#9ca3af' : '#6B1B3D' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No subscription data available</div>
        )}
      </div>

      <p className="text-xs text-gray-400">* Estimated MRR based on current subscription counts × plan prices. Actual revenue may differ due to annual plans, discounts, and refunds.</p>
    </div>
  );
}
