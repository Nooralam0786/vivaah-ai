import type { ProfileViewTab } from '../types';

interface ProfileViewTabsProps {
  activeTab: ProfileViewTab;
  onTabChange: (tab: ProfileViewTab) => void;
}

const TAB_ORDER: ProfileViewTab[] = ['about', 'photos', 'insights'];

export default function ProfileViewTabs({ activeTab, onTabChange }: ProfileViewTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {TAB_ORDER.map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all capitalize ${
            activeTab === t
              ? 'bg-primary-gradient text-white shadow-sm'
              : 'bg-white border border-vivaah-border text-neutral-600 hover:border-primary-700/40'
          }`}
        >
          {t === 'insights' ? '📊 Match Insights' : t === 'photos' ? '📷 Photos' : '👤 About'}
        </button>
      ))}
    </div>
  );
}
