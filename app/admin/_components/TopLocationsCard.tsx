'use client';

import Card from './Card';
import { MapPin } from 'lucide-react';
import { MOCK_LOCATIONS } from './dashboardConstants';

export default function TopLocationsCard() {
  const maxLoc = Math.max(...MOCK_LOCATIONS.map((l) => l.users));
  return (
    <Card title="Top Performing Locations" action={<button className="text-[11px] font-semibold text-[#6B1B3D] hover:underline">View All</button>}>
      <div className="space-y-4">
        {MOCK_LOCATIONS.map((loc) => {
          const pct = Math.round((loc.users / maxLoc) * 100);
          return (
            <div key={loc.city}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-[#6B1B3D] flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">{loc.city}</span>
                </div>
                <span className="text-xs text-gray-500">{loc.users.toLocaleString('en-IN')} Users</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6B1B3D, #9B2D5F)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
