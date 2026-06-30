'use client';

import { Shield, Crown, Mail, Clock } from 'lucide-react';

interface AdminEntry {
  name: string;
  email: string;
  role: string;
  since: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

const ADMINS: AdminEntry[] = [
  {
    name:      'Arun (Super Admin)',
    email:     'arun@techotd.com',
    role:      'Super Admin',
    since:     '01 Jan 2024',
    lastLogin: '29 Jun 2026, 09:00 AM',
    status:    'Active',
  },
];

export default function AdminsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage who has access to the admin panel</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#6B1B3D]/10 border border-[#6B1B3D]/20 flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-[#6B1B3D]" />
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shield size={15} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">Admin Access is Tightly Controlled</p>
          <p className="text-xs text-amber-600 mt-0.5">Only Super Admins can add new admin accounts. New admins must have an existing VivaahAI account with the <code className="bg-amber-100 px-1 rounded text-[10px]">role: admin</code> field set in the database.</p>
        </div>
      </div>

      {/* Current Admins */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Current Admins</h3>
            <p className="text-xs text-gray-400 mt-0.5">{ADMINS.length} admin account{ADMINS.length !== 1 ? 's' : ''}</p>
          </div>
          <button disabled className="px-3 py-1.5 bg-[#6B1B3D]/50 text-white rounded-xl text-xs font-semibold cursor-not-allowed">
            + Invite Admin
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {ADMINS.map((a, i) => (
            <div key={i} className="flex items-start sm:items-center gap-4 px-5 py-5 flex-wrap">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center flex-shrink-0">
                <Crown size={22} className="text-[#D4AF37]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">{a.name}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6B1B3D]/10 text-[#6B1B3D] rounded-full text-[10px] font-bold">
                    <Crown size={9} /> {a.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Mail size={11} className="text-gray-400" />
                  <p className="text-xs text-gray-500">{a.email}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Shield size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">Admin since {a.since}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">Last login: {a.lastLogin}</span>
                  </div>
                </div>
              </div>

              {/* Permissions badge */}
              <div className="hidden md:flex flex-col gap-1 flex-shrink-0">
                {['All Users', 'All Settings', 'Finance', 'Content'].map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 bg-[#6B1B3D]/5 text-[#6B1B3D] rounded-full font-medium text-center">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles Description */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Available Admin Roles</h3>
        <div className="space-y-3">
          {[
            { role: 'Super Admin', desc: 'Full access to all features, settings, and admin management. Only assigned to core team members.', color: 'text-[#6B1B3D] bg-[#6B1B3D]/10' },
            { role: 'Content Manager', desc: 'Can manage blog posts, success stories, banners, and testimonials. No access to financial or user data.', color: 'text-blue-600 bg-blue-50' },
            { role: 'Support Agent', desc: 'Can view user profiles and handle reports. Cannot modify plans, settings, or financial records.', color: 'text-emerald-600 bg-emerald-50' },
          ].map((r) => (
            <div key={r.role} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${r.color}`}>{r.role}</span>
              <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Role-based access control (RBAC) will be fully configurable once the permissions backend is deployed.</p>
      </div>
    </div>
  );
}
