'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { NavItem } from './navConfig';

export default function NavLink({ href, label, Icon, active, collapsed }: NavItem & { active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
        active
          ? 'bg-[#6B1B3D] text-white shadow-sm'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      } ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon size={16} className={`flex-shrink-0 ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && active && <ChevronRight size={12} className="ml-auto opacity-60" />}
    </Link>
  );
}
