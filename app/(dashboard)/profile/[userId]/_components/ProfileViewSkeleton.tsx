export default function ProfileViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse space-y-4">
      <div className="h-72 bg-neutral-200 rounded-2xl" />
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <div className="h-6 bg-neutral-200 rounded w-48" />
        <div className="h-4 bg-neutral-100 rounded w-32" />
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-neutral-100 rounded-xl flex-1" />)}
        </div>
      </div>
    </div>
  );
}
