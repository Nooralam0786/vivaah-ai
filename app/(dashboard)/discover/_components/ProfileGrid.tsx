'use client';

import ProfileCard from './ProfileCard';
import SkeletonProfileCard from './SkeletonProfileCard';
import UpgradeWallCard from './UpgradeWallCard';
import type { DiscoverProfile, FreeLimit } from './types';

interface ProfileGridProps {
  profiles: DiscoverProfile[];
  loading: boolean;
  liked: Set<string>;
  saved: Set<string>;
  onLike: (p: DiscoverProfile) => void;
  onSave: (p: DiscoverProfile) => void;
  freeLimit: FreeLimit | null;
  isAtLimit: boolean;
  search: string;
  hasFilters: boolean;
  onClearAll: () => void;
  page: number;
  totalPages: number;
  total: number;
  onLoadMore: () => void;
}

export default function ProfileGrid({
  profiles,
  loading,
  liked,
  saved,
  onLike,
  onSave,
  freeLimit,
  isAtLimit,
  search,
  hasFilters,
  onClearAll,
  page,
  totalPages,
  total,
  onLoadMore,
}: ProfileGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {profiles.map((p) => (
          <ProfileCard
            key={p.id}
            profile={p}
            isLiked={liked.has(p.id)}
            isSaved={saved.has(p.id)}
            onLike={() => onLike(p)}
            onSave={() => onSave(p)}
          />
        ))}
        {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonProfileCard key={`sk-${i}`} />)}

        {/* Upgrade wall — shown when limit is reached mid-grid */}
        {!loading && freeLimit?.isLimited && profiles.length > 0 && (
          <UpgradeWallCard />
        )}
      </div>

      {/* Full-screen upgrade wall — when limit was reached before first load */}
      {!loading && isAtLimit && (
        <div className="py-10">
          <UpgradeWallCard />
        </div>
      )}

      {/* Empty state (no results, not a limit issue) */}
      {!loading && profiles.length === 0 && !isAtLimit && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-medium text-neutral-600">No profiles found</p>
          <p className="text-sm text-neutral-400 mt-1">Try adjusting your search or filters</p>
          {(search || hasFilters) && (
            <button onClick={onClearAll} className="mt-3 text-sm text-primary-700 font-semibold hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Load more — only for paid users */}
      {!loading && !freeLimit && page < totalPages && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 border border-primary-700 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
          >
            Load more profiles
          </button>
        </div>
      )}

      {!loading && profiles.length > 0 && !freeLimit && (
        <p className="text-center text-xs text-neutral-400">
          Showing {profiles.length} of {total} profiles
        </p>
      )}
    </>
  );
}
