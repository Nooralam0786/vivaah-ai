import { Flag, ShieldOff, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const REASON_LABEL: Record<string, { label: string; color: string }> = {
  harassment:            { label: 'Harassment',           color: 'text-red-600 bg-red-50 border-red-200'    },
  fake_profile:          { label: 'Fake Profile',         color: 'text-orange-600 bg-orange-50 border-orange-200' },
  spam:                  { label: 'Spam',                 color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  inappropriate_photos:  { label: 'Inappropriate Photos', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  scam:                  { label: 'Scam',                 color: 'text-rose-700 bg-rose-50 border-rose-200'  },
  other:                 { label: 'Other',                color: 'text-gray-600 bg-gray-100 border-gray-200' },
};

export const STATUS_TABS = [
  { key: '',          label: 'All',        Icon: Flag,         cls: 'text-gray-500'    },
  { key: 'pending',   label: 'Pending',    Icon: Clock,        cls: 'text-amber-500'   },
  { key: 'reviewed',  label: 'Reviewed',   Icon: CheckCircle2, cls: 'text-blue-500'    },
  { key: 'actioned',  label: 'Actioned',   Icon: ShieldOff,    cls: 'text-red-500'     },
  { key: 'dismissed', label: 'Dismissed',  Icon: XCircle,      cls: 'text-gray-400'    },
];
