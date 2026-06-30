import { SelectField, InputField } from "./fields";
import { MARITAL, RELIGIONS, MOTHER_TONGUES, HEIGHTS, type WizardData, type WizardKey } from "./constants";

export default function Step1BasicInfo({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputField label="Date of Birth" name="dob" type="date" value={data.dob} onChange={set} required />
      <SelectField label="Marital Status" name="maritalStatus" options={MARITAL} value={data.maritalStatus} onChange={set} required />
      <SelectField label="Religion" name="religion" options={RELIGIONS} value={data.religion} onChange={set} required />
      <InputField label="Caste / Community" name="caste" placeholder="e.g. Brahmin, Yadav" value={data.caste} onChange={set} />
      <SelectField label="Mother Tongue" name="motherTongue" options={MOTHER_TONGUES} value={data.motherTongue} onChange={set} required />
      <SelectField label="Height" name="height" options={HEIGHTS} value={data.height} onChange={set} required />
    </div>
  );
}
