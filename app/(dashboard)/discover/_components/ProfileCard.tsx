'use client';

import { useState, memo } from 'react';
import { Bookmark, Heart, Eye } from 'lucide-react';
import { scoreBg } from './constants';
import type { DiscoverProfile } from './types';

interface ProfileCardProps {
  profile: DiscoverProfile;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}

function ProfileCardComponent({
  profile,
  isLiked,
  isSaved,
  onLike,
  onSave,
}: ProfileCardProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0">
        {profile.photo && !imgErr ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">👤</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Match % */}
        <div className={`absolute top-2.5 left-2.5 ${scoreBg(profile.matchPercent)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {profile.matchPercent}%
        </div>

        {/* Online dot */}
        {profile.isOnline && (
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Save bookmark */}
        <button
          onClick={onSave}
          className={`absolute top-8 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isSaved ? 'bg-amber-400 text-white' : 'bg-black/40 text-white hover:bg-amber-400'
          }`}
        >
          <Bookmark size={13} className={isSaved ? 'fill-white' : ''} />
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1">
            <h3 className="text-white font-bold text-sm leading-tight truncate">
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h3>
            {profile.isVerified && <span className="text-blue-300 text-xs flex-shrink-0">✓</span>}
          </div>
          {profile.profession && <p className="text-white/80 text-xs truncate">{profile.profession}</p>}
          {profile.location && (
            <p className="text-white/60 text-[10px] truncate">📍 {profile.location}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2">
        <button
          onClick={onLike}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            isLiked ? 'bg-primary-gradient text-white' : 'border border-primary-700 text-primary-700 hover:bg-primary-50'
          }`}
        >
          <Heart size={12} className={isLiked ? 'fill-white' : ''} />
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <a
          href={`/profile/${profile.userId}`}
          className="flex-1 py-2 bg-primary-gradient text-white rounded-xl text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1"
        >
          <Eye size={12} /> View
        </a>
      </div>
    </div>
  );
}

const ProfileCard = memo(ProfileCardComponent);
export default ProfileCard;
