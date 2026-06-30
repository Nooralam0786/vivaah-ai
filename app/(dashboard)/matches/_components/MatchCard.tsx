'use client';

import { useState, memo } from 'react';
import { MapPin, CheckCircle2, SkipForward, Eye } from 'lucide-react';
import { scoreBg, scoreLabel } from './constants';
import type { MatchData } from './types';

interface MatchCardProps {
  match: MatchData;
  isLiked: boolean;
  onLike: (m: MatchData) => void;
  onPass: (m: MatchData) => void;
}

function MatchCardComponent({ match, isLiked, onLike, onPass }: MatchCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Photo */}
      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden flex-shrink-0">
        {match.photo && !imgErr ? (
          <img
            src={match.photo}
            alt={match.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">👤</div>
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Match % badge */}
        <div className={`absolute top-3 left-3 ${scoreBg(match.matchPercent)} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
          {match.matchPercent}% · {scoreLabel(match.matchPercent)}
        </div>

        {/* Online pill */}
        {match.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse block" />
            <span className="text-white text-[10px] font-medium">Online</span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-white font-bold text-base leading-tight">
              {match.name}{match.age ? `, ${match.age}` : ''}
            </h3>
            {match.isVerified && (
              <CheckCircle2 size={14} className="text-blue-300 flex-shrink-0" fill="#93c5fd" strokeWidth={0} />
            )}
          </div>
          {(match.profession || match.location) && (
            <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
              {match.location && <MapPin size={10} className="flex-shrink-0" />}
              {[match.profession, match.location].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Info pills */}
        <div className="flex flex-wrap gap-1.5">
          {match.religion && (
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">
              {match.religion}
            </span>
          )}
          {match.caste && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.caste}
            </span>
          )}
          {match.height && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.height}
            </span>
          )}
          {match.income && (
            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[11px] font-medium">
              {match.income}
            </span>
          )}
        </div>

        {/* Mutual interests */}
        {match.mutualInterests.length > 0 && (
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wide mb-1">
              💡 Mutual interests
            </p>
            <div className="flex flex-wrap gap-1">
              {match.mutualInterests.slice(0, 4).map((i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-medium">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onPass(match)}
            title="Skip this profile"
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-colors"
          >
            <SkipForward size={15} />
          </button>
          <button
            onClick={() => onLike(match)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              isLiked
                ? 'bg-primary-gradient text-white shadow-sm'
                : 'border border-primary-700 text-primary-700 hover:bg-primary-50'
            }`}
          >
            {isLiked ? '❤️ Interested' : '🤍 Send Interest'}
          </button>
          <a
            href={`/profile/${match.userId}`}
            className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
          >
            <Eye size={14} /> View
          </a>
        </div>
      </div>
    </div>
  );
}

const MatchCard = memo(MatchCardComponent);
export default MatchCard;
