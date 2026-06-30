'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  onPrev: () => void;
  onNext: () => void;
  itemLabel?: string;
  className?: string;
}

/** Shared list-footer pagination — "X–Y of Z" + prev/next buttons. */
export default function Pagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  onPrev,
  onNext,
  itemLabel = 'results',
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}
    >
      <p className="text-xs text-gray-500">
        {rangeStart}–{rangeEnd} of {total.toLocaleString('en-IN')} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          aria-label="Previous page"
          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary-700/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 px-2">
          {page}/{totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary-700/40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
