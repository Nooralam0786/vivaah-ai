'use client';

import { memo } from 'react';
import { ShieldCheck, Crown, UserX, UserCheck, Trash2 } from 'lucide-react';
import Avatar from './Avatar';
import { TIER_BADGE } from './constants';
import type { AdminUser } from './types';

interface UserCardProps {
  user: AdminUser;
  acting: string | null;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

function UserCard({ user: u, acting, onSuspend, onActivate, onDelete }: UserCardProps) {
  const tierInfo    = TIER_BADGE[u.subscriptionTier] ?? TIER_BADGE.free;
  const isSuspended = u.onboardingStep === 'suspended';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar name={u.fullName} photo={u.photo} />
          {u.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <ShieldCheck className="w-2 h-2 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">{u.fullName}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${tierInfo.cls}`}>
              {u.subscriptionTier !== 'free' && <Crown className="w-2.5 h-2.5" />}
              {tierInfo.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{u.email}</p>
          <p className="text-[10px] text-gray-400">{u.phone}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isSuspended
                ? 'bg-red-50 text-red-600 border-red-100'
                : u.onboardingStep === 'complete'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {isSuspended ? 'Suspended' : u.onboardingStep === 'complete' ? 'Active' : 'Onboarding'}
            </span>
            <span className="text-[10px] text-gray-400">❤️ {u.likesGiven} given · {u.likesReceived} received</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-gray-400">
              {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
            </p>
            <div className="flex items-center gap-1.5">
              {isSuspended ? (
                <button onClick={() => onActivate(u.id)} disabled={acting === u.id} aria-label="Activate user"
                  className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400">
                  <UserCheck className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={() => onSuspend(u.id)} disabled={acting === u.id} aria-label="Suspend user"
                  className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400">
                  <UserX className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={() => onDelete(u.id, u.fullName)}
                disabled={acting === u.id} aria-label="Delete user"
                className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-red-200 focus-visible:ring-2 focus-visible:ring-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(UserCard);
