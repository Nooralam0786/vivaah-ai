'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0]">
        <div className="w-10 h-10 border-4 border-[#7A0026]/20 border-t-[#7A0026] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
