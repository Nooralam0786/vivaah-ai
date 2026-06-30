import type { WizardKey } from "./constants";

export interface SelectProps { label: string; name: WizardKey; options: string[]; value: string; onChange: (k: WizardKey, v: string) => void; required?: boolean }
export function SelectField({ label, name, options, value, onChange, required }: SelectProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <select value={value} onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all appearance-none">
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export interface InputProps { label: string; name: WizardKey; type?: string; placeholder?: string; value: string; onChange: (k: WizardKey, v: string) => void; required?: boolean }
export function InputField({ label, name, type = 'text', placeholder, value, onChange, required }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all" />
    </div>
  );
}
