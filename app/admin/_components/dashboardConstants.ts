import { UserPlus, Star, Heart, IndianRupee, ShieldCheck, Zap } from 'lucide-react';

/* ─── Static supplemental data for the admin dashboard ─────────── */
export const MOCK_PREMIUM = [
  { name: 'Ananya Singh', email: 'ananya.singh@email.com', ago: '2 min ago',  online: true  },
  { name: 'Rohit Verma',  email: 'rohit.verma@email.com',  ago: '8 min ago',  online: false },
  { name: 'Neha Gupta',   email: 'neha.gupta@email.com',   ago: '15 min ago', online: true  },
  { name: 'Arjun Mehta',  email: 'arjun.mehta@email.com',  ago: '22 min ago', online: false },
  { name: 'Pooja Sharma', email: 'pooja.sharma@email.com', ago: '30 min ago', online: false },
];

export const MOCK_ACTIVITIES = [
  { Icon: UserPlus,     color: 'bg-blue-100 text-blue-600',    text: 'New user registered',      sub: 'Rahul Verma has joined VivaahAI',     ago: '2 min ago'  },
  { Icon: Star,         color: 'bg-amber-100 text-amber-600',  text: 'New premium subscription', sub: 'Neha Gupta upgraded to Premium Plan',  ago: '10 min ago' },
  { Icon: Heart,        color: 'bg-rose-100 text-rose-600',    text: 'New match created',        sub: 'Ananya & Rohit matched',               ago: '15 min ago' },
  { Icon: IndianRupee,  color: 'bg-green-100 text-green-600',  text: 'Payment received',         sub: '₹1,499 received from Arjun Mehta',    ago: '22 min ago' },
  { Icon: ShieldCheck,  color: 'bg-purple-100 text-purple-600',text: 'Profile verified',         sub: "Pooja Sharma's profile verified",       ago: '28 min ago' },
  { Icon: Zap,          color: 'bg-orange-100 text-orange-600',text: 'Blog post published',      sub: '"How AI is Transforming Matchmaking"',  ago: '35 min ago' },
];

export const MOCK_LOCATIONS = [
  { city: 'Delhi',     users: 8745 },
  { city: 'Mumbai',    users: 6242 },
  { city: 'Bangalore', users: 5320 },
  { city: 'Pune',      users: 3982 },
  { city: 'Hyderabad', users: 2845 },
];

export const SYSTEM_STATUS = [
  { label: 'Website Status',     desc: 'All systems operational'  },
  { label: 'AI Matching Engine', desc: 'Matching perfectly'       },
  { label: 'Payment Gateway',    desc: 'All transactions normal'  },
  { label: 'Email Service',      desc: 'All emails delivered'     },
  { label: 'Database',           desc: 'All systems normal'       },
];

export const FALLBACK_REVENUE_DATA = Array.from({ length: 7 }, (_, i) => ({
  label: `D${i + 1}`,
  count: [32, 45, 28, 61, 38, 55, 42][i],
}));

export const MATCH_BREAKDOWN = [
  { name: 'Successful',      pct: 12.0, color: '#10b981' },
  { name: 'In Conversation', pct: 38.1, color: '#6B1B3D' },
  { name: 'Meetings Fixed',  pct: 13.2, color: '#D4AF37' },
  { name: 'Marriages',       pct: 13.1, color: '#f59e0b' },
  { name: 'Not Interested',  pct: 23.5, color: '#e5e7eb' },
];

export const GENDER_COLORS = ['#6B1B3D', '#D4AF37', '#9ca3af'];
