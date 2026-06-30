import { memo } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

function StepBadge({ done, pending }: { done: boolean; pending?: boolean }) {
  if (done)    return <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" fill="#22c55e" strokeWidth={0} />;
  if (pending) return <Clock        size={20} className="text-amber-400 flex-shrink-0" />;
  return <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0" />;
}

export default memo(StepBadge);
