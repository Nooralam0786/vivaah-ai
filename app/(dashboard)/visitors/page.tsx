'use client';

import { useState } from 'react';

const VISITORS = [
  { id: 1, name: 'Kavya Reddy', age: 26, profession: 'Software Engineer', location: 'Hyderabad', time: '2 hours ago', matchPercent: 94, isVerified: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 2, name: 'Priya Sharma', age: 29, profession: 'Doctor', location: 'Chennai', time: '5 hours ago', matchPercent: 88, isVerified: true, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { id: 3, name: 'Meera Joshi', age: 27, profession: 'Marketing Lead', location: 'Mumbai', time: '1 day ago', matchPercent: 82, isVerified: false, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 4, name: 'Nisha Rao', age: 28, profession: 'Data Scientist', location: 'Bangalore', time: '2 days ago', matchPercent: 90, isVerified: true, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { id: 5, name: 'Shruti Kapoor', age: 25, profession: 'Lawyer', location: 'Delhi', time: '3 days ago', matchPercent: 86, isVerified: true, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80' },
  { id: 6, name: 'Premium Member', age: 27, profession: 'Unlock to view', location: '???', time: '1 day ago', matchPercent: 95, isVerified: true, photo: '', isPremium: true },
];

export default function VisitorsPage() {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Profile Visitors</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{VISITORS.length} people viewed your profile recently</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <span>🔥</span>
          <span className="text-sm font-semibold text-amber-700">15 views today</span>
        </div>
      </div>

      {/* Premium Prompt */}
      <div className="bg-premium-gradient rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <span>👑</span>
            <span className="font-bold">Unlock All Visitors</span>
          </div>
          <p className="text-white/70 text-sm">Upgrade to Premium to see who viewed your profile in the last 30 days</p>
        </div>
        <a href="/premium" className="px-5 py-2.5 bg-gold-gradient text-neutral-900 font-bold rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
          Upgrade Now
        </a>
      </div>

      {/* Visitors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VISITORS.map((visitor) => (
          <div key={visitor.id} className={`bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden transition-all hover:shadow-card-hover ${(visitor as any).isPremium ? 'relative' : ''}`}>
            {(visitor as any).isPremium && (
              <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/50 flex flex-col items-center justify-center gap-3 rounded-2xl">
                <span className="text-4xl">👑</span>
                <p className="text-sm font-semibold text-neutral-700">Premium Feature</p>
                <a href="/premium" className="px-4 py-2 bg-gold-gradient text-neutral-900 font-bold rounded-xl text-xs">Unlock Profile</a>
              </div>
            )}
            <div className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-100 flex-shrink-0">
                {visitor.photo ? (
                  <img src={visitor.photo} alt={visitor.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-neutral-900 text-sm truncate">{visitor.name}</h3>
                  {visitor.isVerified && <span className="text-blue-500 text-xs">✅</span>}
                </div>
                <p className="text-xs text-neutral-500 truncate">{visitor.profession}, {visitor.age}</p>
                <p className="text-xs text-neutral-400">📍 {visitor.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${visitor.matchPercent >= 90 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {visitor.matchPercent}% match
                  </span>
                  <span className="text-[10px] text-neutral-400">{visitor.time}</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={() => setLiked((s) => { const n = new Set(s); n.has(visitor.id) ? n.delete(visitor.id) : n.add(visitor.id); return n; })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${liked.has(visitor.id) ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'}`}>
                {liked.has(visitor.id) ? '❤️ Liked' : '🤍 Like Back'}
              </button>
              <button className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
