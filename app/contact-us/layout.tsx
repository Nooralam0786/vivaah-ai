import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | VivaahAI',
  description: 'Get in touch with the VivaahAI team — reach out for support, partnership queries, or feedback about your matrimonial journey.',
};

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
