'use client';

import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { RELIGIONS, STATES } from './constants';
import type { Filters } from './types';

interface FilterPanelProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  onClose?: () => void;
}

export default function FilterPanel({ filters, onChange, onReset, onClose }: FilterPanelProps) {
  const field = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value });

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-neutral-900 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-700" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button onClick={onReset} className="text-xs text-primary-700 font-semibold hover:underline">
              Reset
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Age range */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          Age Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={18} max={60}
            value={filters.minAge}
            onChange={field('minAge')}
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-vivaah-border rounded-xl text-sm focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          />
          <span className="text-neutral-400 text-sm">–</span>
          <input
            type="number"
            min={18} max={70}
            value={filters.maxAge}
            onChange={field('maxAge')}
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-vivaah-border rounded-xl text-sm focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          />
        </div>
      </div>

      {/* Religion */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          Religion
        </label>
        <div className="relative">
          <select
            value={filters.religion}
            onChange={field('religion')}
            className="w-full px-3 py-2 border border-vivaah-border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          >
            {RELIGIONS.map((r) => (
              <option key={r} value={r === 'Any' ? '' : r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* State */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
          State / Region
        </label>
        <div className="relative">
          <select
            value={filters.state}
            onChange={field('state')}
            className="w-full px-3 py-2 border border-vivaah-border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
          >
            {STATES.map((s) => (
              <option key={s} value={s === 'Any' ? '' : s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {hasActive && (
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs text-primary-700 font-medium">
            <span className="w-1.5 h-1.5 bg-primary-700 rounded-full block" />
            Filters active
          </div>
        </div>
      )}
    </div>
  );
}
