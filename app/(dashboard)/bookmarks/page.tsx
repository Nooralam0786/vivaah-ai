'use client';

import { useState } from 'react';

const BOOKMARKS = [
  { id: 1, name: 'Ananya Singh', age: 27, profession: 'Product Manager', location: 'Delhi', matchPercent: 95, savedDate: '2 days ago', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', isVerified: true },
  { id: 2, name: 'Kavya Reddy', age: 26, profession: 'Software Engineer', location: 'Hyderabad', matchPercent: 94, savedDate: '3 days ago', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80', isVerified: true },
  { id: 3, name: 'Ishita Verma', age: 27, profession: 'Chartered Accountant', location: 'Pune', matchPercent: 88, savedDate: '5 days ago', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80', isVerified: true },
  { id: 4, name: 'Meera Joshi', age: 28, profession: 'Doctor', location: 'Pune', matchPercent: 92, savedDate: '1 week ago', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80', isVerified: false },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(BOOKMARKS);

  const remove = (id: number) => setBookmarks((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Saved Profiles</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{bookmarks.length} profiles saved</p>
        </div>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bookmarks.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                <img src={b.photo} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div className="absolute inset-0 bg-card-gradient" />
                <div className={`absolute top-2.5 left-2.5 text-white text-xs font-bold px-2.5 py-1 rounded-full ${b.matchPercent >= 90 ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {b.matchPercent}%
                </div>
                <button onClick={() => remove(b.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors text-xs"
                  title="Remove bookmark">
                  🗑️
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1">
                    <h3 className="text-white font-bold text-sm">{b.name}, {b.age}</h3>
                    {b.isVerified && <span className="text-blue-300 text-xs">✅</span>}
                  </div>
                  <p className="text-white/80 text-xs">{b.profession} · {b.location}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">Saved {b.savedDate}</p>
                </div>
              </div>
              <div className="p-3 flex gap-2">
                <button className="flex-1 py-2 border border-primary-700 text-primary-700 rounded-xl text-xs font-semibold hover:bg-primary-50 transition-colors">
                  🤍 Send Interest
                </button>
                <button className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-16 text-center">
          <div className="text-5xl mb-3">🔖</div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">No Saved Profiles</h3>
          <p className="text-neutral-400 text-sm mb-5">Profiles you bookmark will appear here for easy access</p>
          <a href="/discover" className="inline-block px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90">
            Discover Matches →
          </a>
        </div>
      )}
    </div>
  );
}
