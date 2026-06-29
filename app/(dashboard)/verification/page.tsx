'use client';

import { useEffect, useState, useRef } from 'react';
import {
  ShieldCheck, Phone, CreditCard, Camera,
  CheckCircle2, Clock, XCircle, ChevronDown, Upload, Loader2, ArrowRight,
} from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VerificationStatus {
  phoneVerified:  boolean;
  idVerified:     boolean;
  idType:         string | null;
  livenessStatus: 'not_started' | 'pending' | 'approved' | 'rejected';
  overallStatus:  'unverified' | 'pending' | 'verified' | 'rejected';
  verifiedAt:     string | null;
}

const ID_TYPES = [
  { value: 'aadhaar',         label: 'Aadhaar Card',      hint: '12-digit number (e.g. 1234 5678 9012)' },
  { value: 'pan',             label: 'PAN Card',          hint: '10-character (e.g. ABCDE1234F)' },
  { value: 'passport',        label: 'Passport',          hint: '8-character (e.g. A1234567)' },
  { value: 'driving_license', label: 'Driving Licence',   hint: '8–16 alphanumeric characters' },
];

// ─── Step Status Badge ────────────────────────────────────────────────────────

function StepBadge({ done, pending }: { done: boolean; pending?: boolean }) {
  if (done)    return <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" fill="#22c55e" strokeWidth={0} />;
  if (pending) return <Clock        size={20} className="text-amber-400 flex-shrink-0" />;
  return <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0" />;
}

// ─── Overall Banner ───────────────────────────────────────────────────────────

