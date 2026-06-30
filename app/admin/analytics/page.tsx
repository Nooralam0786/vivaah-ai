'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Heart, ShieldCheck, Crown } from 'lucide-react';
import type { Stats } from '../_components/dashboardTypes';

const TIER_COLORS: Record<string, string> = {
  free:     '#9ca3af',
  gold:     '#D4AF37',
  platinum: '#3b82f6',
  diamond:  '#6B1B3D',
};

const GENDER_COLORS = ['#6B1B3D', '#D4AF37', '#9ca3af'];

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function StatBadge({ label, value, Icon, color }: { label: string; value: string | number; Icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center`} style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
      </div>
    </div>
  );
}

const token = () => JSON.parse(localStorage.getItem('vivaah_auth') ?? '{}')?.accessToken ?? '';

export default function AnalyticsPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((j) => { if (j.success) setStats(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#6B1B3D]/30 border-t-[#6B1B3D] rounded-full animate-spin" />
    </div>
  );

  const kpis   = stats?.kpis;
  const charts = stats?.charts;

  const genderData = (charts?.genderBreakdown ?? []).map((g) => ({
    name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: g.count,
  }));
  const tierData = (charts?.tierBreakdown ?? []).map((t) => ({
    name: t.tier.charAt(0).toUpperCase() + t.tier.slice(1),
    value: t.count,
    color: TIER_COLORS[t.tier] ?? '#9ca3af',
  }));

  const totalUsers = genderData.reduce((s, g) => s + g.value, 0) || kpis?.totalUsers || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics and insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBadge label="Total Users"       value={kpis?.totalUsers       ?? '—'} Icon={Users}      color="#6B1B3D" />
        <StatBadge label="Total Matches"     value={kpis?.totalMatches     ?? '—'} Icon={Heart}      color="#f43f5e" />
        <StatBadge label="Verified Profiles" value={kpis?.pendingVerifications ?? '—'} Icon={ShieldCheck} color="#10b981" />
        <StatBadge label="Paid Members"      value={kpis?.totalSubscriptions ?? '—'} Icon={Crown}      color="#D4AF37" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Registration chart */}
        <Card title="New Registrations (Last 30 Days)" subtitle="Daily user sign-up trend">
          {mounted && (charts?.registrations?.length ?? 0) > 0 ? (
            <div className="h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts!.registrations} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6B1B3D" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#6B1B3D" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" name="Registrations" stroke="#6B1B3D" fill="url(#regGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-52 animate-pulse bg-gray-100 rounded-xl" />}
        </Card>

        {/* Daily Likes chart */}
        <Card title="Daily Likes / Interest Sent" subtitle="Platform engagement activity">
          {mounted && (charts?.dailyLikes?.length ?? 0) > 0 ? (
            <div className="h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts!.dailyLikes} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" name="Likes" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-52 animate-pulse bg-gray-100 rounded-xl" />}
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gender breakdown */}
        <Card title="Gender Breakdown">
          {mounted && genderData.length > 0 ? (
            <div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3}>
                      {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg font-extrabold text-gray-900">{totalUsers.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400">Total</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {genderData.map((g, i) => (
                  <div key={g.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: GENDER_COLORS[i] }} />
                      <span className="text-gray-600">{g.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {totalUsers > 0 ? `${((g.value / totalUsers) * 100).toFixed(1)}%` : '—'}
                      <span className="text-gray-400 font-normal ml-1">({g.value.toLocaleString('en-IN')})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="h-44 animate-pulse bg-gray-100 rounded-xl" />}
        </Card>

        {/* Tier Breakdown */}
        <Card title="Subscription Tier Breakdown" subtitle="Users per plan">
          <div className="space-y-3 mt-2">
            {tierData.length > 0 ? tierData.map((t) => {
              const total = tierData.reduce((s, x) => s + x.value, 0) || 1;
              const pct = Math.round((t.value / total) * 100);
              return (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">{t.name}</span>
                    <span className="text-gray-400">{t.value.toLocaleString('en-IN')} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: t.color }} />
                  </div>
                </div>
              );
            }) : (
              <div className="space-y-3">
                {['Free', 'Gold', 'Platinum', 'Diamond'].map((n) => (
                  <div key={n} className="h-8 animate-pulse bg-gray-100 rounded-xl" />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Verification breakdown */}
        <Card title="Verification Status">
          <div className="space-y-3 mt-2">
            {(charts?.verificationBreakdown ?? []).length > 0 ? charts!.verificationBreakdown.map((v) => (
              <div key={v.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{v.label}</p>
                  <p className="text-[10px] text-gray-400">{v.count.toLocaleString('en-IN')} records</p>
                </div>
                <span className="text-sm font-extrabold text-[#6B1B3D]">{v.count}</span>
              </div>
            )) : (
              <div className="space-y-2">
                {['Verified', 'Pending', 'Rejected'].map((n) => (
                  <div key={n} className="h-14 animate-pulse bg-gray-100 rounded-xl" />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Summary stats */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Platform Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'New Users (7d)',      value: kpis?.newUsers7d      ?? '—' },
            { label: 'Active Users',         value: kpis?.activeUsers     ?? '—' },
            { label: 'Mutual Matches',       value: kpis?.mutualMatches   ?? '—' },
            { label: 'Total Likes',          value: kpis?.totalLikes      ?? '—' },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xl font-extrabold text-[#6B1B3D]">{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <TrendingUp size={13} />
        <span>Data refreshed live from the platform database</span>
      </div>
    </div>
  );
}
