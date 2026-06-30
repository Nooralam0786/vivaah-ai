import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Relationship Advice | VivaahAI',
  description: 'Read VivaahAI\'s blog for relationship advice, matrimonial tips, and success stories to help you on your journey to finding the right life partner.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