function OverallBanner({ status, verifiedAt }: { status: string; verifiedAt: string | null }) {
  if (status === 'verified') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={28} className="text-green-600" />
        </div>
        <div>
          <h2 className="font-bold text-green-800 text-lg">Profile Verified ✓</h2>
          <p className="text-green-700 text-sm mt-0.5">
            Your blue verified badge is now visible to all matches.
            {verifiedAt && (
              <span className="ml-1 text-green-600">
                Verified on {new Date(verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock size={28} className="text-amber-600" />
        </div>
        <div>
          <h2 className="font-bold text-amber-800 text-lg">Verification In Progress</h2>
          <p className="text-amber-700 text-sm mt-0.5">Complete all 3 steps below to get your verified badge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
        <ShieldCheck size={28} className="text-primary-700" />
      </div>
      <div>
        <h2 className="font-bold text-primary-800 text-lg">Get Your Verified Badge</h2>
        <p className="text-primary-700 text-sm mt-0.5">
          Verified profiles get <strong>3× more matches</strong> and appear higher in search results.
        </p>
      </div>
    </div>
  );
}

// ─── Step 1: Phone ────────────────────────────────────────────────────────────

function PhoneStep({ verified }: { verified: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border p-5 ${verified ? 'border-green-200' : 'border-vivaah-border'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verified ? 'bg-green-100' : 'bg-neutral-100'}`}>
          <Phone size={18} className={verified ? 'text-green-600' : 'text-neutral-500'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-neutral-900">Phone Verification</h3>
            <StepBadge done={verified} />
          </div>
          {verified ? (
            <p className="text-sm text-green-600 mt-1 font-medium">Your phone number is verified.</p>
          ) : (
            <p className="text-sm text-neutral-500 mt-1">Phone is verified automatically when you sign up via OTP.</p>
          )}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${verified ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
          Step 1
        </span>
      </div>
    </div>
  );
}

// ─── Step 2: ID Upload ────────────────────────────────────────────────────────

interface IDStepProps {
  verified:   boolean;
  idType:     string | null;
  onVerified: () => void;
}

function IDStep({ verified, idType, onVerified }: IDStepProps) {
  const [selectedType, setSelectedType] = useState(idType ?? '');
  const [idNumber,     setIdNumber]     = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [open,         setOpen]         = useState(!verified);

  const hint = ID_TYPES.find((t) => t.value === selectedType)?.hint ?? '';

  const handleSubmit = async () => {
    if (!selectedType || !idNumber.trim()) {
      setError('Please select ID type and enter your ID number.');
      return;
    }
    setLoading(true);
    setError(null);
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in.'); setLoading(false); return; }

    try {
      const res  = await fetch('/api/verification/id-upload', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ idType: selectedType, idNumber: idNumber.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? 'Verification failed');
      onVerified();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${verified ? 'border-green-200' : 'border-vivaah-border'}`}>
      {/* Header */}
      <button
        onClick={() => !verified && setOpen((p) => !p)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verified ? 'bg-green-100' : 'bg-neutral-100'}`}>
          <CreditCard size={18} className={verified ? 'text-green-600' : 'text-neutral-500'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-neutral-900">Government ID</h3>
            <StepBadge done={verified} />
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">
            {verified
              ? `Verified with ${ID_TYPES.find((t) => t.value === idType)?.label ?? idType}`
              : 'Aadhaar, PAN, Passport or Driving Licence'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${verified ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
            Step 2
          </span>
          {!verified && (
            <ChevronDown size={16} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {/* Form */}
      {!verified && open && (
        <div className="px-5 pb-5 border-t border-vivaah-border/60 pt-4 space-y-4">
          {/* ID Type */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1.5">
              ID Type
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 border border-vivaah-border rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none bg-white"
              >
                <option value="">Select ID type…</option>
                {ID_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* ID Number */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1.5">
              ID Number
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={hint || 'Enter your ID number'}
              className="w-full px-3 py-2.5 border border-vivaah-border rounded-xl text-sm focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 outline-none"
            />
            {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              <XCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-50 rounded-xl px-3 py-2.5">
            <ShieldCheck size={13} className="flex-shrink-0 text-neutral-400" />
            Your ID details are encrypted and never shared with other users.
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedType || !idNumber.trim()}
            className="w-full py-3 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {loading ? 'Verifying…' : 'Verify ID'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Selfie / Liveness ────────────────────────────────────────────────

interface SelfieStepProps {
  status:     string;
  onApproved: () => void;
}

function SelfieStep({ status, onApproved }: SelfieStepProps) {
  const [preview,   setPreview]   = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [open,      setOpen]      = useState(status === 'not_started');
  const fileRef = useRef<HTMLInputElement>(null);

  const done    = status === 'approved';
  const pending = status === 'pending';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!preview) { setError('Please select a selfie photo.'); return; }
    setLoading(true);
    setError(null);
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in.'); setLoading(false); return; }

    try {
      const res  = await fetch('/api/verification/liveness', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.accessToken}` },
        body:    JSON.stringify({ selfieUrl: 'selfie://local' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? 'Verification failed');
      onApproved();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${done ? 'border-green-200' : pending ? 'border-amber-200' : 'border-vivaah-border'}`}>
      {/* Header */}
      <button
        onClick={() => !done && setOpen((p) => !p)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : pending ? 'bg-amber-100' : 'bg-neutral-100'}`}>
          <Camera size={18} className={done ? 'text-green-600' : pending ? 'text-amber-600' : 'text-neutral-500'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-neutral-900">Selfie Verification</h3>
            <StepBadge done={done} pending={pending} />
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">
            {done    ? 'Selfie verified successfully'
            : pending ? 'Selfie under review'
            : 'Upload a clear selfie facing the camera'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${done ? 'bg-green-100 text-green-700' : pending ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'}`}>
            Step 3
          </span>
          {!done && (
            <ChevronDown size={16} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {/* Form */}
      {!done && open && (
        <div className="px-5 pb-5 border-t border-vivaah-border/60 pt-4 space-y-4">
          {/* Tips */}
          <ul className="text-xs text-neutral-500 space-y-1.5 bg-neutral-50 rounded-xl px-4 py-3">
            {['Face the camera directly in good lighting', 'No glasses, hats or masks', 'File must be under 5 MB (JPG / PNG / WEBP)'].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold mt-0.5">·</span>
                {tip}
              </li>
            ))}
          </ul>

          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-vivaah-border rounded-xl p-6 text-center cursor-pointer hover:border-primary-700/40 hover:bg-primary-50/30 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Selfie preview" className="w-28 h-28 object-cover rounded-full mx-auto shadow-sm" />
            ) : (
              <>
                <Upload size={28} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-600">Click to upload selfie</p>
                <p className="text-xs text-neutral-400 mt-0.5">JPG, PNG or WEBP</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {preview && (
            <button
              onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
            >
              Remove photo
            </button>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              <XCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !preview}
            className="w-full py-3 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {loading ? 'Verifying…' : 'Submit Selfie'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VerificationPage() {
  const [status,  setStatus]  = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchStatus = async () => {
    const auth = getAuthFromStorage();
    if (!auth) { setError('Please log in.'); setLoading(false); return; }
    try {
      const res  = await fetch('/api/verification/status', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? 'Failed to load');
      setStatus(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const stepsCompleted = status
    ? [status.phoneVerified, status.idVerified, status.livenessStatus === 'approved'].filter(Boolean).length
    : 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-24 bg-neutral-100 rounded-2xl" />
        <div className="h-20 bg-neutral-100 rounded-2xl" />
        <div className="h-20 bg-neutral-100 rounded-2xl" />
        <div className="h-20 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <XCircle size={32} className="text-red-400 mx-auto mb-3" />
        <p className="font-medium text-neutral-600">{error}</p>
        <button onClick={fetchStatus} className="mt-4 px-4 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck size={22} className="text-primary-700" />
          Profile Verification
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Complete all 3 steps to get the blue verified badge on your profile.
        </p>
      </div>

      {/* Overall banner */}
      <OverallBanner status={status?.overallStatus ?? 'unverified'} verifiedAt={status?.verifiedAt ?? null} />

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-vivaah-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-700">Progress</span>
          <span className="text-sm font-bold text-primary-700">{stepsCompleted} / 3 steps</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-gradient rounded-full transition-all duration-500"
            style={{ width: `${(stepsCompleted / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <PhoneStep verified={status?.phoneVerified ?? false} />

      <IDStep
        verified={status?.idVerified ?? false}
        idType={status?.idType ?? null}
        onVerified={fetchStatus}
      />

      <SelfieStep
        status={status?.livenessStatus ?? 'not_started'}
        onApproved={fetchStatus}
      />

      {/* Info footer */}
      <div className="text-xs text-neutral-400 text-center pb-4 space-y-1">
        <p>All data is encrypted with AES-256 and never shared with other users.</p>
        <p>Manual reviews are completed within 24 hours on business days.</p>
      </div>
    </div>
  );
}
