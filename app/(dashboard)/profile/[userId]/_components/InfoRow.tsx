import { memo } from 'react';

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-vivaah-border last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-800">{value}</span>
    </div>
  );
}

export default memo(InfoRow);
