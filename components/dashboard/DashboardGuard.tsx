'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardNavbar from '@/components/dashboard/Navbar';

const ONBOARDING_ROUTES: Record<string, string> = {
  verify_otp: '/verify-otp',
  set_password: '/create-password',
  profile_wizard: '/profile-wizard',
  photo_upload: '/photo-upload',
};

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    // Redirect to onboarding if profile not complete
    const step = user?.onboardingStep;
    if (step && step !== 'complete' && ONBOARDING_ROUTES[step]) {
      router.replace(ONBOARDING_ROUTES[step]);
    }
  }, [isAuthenticated, isLoading, user, router]);

  /* Loading spinner */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-vivaah-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-700/20 border-t-primary-700 rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  /* Not authenticated or still in onboarding — redirect in progress, show nothing */
  if (!isAuthenticated) return null;
  if (user?.onboardingStep && user.onboardingStep !== 'complete') return null;

  /* Authenticated — render full dashboard shell */
  return (
    <div className="h-screen bg-vivaah-bg flex overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto pt-14">
          <div className="p-4 md:p-6 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
