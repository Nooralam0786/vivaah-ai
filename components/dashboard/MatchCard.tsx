'use client';

import { useState } from 'react';

interface Match {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  religion: string;
  caste: string;
  height: string;
  matchPercent: number;
  isOnline: boolean;
  isVerified: boolean;
  photo?: string;
  tags: string[];
}

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
];

function getMatchColor(pct: number) {
  if (pct >= 90) return 'bg-green-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}

export default function MatchCard({ match, index }: { match: Match; index: number }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const photo = match.photo || PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length];

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex-shrink-0 w-56 md:w-auto">
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
        {!imgError ? (
          <img src={photo} alt={match.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl">👤</div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-card-gradient" />

        {/* Match % Badge */}
        <div className={`absolute top-2.5 left-2.5 ${getMatchColor(match.matchPercent)} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
          {match.matchPercent}% Match
        </div>

        {/* Online Indicator */}
        {match.isOnline && (
          <div className="absolute top-2.5 right-10 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-[10px] font-medium">Online</span>
          </div>
        )}

        {/* Bookmark Button */}
        <button onClick={() => setBookmarked(!bookmarked)}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          {bookmarked ? '🔖' : '🏷️'}
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-white font-bold text-sm leading-tight">{match.name}, {match.age}</h3>
            {match.isVerified && <span className="text-blue-400 text-xs">✅</span>}
          </div>
          <p className="text-white/80 text-xs">{match.profession}</p>
          <p className="text-white/60 text-[10px]">📍 {match.location}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="px-3 py-2 flex flex-wrap gap-1">
        {match.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-medium">{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button onClick={() => setLiked(!liked)}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${liked ? 'bg-primary-700 text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'}`}>
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>
        <button className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
          View Profile
        </button>
      </div>
    </div>
  );
}

const MOCK_MATCHES: Match[] = [
  { id: '1', name: 'Ananya Singh', age: 27, profession: 'Product Manager', location: 'Delhi, India', religion: 'Hindu', caste: 'Kayastha', height: "5'5\"", matchPercent: 95, isOnline: true, isVerified: true, tags: ['Hindu', 'Kayastha', "5'5\""] },
  { id: '2', name: 'Neha Gupta', age: 26, profession: 'UX Designer', location: 'Bangalore, India', religion: 'Hindu', caste: 'Bania', height: "5'4\"", matchPercent: 92, isOnline: false, isVerified: true, tags: ['Hindu', 'Bania', "5'4\""] },
  { id: '3', name: 'Pooja Sharma', age: 28, profession: 'Software Engineer', location: 'Mumbai, India', religion: 'Hindu', caste: 'Brahmin', height: "5'5\"", matchPercent: 90, isOnline: true, isVerified: true, tags: ['Hindu', 'Brahmin', "5'5\""] },
  { id: '4', name: 'Ishita Verma', age: 27, profession: 'Chartered Accountant', location: 'Pune, India', religion: 'Hindu', caste: 'Agarwal', height: "5'5\"", matchPercent: 88, isOnline: false, isVerified: true, tags: ['Hindu', 'Agarwal', "5'5\""] },
];

export function AIRecommendedMatches() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">AI Recommended Matches</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Based on your preferences and compatibility</p>
        </div>
        <a href="/matches" className="text-sm font-semibold text-primary-700 hover:text-secondary-500 transition-colors">See all →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto">
        {MOCK_MATCHES.map((match, i) => (
          <MatchCard key={match.id} match={match} index={i} />
        ))}
      </div>
      <div className="mt-4 text-center">
        <a href="/matches"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary-700 text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors">
          View More Matches →
        </a>
      </div>
    </div>
  );
}
