'use client';

/** Base pulsing placeholder block. Compose into page-specific skeleton layouts. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

export function SkeletonText({ className = 'h-3 w-2/3' }: { className?: string }) {
  return <Skeleton className={className} />;
}

export function SkeletonAvatar({ size = 'w-8 h-8' }: { size?: string }) {
  return <Skeleton className={`${size} rounded-full flex-shrink-0`} />;
}

/** Skeleton for a single <tr> with `cols` cells — for table loading states. */
export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-3 w-24" />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a card-list item (mobile list views). */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2 ${className}`}>
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
