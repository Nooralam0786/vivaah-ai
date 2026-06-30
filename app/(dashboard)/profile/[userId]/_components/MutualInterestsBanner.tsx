interface MutualInterestsBannerProps {
  mutualInterests: string[];
}

export default function MutualInterestsBanner({ mutualInterests }: MutualInterestsBannerProps) {
  if (mutualInterests.length === 0) return null;
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
      <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-2">
        💡 {mutualInterests.length} Mutual Interest{mutualInterests.length > 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        {mutualInterests.map((i) => (
          <span key={i} className="px-3 py-1 bg-white border border-primary-200 text-primary-700 rounded-full text-xs font-semibold">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
