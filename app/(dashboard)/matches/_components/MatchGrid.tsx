'use client';

import { RefreshCw } from 'lucide-react';
import MatchCard from './MatchCard';
import SkeletonMatchCard from './SkeletonMatchCard';
import EmptyMatchesState from './EmptyMatchesState';
import type { MatchData } from './types';

interface MatchGridProps {
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  visibleMatches: MatchData[];
  liked: Set<string>;
  onLike: (m: MatchData) => void;
  onPass: (m: MatchData) => void;
  tab: string;
  hasFilters: boolean;
  page: number;
  totalPages: number;
  total: number;
  onLoadMore: () => void;
}

export default function MatchGrid({
  loading,
  error,
  isLoggedIn,
  visibleMatches,
  liked,
  onLike,
  onPass,
  tab,
  hasFilters,
  page,
  totalPages,
  total,
  onLoadMore,
}: MatchGridProps) {
  return (
    <>
      {/* Loading — first page */}
      {loading && visibleMatches.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonMatchCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="font-medium text-neutral-600">{error}</p>
          {!isLoggedIn && (
            <a href="/login" className="text-sm mt-2 inline-block text-primary-700 font-semibold hover:underline">
              Go to login →
            </a>
          )}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && visibleMatches.length === 0 && (
        <EmptyMatchesState tab={tab} hasFilters={hasFilters} />
      )}

      {/* Cards grid */}
      {visibleMatches.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleMatches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                isLiked={liked.has(m.id)}
                onLike={onLike}
                onPass={onPass}
              />
            ))}

            {/* Skeleton cards while loading more */}
            {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonMatchCard key={`sk-${i}`} />)}
          </div>

          {/* Load more / pagination */}
          {!loading && page < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={onLoadMore}
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary-700 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                <RefreshCw size={15} />
                Load more matches
              </button>
            </div>
          )}

          {/* Totals */}
          {!loading && (
            <p className="text-center text-xs text-neutral-400 mt-4">
              Showing {visibleMatches.length} of {total} profiles
            </p>
          )}
        </>
      )}
    </>
  );
}
