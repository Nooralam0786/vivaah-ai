'use client';

import Card from './Card';
import { MOCK_PREMIUM } from './dashboardConstants';

export default function PremiumMembersCard() {
  return (
    <Card title="Recent Premium Members" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
      <div className="space-y-3">
        {MOCK_PREMIUM.map((m) => (
          <div key={m.email} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1B3D] to-[#9B2D5F] flex items-center justify-center text-white text-sm font-bold">
                {m.name[0]}
              </div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{m.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">{m.ago}</span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-2 border border-[#6B1B3D] text-[#6B1B3D] rounded-xl text-xs font-semibold hover:bg-[#6B1B3D]/5 transition-colors">
        View All Premium Members
      </button>
    </Card>
  );
}
