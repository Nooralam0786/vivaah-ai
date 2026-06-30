'use client';

export default function ConvSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-vivaah-border animate-pulse">
      <div className="w-11 h-11 rounded-full bg-neutral-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-neutral-200 rounded w-28" />
        <div className="h-2.5 bg-neutral-100 rounded w-44" />
      </div>
    </div>
  );
}
