import { INTERESTS_LIST, type WizardData, type WizardKey } from "./constants";

export default function Step5AboutMe({ data, set, setInterests }: { data: WizardData; set: (k: WizardKey, v: string) => void; setInterests: (v: string[]) => void }) {
  const toggle = (interest: string) => {
    const cur = data.interests;
    setInterests(cur.includes(interest) ? cur.filter((x) => x !== interest) : [...cur, interest]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">About Me</label>
        <textarea value={data.aboutMe} onChange={(e) => set('aboutMe', e.target.value)} placeholder="Tell potential matches a bit about yourself, your values, and what you're looking for..."
          rows={4} className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all resize-none" />
        <p className="text-xs text-neutral-400 mt-1">{data.aboutMe.length} / 500 characters</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-2">Interests & Hobbies <span className="text-neutral-400 font-normal">(pick up to 8)</span></label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS_LIST.map((interest) => {
            const active = data.interests.includes(interest);
            return (
              <button key={interest} type="button" onClick={() => toggle(interest)} disabled={!active && data.interests.length >= 8}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-[#7A0026] border-[#7A0026] text-white' : 'border-neutral-200 text-neutral-600 hover:border-[#7A0026]/40 bg-white disabled:opacity-40'}`}>
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
