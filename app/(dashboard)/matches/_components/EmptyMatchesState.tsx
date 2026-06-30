'use client';

const MSGS: Record<string, { emoji: string; title: string; sub: string }> = {
  new:        { emoji: '💕', title: 'No suggestions yet',      sub: 'Complete your profile to get personalised matches.' },
  compatible: { emoji: '💯', title: 'No highly compatible matches', sub: 'Broaden your preferences or check back soon.' },
  mutual:     { emoji: '🤝', title: 'No mutual interests yet', sub: 'Send interests to profiles you like and wait for them to respond.' },
};

export default function EmptyMatchesState({ tab, hasFilters }: { tab: string; hasFilters: boolean }) {
  const m = MSGS[tab] ?? MSGS['new'];
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4 select-none">{m.emoji}</div>
      <h3 className="font-bold text-neutral-700 text-lg mb-1">
        {hasFilters ? 'No results for these filters' : m.title}
      </h3>
      <p className="text-sm text-neutral-400 max-w-xs mx-auto">
        {hasFilters ? 'Try adjusting or resetting your filters to see more profiles.' : m.sub}
      </p>
    </div>
  );
}
