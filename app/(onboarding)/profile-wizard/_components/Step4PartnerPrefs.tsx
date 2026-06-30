import { SelectField } from "./fields";
import { RELIGIONS, STATES, type WizardData, type WizardKey } from "./constants";

export default function Step4PartnerPrefs({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Partner Age Range</label>
        <div className="flex gap-2 items-center">
          <input type="number" min={18} max={80} value={data.partnerAgeMin} onChange={(e) => set('partnerAgeMin', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all" />
          <span className="text-neutral-400 text-sm flex-shrink-0">to</span>
          <input type="number" min={18} max={80} value={data.partnerAgeMax} onChange={(e) => set('partnerAgeMax', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all" />
        </div>
      </div>
      <SelectField label="Partner's Religion" name="partnerReligion" options={['Any', ...RELIGIONS]} value={data.partnerReligion} onChange={set} />
      <div className="sm:col-span-2">
        <SelectField label="Preferred State" name="partnerState" options={['Any State', ...STATES]} value={data.partnerState} onChange={set} />
      </div>
    </div>
  );
}
