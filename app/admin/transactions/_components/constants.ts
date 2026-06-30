export const TIER_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  free:     { label: 'Free',     color: 'text-gray-500',   bg: 'bg-gray-100',   icon: '⚪' },
  gold:     { label: 'Gold',     color: 'text-amber-600',  bg: 'bg-amber-50',   icon: '🥇' },
  platinum: { label: 'Platinum', color: 'text-blue-600',   bg: 'bg-blue-50',    icon: '💎' },
  diamond:  { label: 'Diamond',  color: 'text-[#6B1B3D]',  bg: 'bg-rose-50',    icon: '🔮' },
};

export const STATUS_TABS = [
  { key: '',            label: 'All'       },
  { key: 'active',      label: 'Active'    },
  { key: 'pending',     label: 'Pending'   },
  { key: 'cancelled',   label: 'Cancelled' },
  { key: 'failed',      label: 'Failed'    },
];
