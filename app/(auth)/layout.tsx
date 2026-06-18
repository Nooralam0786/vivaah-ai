import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VivaahAI - Login & Register',
  description: 'Sign in or create your VivaahAI account to find your perfect match',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-vivaah-bg">
      {children}
    </div>
  );
}
