'use client';

import { useState } from 'react';
import { Heart, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

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

function getMatchBadgeColor(pct: number) {
  if (pct >= 90) return 'bg-green-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-500';
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const photo = match.photo || PLACEHOLDER_PHOTOS[index % PLACEHOLDER_PHOTOS.length];

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group w-full flex flex-col">
      {/* Photo area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2.5' }}>
        {!imgError ? (
          <img
            src={photo}
            alt={match.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl">👤</div>
          </div>
        )}

        {/* Match % badge — top left */}
        <div className={`absolute top-2.5 left-2.5 ${getMatchBadgeColor(match.matchPercent)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
          {match.matchPercent}% Match
        </div>

        {/* Online + Heart — top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {match.isOnline && (
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block" />
              <span className="text-white text-[9px] font-medium">Online</span>
            </div>
          )}
          <button
            onClick={() => setLiked(!liked)}
            className="w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart size={14} className={liked ? 'text-white fill-white' : 'text-white'} />
          </button>
        </div>
      </div>

      {/* Info below photo */}
      <div className="px-2.5 pt-1.5 pb-1">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-neutral-900 leading-tight">
            {match.name}, {match.age}
          </span>
          {match.isVerified && (
            <CheckCircle2 size={11} className="text-blue-500 flex-shrink-0" fill="#3b82f6" strokeWidth={0} />
          )}
        </div>
        <p className="text-[10px] text-neutral-500">{match.profession}</p>
        <div className="flex items-center gap-0.5">
          <MapPin size={8} className="text-neutral-400 flex-shrink-0" />
          <p className="text-[10px] text-neutral-400">{match.location}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="px-2.5 pb-2 flex flex-wrap gap-1">
        {match.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-full text-[9px] font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const MOCK_MATCHES: Match[] = [
  { id: '1', name: 'Ananya Singh', age: 27, profession: 'Product Manager', location: 'Delhi, India', religion: 'Hindu', caste: 'Kayastha', height: "5'5\"", matchPercent: 95, isOnline: true, isVerified: true, tags: ['Hindu', 'Kayastha', "5'5\""] },
  { id: '2', name: 'Neha Gupta', age: 26, profession: 'UX Designer', location: 'Bangalore, India', religion: 'Hindu', caste: 'Bania', height: "5'4\"", matchPercent: 92, isOnline: true, isVerified: true, tags: ['Hindu', 'Bania', "5'4\""] },
  { id: '3', name: 'Pooja Sharma', age: 28, profession: 'Software Engineer', location: 'Mumbai, India', religion: 'Hindu', caste: 'Brahmin', height: "5'6\"", matchPercent: 90, isOnline: true, isVerified: true, tags: ['Hindu', 'Brahmin', "5'6\""] },
  { id: '4', name: 'Ishita Verma', age: 27, profession: 'Chartered Accountant', location: 'Pune, India', religion: 'Hindu', caste: 'Agarwal', height: "5'5\"", matchPercent: 88, isOnline: false, isVerified: true, tags: ['Hindu', 'Agarwal', "5'5\""] },
];

export function AIRecommendedMatches() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-1.5">
            <span className="text-primary-700">✨</span>
            AI Recommended Matches
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">Based on your preferences &amp; compatibility</p>
        </div>
        <a
          href="/matches"
          className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-0.5 whitespace-nowrap mt-0.5"
        >
          See all <ChevronRight size={13} />
        </a>
      </div>

      {/* Cards */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {MOCK_MATCHES.map((match, i) => (
            <MatchCard key={match.id} match={match} index={i} />
          ))}
        </div>

        {/* Right arrow */}
        <button className="absolute -right-2.5 top-1/2 -translate-y-1/2 hidden md:flex w-8 h-8 bg-white border border-vivaah-border rounded-full shadow-md items-center justify-center text-neutral-500 hover:border-primary-700/40 hover:text-primary-700 transition-colors z-10">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
