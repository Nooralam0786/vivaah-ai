import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories | VivaahAI',
  description: 'Real couples, real connections — read success stories from people who found their life partner through VivaahAI.',
};

export default function SuccessStoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
