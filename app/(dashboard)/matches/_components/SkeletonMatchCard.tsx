'use client';

export default function SkeletonMatchCard() {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card overflow-hidden animate-pulse">
      <div className="h-56 bg-neutral-200" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 bg-neutral-100 rounded-full w-16" />
          <div className="h-5 bg-neutral-100 rounded-full w-20" />
        </div>
        <div className="flex gap-2 mt-3">
          <div className="h-9 bg-neutral-100 rounded-xl flex-1" />
          <div className="h-9 bg-neutral-100 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}
