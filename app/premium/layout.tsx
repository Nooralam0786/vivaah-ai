import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Membership | VivaahAI',
  description: 'Unlock premium features on VivaahAI — get more visibility, better matches, and faster connections with a premium membership plan.',
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
