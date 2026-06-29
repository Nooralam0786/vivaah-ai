'use client';

import { useEffect, useState } from 'react';
import { Crown, TrendingUp, Users, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TierStat { tier: string; label: string; count: number; revenue: number; color: string }

const TIER_LABEL: Record<string, string> = { free: 'Free', gold: 'Gold', platinum: 'Platinum', diamond: 'Diamond' };
const TIER_PRICE: Record<string, number> = { free: 0, gold: 499, platinum: 999, diamond: 2499 };
const TIER_COLOR: Record<string, string> = { free: '#9ca3af', gold: '#D4AF37', platinum: '#3b82f6', diamond: '#6B1B3D' };

function StatCard({ title, value, subtitle, Icon, color }: { title: string; value: string | number; subtitle?: string; Icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function LightTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-gray-600">{p.name}: <span className="font-bold">{p.value.toLocaleString('en-IN')}</span></p>
      ))}
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  const [tiers,   setTiers]   = useState<TierStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const token = (() => { try { return JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken; } catch { return null; } })();
    if (!token) { setLoading(false); return; }
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        const tierMap: Record<string, number> = {};
        j.data.charts.tierBreakdown.forEach((t: { tier: string; count: number }) => { tierMap[t.tier] = t.count; });
        setTiers(['free', 'gold', 'platinum', 'diamond'].map((tier) => ({
          tier,
          label:   TIER_LABEL[tier] ?? tier,
          count:   tierMap[tier] ?? 0,
          revenue: (tierMap[tier] ?? 0) * (TIER_PRICE[tier] ?? 0),
          color:   TIER_COLOR[tier] ?? '#9ca3af',
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPaid    = tiers.filter((t) => t.tier !== 'free').reduce((s, t) => s + t.count,   0);
  const totalRevenue = tiers.reduce((s, t) => s + t.revenue, 0);
  const totalUsers   = tiers.reduce((s, t) => s + t.count,   0);
  const convRate     = totalUsers > 0 ? ((totalPaid / totalUsers) * 100).toFixed(1) : '0.0';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#6B1B3D]/30 border-t-[#6B1B3D] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-xl font-bold text-gray-900">Plans & Pricing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Subscription analytics and revenue breakdown</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"    value={`₹${totalRevenue.toLocaleString('en-IN')}`} subtitle="Estimated MRR" Icon={TrendingUp} color="bg-[#6B1B3D]"  />
        <StatCard title="Paid Subscribers" value={totalPaid}  subtitle={`${convRate}% conversion`}                      Icon={Crown}      color="bg-amber-500" />
        <StatCard title="Total Users"      value={totalUsers}                                                            Icon={Users}      color="bg-blue-500"  />
        <StatCard title="Avg Rev / User"   value={totalUsers > 0 ? `₹${Math.round(totalRevenue / totalUsers).toLocaleString('en-IN')}` : '₹0'} subtitle="ARPU" Icon={CreditCard} color="bg-emerald-500" />
      </div>

      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Users by Plan</h3>
            <p className="text-xs text-gray-400 mb-4">Distribution across all tiers</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tiers} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<LightTooltip />} />
                <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]}>
                  {tiers.map((t) => <Cell key={t.tier} fill={t.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Revenue by Plan</h3>
            <p className="text-xs text-gray-400 mb-4">Estimated monthly revenue per tier</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tiers.filter((t) => t.tier !== 'free')} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<LightTooltip />} />
                <Bar dataKey="revenue" name="Revenue (₹)" radius={[6, 6, 0, 0]}>
                  {tiers.filter((t) => t.tier !== 'free').map((t) => <Cell key={t.tier} fill={t.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-800">Plan Details</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Plan', 'Price/mo', 'Subscribers', 'Monthly Revenue', 'Share'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tiers.map((t) => {
              const share = totalUsers > 0 ? ((t.count / totalUsers) * 100).toFixed(1) : '0.0';
              return (
                <tr key={t.tier} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                      <span className="text-sm font-semibold text-gray-800">{t.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {TIER_PRICE[t.tier] === 0 ? <span className="text-gray-400">Free</span> : `₹${TIER_PRICE[t.tier]?.toLocaleString('en-IN')}`}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">{t.count.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                    {t.revenue > 0 ? `₹${t.revenue.toLocaleString('en-IN')}` : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${share}%`, background: t.color }} />
                      </div>
                      <span className="text-xs text-gray-500">{share}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
