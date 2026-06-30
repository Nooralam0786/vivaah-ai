import { SelectField, InputField } from "./fields";
import { QUALIFICATIONS, OCCUPATIONS, INCOME_OPTIONS, type WizardData, type WizardKey } from "./constants";

export default function Step2Education({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SelectField label="Highest Qualification" name="qualification" options={QUALIFICATIONS} value={data.qualification} onChange={set} required />
      <SelectField label="Occupation" name="occupation" options={OCCUPATIONS} value={data.occupation} onChange={set} required />
      <InputField label="Company / Organisation" name="company" placeholder="Where do you work?" value={data.company} onChange={set} />
      <SelectField label="Annual Income" name="annualIncome" options={INCOME_OPTIONS} value={data.annualIncome} onChange={set} />
    </div>
  );
}
