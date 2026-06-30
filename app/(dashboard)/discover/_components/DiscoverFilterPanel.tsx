'use client';

import { RELIGIONS, STATES, AGE_PRESETS } from './constants';
import type { Filters } from './types';

interface DiscoverFilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset: () => void;
  onApply: () => void;
}

export default function DiscoverFilterPanel({ filters, setFilters, onReset, onApply }: DiscoverFilterPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-4 sm:p-5 space-y-4">
      {/* Religion */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Religion</p>
        <div className="flex flex-wrap gap-2">
          {RELIGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, religion: r === 'Any' ? '' : r }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                (filters.religion === r || (!filters.religion && r === 'Any'))
                  ? 'bg-primary-gradient text-white shadow-sm'
                  : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Age Range</p>
        <div className="flex flex-wrap gap-2">
          {AGE_PRESETS.map((a) => {
            const active = filters.minAge === a.min && filters.maxAge === a.max;
            return (
              <button
                key={a.label}
                onClick={() => setFilters((f) => active ? { ...f, minAge: '', maxAge: '' } : { ...f, minAge: a.min, maxAge: a.max })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? 'bg-primary-gradient text-white shadow-sm' : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* State */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">State</p>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => setFilters((f) => ({ ...f, state: s === 'Any' ? '' : s }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                (filters.state === s || (!filters.state && s === 'Any'))
                  ? 'bg-primary-gradient text-white shadow-sm'
                  : 'border border-vivaah-border text-neutral-600 hover:border-primary-700/50 bg-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2 border-t border-vivaah-border">
        <button onClick={onReset} className="px-4 py-2 border border-vivaah-border rounded-xl text-sm text-neutral-600 hover:bg-vivaah-bg transition-colors">
          Reset All
        </button>
        <button onClick={onApply} className="px-6 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          Apply
        </button>
      </div>
    </div>
  );
}
