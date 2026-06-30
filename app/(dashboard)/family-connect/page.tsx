'use client';

import { useState } from 'react';

const FAMILY_MEMBERS = [
  { id: 1, name: 'Rajesh Sharma', relation: 'Father', email: 'rajesh@example.com', status: 'Connected', avatar: '👨', access: ['View Profile', 'View Matches', 'Send Interests'] },
  { id: 2, name: 'Sunita Sharma', relation: 'Mother', email: 'sunita@example.com', status: 'Connected', avatar: '👩', access: ['View Profile', 'View Matches'] },
  { id: 3, name: 'Rahul Sharma', relation: 'Sibling', email: 'rahul@example.com', status: 'Pending Invite', avatar: '👦', access: ['View Profile'] },
  { id: 4, name: 'Priya Aunty', relation: 'Trusted Member', email: 'priya.aunty@example.com', status: 'Connected', avatar: '👩‍🦳', access: ['View Profile'] },
];

const STATUS_STYLES: Record<string, string> = {
  'Connected': 'bg-green-50 text-green-700 border-green-200',
  'Pending Invite': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function FamilyConnectPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', relation: '', message: '' });

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-neutral-900">Family Connect</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Involve your family in your matrimonial journey</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto flex-shrink-0">
          + Invite Member
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-100 rounded-2xl p-5 flex gap-4">
        <div className="text-3xl flex-shrink-0">👨‍👩‍👧‍👦</div>
        <div>
          <h3 className="font-semibold text-neutral-900">Why Family Connect?</h3>
          <p className="text-sm text-neutral-600 mt-1">Indian matrimony is a family affair. Invite your parents, siblings, or trusted members to review your matches, give feedback, and actively participate in your search.</p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {FAMILY_MEMBERS.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">{member.relation}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[member.status]}`}>{member.status}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-0.5 truncate">{member.email}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {member.access.map((a) => (
                    <span key={a} className="text-[11px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">✓ {a}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                <button className="flex-1 sm:flex-initial px-3 py-1.5 border border-vivaah-border text-neutral-600 rounded-lg text-xs hover:bg-vivaah-bg">Edit Access</button>
                <button className="flex-1 sm:flex-initial px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
          <div role="dialog" aria-modal="true" aria-label="Invite Family Member" className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Invite Family Member</h3>
              <button onClick={() => setShowInvite(false)} aria-label="Close dialog" className="text-neutral-400 hover:text-neutral-700 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                <input type="text" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Family member's name"
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
                <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="their@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Relation</label>
                <select value={inviteForm.relation} onChange={(e) => setInviteForm({ ...inviteForm, relation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700">
                  <option value="">Select relation</option>
                  <option>Father</option><option>Mother</option><option>Sibling</option><option>Trusted Member</option><option>Uncle/Aunt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Personal Message (Optional)</label>
                <textarea value={inviteForm.message} onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Add a personal note to your invitation..." rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-vivaah-border bg-vivaah-bg text-sm outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowInvite(false)}
                  className="flex-1 py-3 border border-vivaah-border rounded-xl text-sm text-neutral-600 hover:bg-vivaah-bg">Cancel</button>
                <button onClick={() => setShowInvite(false)}
                  className="flex-1 py-3 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
