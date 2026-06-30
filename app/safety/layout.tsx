import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety & Trust | VivaahAI',
  description: 'Discover how VivaahAI keeps your matrimonial journey safe — profile verification, privacy controls, and guidance for secure online introductions.',
};

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
