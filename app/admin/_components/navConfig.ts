import {
  LayoutDashboard, Users, User, ShieldCheck, UserX,
  Heart, MessageSquare, Zap, Eye, Flag,
  FileText, Star, Image, BookOpen, MessageCircle,
  CreditCard, ArrowRightLeft, Wallet, RotateCcw,
  TrendingUp, Settings, Shield, Activity,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem { href: string; label: string; Icon: LucideIcon }
export interface NavSection { title: string; items: NavItem[] }

export const NAV_TOP: NavItem[] = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'USER MANAGEMENT',
    items: [
      { href: '/admin/users',         label: 'Users',         Icon: Users      },
      { href: '/admin/profiles',      label: 'Profiles',      Icon: User       },
      { href: '/admin/verifications', label: 'Verifications', Icon: ShieldCheck},
      { href: '/admin/blocked',       label: 'Blocked Users', Icon: UserX      },
      { href: '/admin/reports',       label: 'Reports',       Icon: Flag       },
    ],
  },
  {
    title: 'MATCHES & ACTIVITY',
    items: [
      { href: '/admin/matches',   label: 'Matches',           Icon: Heart         },
      { href: '/admin/messages',  label: 'Messages',          Icon: MessageSquare },
      { href: '/admin/interests', label: 'Interest Received', Icon: Zap           },
      { href: '/admin/visitors',  label: 'Who Viewed Me',     Icon: Eye           },
    ],
  },
  {
    title: 'CONTENT MANAGEMENT',
    items: [
      { href: '/admin/blog',            label: 'Blog Posts',     Icon: FileText     },
      { href: '/admin/success-stories', label: 'Success Stories',Icon: Star         },
      { href: '/admin/banners',         label: 'Banners',        Icon: Image        },
      { href: '/admin/pages',           label: 'Pages',          Icon: BookOpen     },
      { href: '/admin/testimonials',    label: 'Testimonials',   Icon: MessageCircle},
    ],
  },
  {
    title: 'PAYMENTS & PLANS',
    items: [
      { href: '/admin/subscriptions',label: 'Plans & Pricing', Icon: CreditCard     },
      { href: '/admin/transactions', label: 'Transactions',    Icon: ArrowRightLeft },
      { href: '/admin/payouts',      label: 'Payouts',         Icon: Wallet         },
      { href: '/admin/refunds',      label: 'Refund Requests', Icon: RotateCcw      },
    ],
  },
  {
    title: 'SYSTEM & SETTINGS',
    items: [
      { href: '/admin/analytics', label: 'Reports & Analytics', Icon: TrendingUp },
      { href: '/admin/settings',  label: 'System Settings',     Icon: Settings   },
      { href: '/admin/admins',    label: 'Admin Management',    Icon: Shield     },
      { href: '/admin/logs',      label: 'Activity Logs',       Icon: Activity   },
    ],
  },
];

export const PATH_LABELS: Record<string, string> = {
  '/admin':                  'Dashboard',
  '/admin/users':            'Users',
  '/admin/profiles':         'Profiles',
  '/admin/verifications':    'Verifications',
  '/admin/blocked':          'Blocked Users',
  '/admin/matches':          'Matches',
  '/admin/messages':         'Messages',
  '/admin/interests':        'Interest Received',
  '/admin/visitors':         'Who Viewed Me',
  '/admin/blog':             'Blog Posts',
  '/admin/success-stories':  'Success Stories',
  '/admin/banners':          'Banners',
  '/admin/pages':            'Pages',
  '/admin/testimonials':     'Testimonials',
  '/admin/subscriptions':    'Plans & Pricing',
  '/admin/transactions':     'Transactions',
  '/admin/payouts':          'Payouts',
  '/admin/refunds':          'Refund Requests',
  '/admin/analytics':        'Reports & Analytics',
  '/admin/settings':         'System Settings',
  '/admin/admins':           'Admin Management',
  '/admin/logs':             'Activity Logs',
  '/admin/reports':          'User Reports',
};
