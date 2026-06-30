import { SelectField, InputField } from "./fields";
import { STATES, type WizardData, type WizardKey } from "./constants";

export default function Step3Location({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Country" name="country" value={data.country} onChange={set} required />
      <SelectField label="State" name="state" options={STATES} value={data.state} onChange={set} required />
      <div className="sm:col-span-2">
        <InputField label="City" name="city" placeholder="Your current city" value={data.city} onChange={set} required />
      </div>
    </div>
  );
}
