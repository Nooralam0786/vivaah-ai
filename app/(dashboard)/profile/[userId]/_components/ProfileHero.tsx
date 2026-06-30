import { CheckCircle2, MapPin } from 'lucide-react';
import { scoreBg, scoreLabel } from '../constants';
import type { ProfileFull } from '../types';

interface ProfileHeroProps {
  profile: ProfileFull;
  allPhotos: string[];
  imgIdx: number;
  location: string;
  onSelectImage: (index: number) => void;
}

export default function ProfileHero({ profile, allPhotos, imgIdx, location, onSelectImage }: ProfileHeroProps) {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden">

      {/* Main photo */}
      <div className="relative h-80 bg-gradient-to-br from-primary-100 to-primary-50">
        {allPhotos[imgIdx] ? (
          <img
            src={allPhotos[imgIdx]}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">👤</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Thumbnail strip */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-16 left-4 right-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {allPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectImage(i)}
                aria-label={`View photo ${i + 1}`}
                className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === imgIdx ? 'border-white' : 'border-transparent opacity-60'}`}
              >
                <img src={allPhotos[i]} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Match badge */}
        <div className={`absolute top-4 left-4 ${scoreBg(profile.matchPercent)} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
          {profile.matchPercent}% · {scoreLabel(profile.matchPercent)}
        </div>

        {/* Online */}
        {profile.isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse block" />
            <span className="text-white text-xs font-medium">Online Now</span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <h1 className="text-white text-2xl font-bold leading-tight">
              {profile.name}{profile.age ? `, ${profile.age}` : ''}
            </h1>
            {profile.isVerified && (
              <CheckCircle2 size={20} className="text-blue-300 flex-shrink-0" fill="#93c5fd" strokeWidth={0} />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {profile.occupation && <span className="text-white/80 text-sm">{profile.occupation}</span>}
            {profile.occupation && location && <span className="text-white/50">·</span>}
            {location && (
              <span className="text-white/70 text-sm flex items-center gap-1">
                <MapPin size={12} /> {location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 divide-x divide-vivaah-border border-t border-vivaah-border">
        {[
          { label: 'Religion', value: profile.religion },
          { label: 'Height',   value: profile.height },
          { label: 'Education',value: profile.qualification },
        ].map(({ label, value }) => (
          <div key={label} className="py-3 text-center">
            <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-neutral-800 truncate px-2">{value ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
