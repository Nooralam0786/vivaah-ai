import { Phone } from 'lucide-react';
import StepBadge from './StepBadge';

export default function PhoneStep({ verified }: { verified: boolean }) {
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
