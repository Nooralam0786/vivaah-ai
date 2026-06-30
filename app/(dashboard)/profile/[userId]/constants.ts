export function scoreBg(pct: number) {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-neutral-400';
}

export function scoreLabel(pct: number) {
  if (pct >= 90) return 'Excellent Match';
  if (pct >= 80) return 'Great Match';
  if (pct >= 70) return 'Good Match';
  return 'Fair Match';
}
