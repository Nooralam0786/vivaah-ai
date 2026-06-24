'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight, ChevronLeft, Check, User, GraduationCap, MapPin, Heart, Smile } from 'lucide-react';

/* ─── Step configuration ─────────────────────────────────────── */

const WIZARD_STEPS = [
  { label: 'Basic Info', icon: User },
  { label: 'Education', icon: GraduationCap },
  { label: 'Location', icon: MapPin },
  { label: 'Partner Prefs', icon: Heart },
  { label: 'About Me', icon: Smile },
];

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'No Religion', 'Other'];
const MARITAL = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const QUALIFICATIONS = ['High School', 'Diploma', 'Graduate', 'Post Graduate', 'Doctorate', 'Other'];
const OCCUPATIONS = ['Private Sector', 'Government / PSU', 'Business / Self Employed', 'Defence / Civil Services', 'Not Working', 'Other'];
const INCOME_OPTIONS = ['Below ₹3 LPA', '₹3-5 LPA', '₹5-10 LPA', '₹10-20 LPA', '₹20-30 LPA', '₹30-50 LPA', 'Above ₹50 LPA'];
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Other'];
const HEIGHTS = ['Below 4\'6"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', 'Above 6\'3"'];
const INTERESTS_LIST = ['Reading', 'Travelling', 'Cooking', 'Music', 'Sports', 'Movies', 'Yoga', 'Gardening', 'Photography', 'Gaming', 'Dancing', 'Painting', 'Fitness', 'Social Work', 'Writing', 'Technology'];
const MOTHER_TONGUES = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu', 'Sanskrit', 'Maithili', 'Other'];

