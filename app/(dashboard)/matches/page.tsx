'use client';

import { useState } from 'react';

const TABS = [
  { id: 'new', label: 'New Matches', count: 12 },
  { id: 'compatible', label: 'Compatible', count: 8 },
  { id: 'mutual', label: 'Mutual Interest', count: 4 },
  { id: 'premium', label: 'Premium Matches', count: 20, premium: true },
];

const MATCHES = [
  { id: 1, name: 'Ananya Singh', age: 27, profession: 'Product Manager', location: 'Delhi', matchPercent: 95, isOnline: true, isVerified: true, tag: 'new', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', mutualInterests: ['Travel', 'Reading', 'Yoga'] },
  { id: 2, name: 'Neha Gupta', age: 26, profession: 'UX Designer', location: 'Bangalore', matchPercent: 92, isOnline: false, isVerified: true, tag: 'new', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80', mutualInterests: ['Music', 'Art'] },
  { id: 3, name: 'Pooja Sharma', age: 28, profession: 'Software Engineer', location: 'Mumbai', matchPercent: 90, isOnline: true, isVerified: true, tag: 'compatible', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80', mutualInterests: ['Coding', 'Movies'] },
  { id: 4, name: 'Ishita Verma', age: 27, profession: 'Chartered Accountant', location: 'Pune', matchPercent: 88, isOnline: false, isVerified: true, tag: 'compatible', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', mutualInterests: ['Finance', 'Cooking'] },
  { id: 5, name: 'Kavya Reddy', age: 26, profession: 'Software Engineer', location: 'Hyderabad', matchPercent: 94, isOnline: true, isVerified: true, tag: 'mutual', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80', mutualInterests: ['Tech', 'Yoga'] },
  { id: 6, name: 'Nisha Rao', age: 29, profession: 'Data Scientist', location: 'Bangalore', matchPercent: 85, isOnline: true, isVerified: true, tag: 'premium', photo: 'https://images.unsplash.com/photo-1535090333275-02e76c6777b0?w=300&q=80', mutualInterests: ['AI', 'Reading'] },
];

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = MATCHES.filter((m) => activeTab === 'premium' ? m.tag === 'premium' : activeTab === 'mutual' ? m.tag === 'mutual' : activeTab === 'compatible' ? m.tag === 'compatible' : m.tag === 'new');

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Your Matches</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Explore profiles that match your preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id
              ? (tab.premium ? 'bg-gold-gradient text-neutral-900' : 'bg-primary-gradient text-white shadow-sm')
              : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-primary-50 text-primary-700'}`}>
              {tab.count}
            </span>
            {tab.premium && <span className="text-xs">👑</span>}
          </button>
        ))}
      </div>

      {/* Premium lock for premium tab */}
      {activeTab === 'premium' && (
        <div className="bg-premium-gradient rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-2">👑</div>
          <h3 className="text-lg font-bold mb-1">Unlock Premium Matches</h3>
          <p className="text-white/70 text-sm mb-4">Get access to 20+ highly compatible premium profiles with advanced filters</p>
          <a href="/premium" className="inline-block px-6 py-2.5 bg-gold-gradient text-neutral-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
            Upgrade to Premium
          </a>
        </div>
      )}

      {/* Match Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
              <img src={match.photo} alt={match.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
              <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${match.matchPercent >= 90 ? 'bg-green-500' : 'bg-blue-500'}`}>
                {match.matchPercent}% Match
              </div>
              {match.isOnline && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-[10px]">Online</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-bold">{match.name}, {match.age}</h3>
                  {match.isVerified && <span className="text-blue-300 text-sm">✅</span>}
                </div>
                <p className="text-white/80 text-sm">{match.profession} · {match.location}</p>
              </div>
            </div>

            {/* Mutual Interests */}
            {match.mutualInterests.length > 0 && (
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs text-neutral-400 font-medium mb-1.5">💡 Mutual Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {match.mutualInterests.map((i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">{i}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 flex gap-2">
              <button onClick={() => toggleLike(match.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${liked.has(match.id) ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'}`}>
                {liked.has(match.id) ? '❤️ Interested' : '🤍 Send Interest'}
              </button>
              <button className="flex-1 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && activeTab !== 'premium' && (
        <div className="text-center py-16 text-neutral-400">
          <div className="text-5xl mb-3">💕</div>
          <p className="font-medium text-neutral-600">No matches in this category</p>
          <p className="text-sm mt-1">Check back soon for new recommendations</p>
        </div>
      )}
    </div>
  );
}
