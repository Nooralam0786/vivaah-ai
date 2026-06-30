'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';
import { getAuthFromStorage } from '@/lib/auth';
import type { VerificationStatus } from './types';
import OverallBanner from './_components/OverallBanner';
import VerificationProgress from './_components/VerificationProgress';
import PhoneStep from './_components/PhoneStep';
import IDStep from './_components/IDStep';
import SelfieStep from './_components/SelfieStep';

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
      <VerificationProgress stepsCompleted={stepsCompleted} />

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
