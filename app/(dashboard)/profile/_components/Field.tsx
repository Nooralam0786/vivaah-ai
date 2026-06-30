import { Lock } from 'lucide-react';

// ─── Reusable field — defined at module scope so its identity is stable across
// re-renders. Defining this inside ProfilePage caused React to remount the
// underlying <input> on every keystroke, dropping focus after one character. ───
export default function Field({
  label, value, onChange, type = 'text', editing, locked,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  editing: boolean;
  locked?: boolean;
}) {
  if (editing && onChange) {
    return (
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-vivaah-border bg-white text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
        />
      </div>
    );
  }

  if (editing && locked) {
    return (
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">
          {label} <Lock className="w-3 h-3" />
        </label>
        <p className="w-full px-4 py-2.5 rounded-xl border border-dashed border-vivaah-border bg-vivaah-bg text-sm text-neutral-500">
          {value || <span className="text-neutral-300">Not specified</span>}
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">Contact support to change this</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">{label}</label>
      <p className="text-sm text-neutral-800 font-medium">{value || <span className="text-neutral-300">Not specified</span>}</p>
    </div>
  );
}
