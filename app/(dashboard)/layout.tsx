import type { Metadata } from 'next';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardNavbar from '@/components/dashboard/Navbar';

export const metadata: Metadata = {
  title: 'VivaahAI Dashboard',
  description: 'Manage your matrimonial profile and discover matches',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-vivaah-bg flex overflow-hidden">
      {/* Sidebar — fixed, handled inside component */}
      <DashboardSidebar />

      {/* Right column: everything beside the sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 h-screen overflow-hidden">
        {/* Fixed navbar — 56px (h-14) tall */}
        <DashboardNavbar />

        {/* Main scrollable area — pt-14 clears the fixed navbar */}
        <main className="flex-1 overflow-y-auto pt-14">
          <div className="p-4 md:p-6 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
