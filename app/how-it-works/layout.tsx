import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | VivaahAI',
  description: 'See how VivaahAI matches you with compatible partners step by step — from verified profile creation to AI-powered recommendations and secure messaging.',
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
