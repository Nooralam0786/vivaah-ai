import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | VivaahAI',
  description: 'Learn about VivaahAI — where AI-powered matching meets the trust and tradition of Indian matrimony, helping you find a verified, compatible life partner.',
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
