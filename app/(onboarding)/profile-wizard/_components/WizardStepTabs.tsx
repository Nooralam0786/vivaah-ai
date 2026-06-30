import { Check } from "lucide-react";
import { WIZARD_STEPS } from "./constants";

interface WizardStepTabsProps {
  step: number;
  onSelectStep: (i: number) => void;
}

export default function WizardStepTabs({ step, onSelectStep }: WizardStepTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
      {WIZARD_STEPS.map(({ label, icon: Icon }, i) => (
        <button key={label} onClick={() => { if (i < step) onSelectStep(i); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all
            ${i === step ? 'bg-[#7A0026] text-white shadow-sm' : i < step ? 'bg-[#7A0026]/10 text-[#7A0026]' : 'bg-white text-neutral-400 border border-neutral-200'}`}>
          {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
          {label}
        </button>
      ))}
    </div>
  );
}
