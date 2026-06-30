'use client';

import { memo } from 'react';
import { ShieldCheck, Crown, UserX, UserCheck, Trash2 } from 'lucide-react';
import Avatar from './Avatar';
import { TIER_BADGE } from './constants';
import type { AdminUser } from './types';

interface UserRowProps {
  user: AdminUser;
  acting: string | null;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

function UserRow({ user: u, acting, onSuspend, onActivate, onDelete }: UserRowProps) {
  const tierInfo    = TIER_BADGE[u.subscriptionTier] ?? TIER_BADGE.free;
  const isSuspended = u.onboardingStep === 'suspended';
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Avatar name={u.fullName} photo={u.photo} />
            {u.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck className="w-2 h-2 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 truncate max-w-32">{u.fullName}</p>
            <p className="text-[10px] text-gray-400 capitalize">{u.gender ?? '—'}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-gray-600 truncate max-w-40">{u.email}</p>
        <p className="text-[10px] text-gray-400">{u.phone}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tierInfo.cls}`}>
          {u.subscriptionTier !== 'free' && <Crown className="w-2.5 h-2.5" />}
          {tierInfo.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
          isSuspended
            ? 'bg-red-50 text-red-600 border-red-100'
            : u.onboardingStep === 'complete'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          {isSuspended ? 'Suspended' : u.onboardingStep === 'complete' ? 'Active' : 'Onboarding'}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-gray-600">❤️ {u.likesGiven} given</p>
        <p className="text-[10px] text-gray-400">{u.likesReceived} received</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {isSuspended ? (
            <button onClick={() => onActivate(u.id)} disabled={acting === u.id} aria-label="Activate user" title="Activate"
              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400">
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={() => onSuspend(u.id)} disabled={acting === u.id} aria-label="Suspend user" title="Suspend"
              className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400">
              <UserX className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onDelete(u.id, u.fullName)}
            disabled={acting === u.id} aria-label="Delete user" title="Delete"
            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 border border-red-200 focus-visible:ring-2 focus-visible:ring-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default memo(UserRow);
