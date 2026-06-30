'use client';

import { SlidersHorizontal } from 'lucide-react';

export default function PageHeader({
  total,
  hasFilters,
  filterOpen,
  onToggleFilter,
}: {
  total: number;
  hasFilters: boolean;
  filterOpen: boolean;
  onToggleFilter: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Your Matches</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {total > 0 ? `${total} compatible profiles found` : 'Explore profiles that match your preferences'}
        </p>
      </div>
      <button
        onClick={onToggleFilter}
        className={`lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
          hasFilters || filterOpen
            ? 'border-primary-700 text-primary-700 bg-primary-50'
            : 'border-vivaah-border text-neutral-600 hover:border-primary-700/40'
        }`}
      >
        <SlidersHorizontal size={15} />
        Filters
        {hasFilters && <span className="w-2 h-2 bg-primary-700 rounded-full" />}
      </button>
    </div>
  );
}
