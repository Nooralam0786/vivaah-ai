'use client';

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
  bgColor: string;
}

const stats: StatCard[] = [
  { label: 'Profile Views', value: 128, change: '+23% this week', isPositive: true, icon: '👁️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'New Matches', value: 12, change: '+8% this week', isPositive: true, icon: '💕', color: 'text-primary-700', bgColor: 'bg-primary-50' },
  { label: 'Messages', value: 12, change: '+15% this week', isPositive: true, icon: '💬', color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Profile Strength', value: '85%', change: 'Excellent', isPositive: true, icon: '⚡', color: 'text-gold-600', bgColor: 'bg-amber-50', },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, i) => (
        <div key={stat.label}
          className="bg-white rounded-2xl p-4 md:p-5 border border-vivaah-border shadow-card hover:shadow-card-hover transition-all duration-200 group"
          style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200`}>
              {stat.icon}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {stat.isPositive ? '↑' : '↓'}
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-0.5">{stat.value}</div>
          <div className="text-xs text-neutral-500 font-medium">{stat.label}</div>
          <div className={`text-xs mt-1 font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {stat.change}
          </div>

          {/* Progress bar for Profile Strength */}
          {stat.label === 'Profile Strength' && (
            <div className="mt-2 h-1.5 bg-vivaah-border rounded-full overflow-hidden">
              <div className="h-full bg-gold-gradient rounded-full" style={{ width: '85%' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