/* ─── Draft helpers ──────────────────────────────────────────── */
const DRAFT_KEY = 'vivaah_wizard_draft';
function loadDraft(): Partial<WizardData> {
  try { const r = sessionStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveDraft(d: Partial<WizardData>) {
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}

interface WizardData {
  dob: string; maritalStatus: string; religion: string; caste: string; motherTongue: string; height: string;
  qualification: string; occupation: string; company: string; annualIncome: string;
  country: string; state: string; city: string;
  partnerAgeMin: string; partnerAgeMax: string; partnerReligion: string; partnerState: string;
  aboutMe: string; interests: string[];
}

const EMPTY: WizardData = {
  dob: '', maritalStatus: '', religion: '', caste: '', motherTongue: '', height: '',
  qualification: '', occupation: '', company: '', annualIncome: '',
  country: 'India', state: '', city: '',
  partnerAgeMin: '21', partnerAgeMax: '35', partnerReligion: '', partnerState: '',
  aboutMe: '', interests: [],
};

/* ─── Generic field helpers ──────────────────────────────────── */
type WizardKey = keyof WizardData;

interface SelectProps { label: string; name: WizardKey; options: string[]; value: string; onChange: (k: WizardKey, v: string) => void; required?: boolean }
function SelectField({ label, name, options, value, onChange, required }: SelectProps) {
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

interface InputProps { label: string; name: WizardKey; type?: string; placeholder?: string; value: string; onChange: (k: WizardKey, v: string) => void; required?: boolean }
function InputField({ label, name, type = 'text', placeholder, value, onChange, required }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-[#7A0026]/20 focus:border-[#7A0026] transition-all" />
    </div>
  );
}

/* ─── Step panels ────────────────────────────────────────────── */

function Step1({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
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

function Step2({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SelectField label="Highest Qualification" name="qualification" options={QUALIFICATIONS} value={data.qualification} onChange={set} required />
      <SelectField label="Occupation" name="occupation" options={OCCUPATIONS} value={data.occupation} onChange={set} required />
      <InputField label="Company / Organisation" name="company" placeholder="Where do you work?" value={data.company} onChange={set} />
      <SelectField label="Annual Income" name="annualIncome" options={INCOME_OPTIONS} value={data.annualIncome} onChange={set} />
    </div>
  );
}

function Step3({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
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

function Step4({ data, set }: { data: WizardData; set: (k: WizardKey, v: string) => void }) {
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

function Step5({ data, set, setInterests }: { data: WizardData; set: (k: WizardKey, v: string) => void; setInterests: (v: string[]) => void }) {
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

/* ─── Main page ──────────────────────────────────────────────── */

export default function ProfileWizardPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({ ...EMPTY, ...loadDraft() });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.onboardingStep === 'complete') router.replace('/dashboard');
  }, [user, router]);

  const set = (k: WizardKey, v: string) => {
    setData((d) => { const n = { ...d, [k]: v }; saveDraft(n); return n; });
  };
  const setInterests = (v: string[]) => {
    setData((d) => { const n = { ...d, interests: v }; saveDraft(n); return n; });
  };

  const validate = (): string | null => {
    if (step === 0 && (!data.dob || !data.maritalStatus || !data.religion || !data.motherTongue || !data.height)) return 'Please fill all required fields';
    if (step === 1 && (!data.qualification || !data.occupation)) return 'Please fill all required fields';
    if (step === 2 && (!data.country || !data.state || !data.city)) return 'Please fill all required fields';
    return null;
  };

  const saveToServer = async () => {
    const auth = JSON.parse(localStorage.getItem('vivaah_auth') || '{}');
    const token = auth.accessToken;
    if (!token) return;

    const payload: Record<string, unknown> = {
      dob: data.dob, maritalStatus: data.maritalStatus, religion: data.religion, caste: data.caste,
      motherTongue: data.motherTongue, height: data.height,
      qualification: data.qualification, occupation: data.occupation, company: data.company, annualIncome: data.annualIncome,
      country: data.country, state: data.state, city: data.city,
      aboutMe: data.aboutMe.slice(0, 500),
      interests: data.interests,
    };

    await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  };

  const handleNext = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    if (step < WIZARD_STEPS.length - 1) { setStep((s) => s + 1); return; }
    // Final step — save everything and advance onboarding
    setSaving(true);
    try {
      await saveToServer();
      const auth = JSON.parse(localStorage.getItem('vivaah_auth') || '{}');
      await fetch('/api/users/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body: JSON.stringify({ step: 'photo_upload' }),
      });
      await refreshUser();
      sessionStorage.removeItem('vivaah_wizard_draft');
      router.push('/photo-upload');
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-[#7A0026] uppercase tracking-wider mb-1">Step 4 of 5 — Profile Setup</p>
          <h1 className="text-2xl font-extrabold text-neutral-900">Complete Your Profile</h1>
          <p className="text-sm text-neutral-500 mt-1">A complete profile gets 10× more matches</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
          <div className="bg-[#7A0026] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Step tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {WIZARD_STEPS.map(({ label, icon: Icon }, i) => (
            <button key={label} onClick={() => { if (i < step) setStep(i); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all
                ${i === step ? 'bg-[#7A0026] text-white shadow-sm' : i < step ? 'bg-[#7A0026]/10 text-[#7A0026]' : 'bg-white text-neutral-400 border border-neutral-200'}`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-5 flex items-center gap-2">
            {(() => { const { icon: Icon } = WIZARD_STEPS[step]; return <Icon className="w-5 h-5 text-[#7A0026]" />; })()}
            {WIZARD_STEPS[step].label}
          </h2>

          {step === 0 && <Step1 data={data} set={set} />}
          {step === 1 && <Step2 data={data} set={set} />}
          {step === 2 && <Step3 data={data} set={set} />}
          {step === 3 && <Step4 data={data} set={set} />}
          {step === 4 && <Step5 data={data} set={set} setInterests={setInterests} />}

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-[#7A0026]/40 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs text-neutral-400">{step + 1} / {WIZARD_STEPS.length}</span>

            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#7A0026] hover:bg-[#A10035] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60"
            >
              {saving ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {saving ? 'Saving…' : step === WIZARD_STEPS.length - 1 ? 'Save & Continue' : 'Next'}
              {!saving && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
