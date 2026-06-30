import { useState, useRef } from 'react';
import { Camera, ChevronDown, Upload, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import StepBadge from './StepBadge';

interface SelfieStepProps {
  status:     string;
  onApproved: () => void;
}

export default function SelfieStep({ status, onApproved }: SelfieStepProps) {
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
