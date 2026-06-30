'use client';

import { Lock, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

export default function UpgradeWallCard() {
  return (
    <div className="col-span-full">
      <div className="bg-gradient-to-br from-primary-50 to-amber-50 border-2 border-dashed border-primary-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary-700" />
        </div>
        <h3 className="text-lg font-extrabold text-neutral-900 mb-1">Daily Limit Reached</h3>
        <p className="text-sm text-neutral-500 mb-5 max-w-xs mx-auto">
          Free plan lets you view 5 profiles per day. Upgrade to Gold to see unlimited profiles.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/select-plan"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Gold — ₹499/mo
          </Link>
          <Link
            href="/select-plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-400 text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            View All Plans
          </Link>
        </div>
        <p className="text-xs text-neutral-400 mt-4">Your free limit resets every day at midnight UTC</p>
      </div>
    </div>
  );
}
