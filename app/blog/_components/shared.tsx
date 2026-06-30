export function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Petal({ className }: { className: string }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 24 24" fill="#E89A8A">
      <path d="M12 2c3 3 5 6 5 9a5 5 0 11-10 0c0-3 2-6 5-9z" opacity="0.55" />
    </svg>
  );
}
