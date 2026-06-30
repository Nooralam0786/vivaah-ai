import { TABS } from '../constants';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all
              ${activeTab === tab.id
                ? 'bg-[#7A0026] text-white shadow-sm'
                : 'text-neutral-500 hover:text-[#7A0026] hover:bg-[#7A0026]/5'}`}>
            <tab.icon className="w-4 h-4" />
            {tab.id}
          </button>
        ))}
      </div>
    </div>
  );
}
