'use client';

import { useState } from 'react';

const TABS = ['All', 'Accepted', 'Pending', 'Sent'];

const CONNECTIONS = [
  { id: 1, name: 'Ananya Singh', age: 27, profession: 'Product Manager', location: 'Delhi', status: 'Accepted', matchPercent: 95, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', connectedDate: '3 days ago' },
  { id: 2, name: 'Priya Mehta', age: 26, profession: 'UX Designer', location: 'Bangalore', status: 'Pending', matchPercent: 90, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', connectedDate: '1 day ago' },
  { id: 3, name: 'Kavya Reddy', age: 25, profession: 'Software Engineer', location: 'Hyderabad', status: 'Sent', matchPercent: 88, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', connectedDate: '2 days ago' },
  { id: 4, name: 'Nisha Rao', age: 29, profession: 'Data Scientist', location: 'Mumbai', status: 'Accepted', matchPercent: 92, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', connectedDate: '1 week ago' },
];

const STATUS_STYLES: Record<string, string> = {
  Accepted: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Sent: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = CONNECTIONS.filter((c) => activeTab === 'All' || c.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Connections</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your connection requests and accepted connections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', count: CONNECTIONS.length, color: 'text-neutral-700', bg: 'bg-neutral-50' },
          { label: 'Accepted', count: CONNECTIONS.filter((c) => c.status === 'Accepted').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending', count: CONNECTIONS.filter((c) => c.status === 'Pending').length, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border border-vivaah-border`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-neutral-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-primary-gradient text-white shadow-sm' : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        {filtered.map((conn) => (
          <div key={conn.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary-100 flex-shrink-0">
              <img src={conn.photo} alt={conn.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-neutral-900">{conn.name}, {conn.age}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[conn.status]}`}>{conn.status}</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">{conn.matchPercent}% match</span>
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">{conn.profession} · {conn.location}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{conn.connectedDate}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {conn.status === 'Pending' && (
                <>
                  <button className="px-3 py-1.5 bg-primary-gradient text-white rounded-lg text-xs font-semibold hover:opacity-90">Accept</button>
                  <button className="px-3 py-1.5 border border-red-300 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50">Decline</button>
                </>
              )}
              {conn.status === 'Accepted' && (
                <a href="/messages" className="px-3 py-1.5 bg-primary-gradient text-white rounded-lg text-xs font-semibold hover:opacity-90">💬 Message</a>
              )}
              {conn.status === 'Sent' && (
                <button className="px-3 py-1.5 border border-vivaah-border text-neutral-500 rounded-lg text-xs font-medium hover:bg-vivaah-bg">Pending...</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-vivaah-border p-16 text-center">
          <div className="text-5xl mb-3">🤝</div>
          <p className="font-medium text-neutral-600">No connections in this category</p>
        </div>
      )}
    </div>
  );
}
