'use client';

export default function WindowToggle({ value, onChange }: { value: 7 | 30; onChange: (v: 7 | 30) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {([7, 30] as const).map((w) => (
        <button key={w} onClick={() => onChange(w)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${value === w ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
          {w === 7 ? 'This Week' : 'This Month'}
        </button>
      ))}
    </div>
  );
}
