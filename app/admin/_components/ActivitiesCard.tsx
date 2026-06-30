'use client';

import Card from './Card';
import { MOCK_ACTIVITIES } from './dashboardConstants';

export default function ActivitiesCard() {
  return (
    <Card title="Recent Activities" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
      <div className="grid grid-cols-2 gap-4">
        {MOCK_ACTIVITIES.map((a, i) => {
          const { Icon: AIcon } = a;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0`}>
                <AIcon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{a.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{a.sub}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{a.ago}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
