'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { WIZARD_STEPS, EMPTY, loadDraft, saveDraft, type WizardData, type WizardKey } from './_components/constants';
import WizardStepTabs from './_components/WizardStepTabs';
import Step1BasicInfo from './_components/Step1BasicInfo';
import Step2Education from './_components/Step2Education';
import Step3Location from './_components/Step3Location';
import Step4PartnerPrefs from './_components/Step4PartnerPrefs';
import Step5AboutMe from './_components/Step5AboutMe';

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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-[#7A0026] uppercase tracking-wider mb-1">Step 4 of 5 — Profile Setup</p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">Complete Your Profile</h1>
          <p className="text-sm text-neutral-500 mt-1">A complete profile gets 10× more matches</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
          <div className="bg-[#7A0026] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Step tabs */}
        <WizardStepTabs step={step} onSelectStep={setStep} />

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 p-4 sm:p-6 md:p-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-5 flex items-center gap-2">
            {(() => { const { icon: Icon } = WIZARD_STEPS[step]; return <Icon className="w-5 h-5 text-[#7A0026]" />; })()}
            {WIZARD_STEPS[step].label}
          </h2>

          {step === 0 && <Step1BasicInfo data={data} set={set} />}
          {step === 1 && <Step2Education data={data} set={set} />}
          {step === 2 && <Step3Location data={data} set={set} />}
          {step === 3 && <Step4PartnerPrefs data={data} set={set} />}
          {step === 4 && <Step5AboutMe data={data} set={set} setInterests={setInterests} />}

          {error && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}

          <div className="flex flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-600 hover:border-[#7A0026]/40 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> <span className="hidden xs:inline">Previous</span>
            </button>

            <span className="text-xs text-neutral-400 flex-shrink-0">{step + 1} / {WIZARD_STEPS.length}</span>

            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#7A0026] hover:bg-[#A10035] text-white rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-60"
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
