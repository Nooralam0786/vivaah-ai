import { useState } from 'react';
import { CreditCard, ChevronDown, XCircle, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import { ID_TYPES } from '../constants';
import StepBadge from './StepBadge';

interface IDStepProps {
  verified:   boolean;
  idType:     string | null;
  onVerified: () => void;
}

export default function IDStep({ verified, idType, onVerified }: IDStepProps) {
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
