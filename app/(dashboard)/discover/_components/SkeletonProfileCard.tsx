'use client';

export default function SkeletonProfileCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-7 bg-neutral-100 rounded-xl flex-1" />
          <div className="h-7 bg-neutral-100 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}
