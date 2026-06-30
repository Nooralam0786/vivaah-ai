'use client';

import { TABS } from './constants';
import type { MatchData } from './types';

export default function TabBar({
  tab,
  setTab,
  matches,
}: {
  tab: string;
  setTab: (t: string) => void;
  matches: MatchData[];
}) {
  const counts: Record<string, number> = {};
  for (const m of matches) {
    counts[m.tag] = (counts[m.tag] ?? 0) + 1;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
            tab === t.id
              ? t.premium
                ? 'bg-gold-gradient text-neutral-900'
                : 'bg-primary-gradient text-white shadow-sm'
              : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'
          }`}
        >
          <span>{t.emoji}</span>
          {t.label}
          {!t.premium && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.id ? 'bg-white/20' : 'bg-primary-50 text-primary-700'
            }`}>
              {counts[t.id] ?? 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
