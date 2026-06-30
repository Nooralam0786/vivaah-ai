'use client';

import { useEffect, useState } from 'react';

interface UsePaginationOptions {
  pageSize: number;
  total: number;
  initialPage?: number;
}

/**
 * Pure UI-state pagination helper. Does not fetch data — callers remain
 * responsible for triggering their own fetch when `page` changes.
 */
export function usePagination({ pageSize, total, initialPage = 1 }: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp page if the result set shrinks (e.g. after a filter/search change).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return {
    page,
    setPage,
    totalPages,
    canPrev,
    canNext,
    goToPrev: () => setPage((p) => Math.max(1, p - 1)),
    goToNext: () => setPage((p) => Math.min(totalPages, p + 1)),
    rangeStart: total === 0 ? 0 : (page - 1) * pageSize + 1,
    rangeEnd: Math.min(page * pageSize, total),
  };
}
