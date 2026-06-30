import { ShieldCheck, Clock } from 'lucide-react';

export default function OverallBanner({ status, verifiedAt }: { status: string; verifiedAt: string | null }) {
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
