import type { Metadata } from 'next';
import DashboardGuard from '@/components/dashboard/DashboardGuard';

export const metadata: Metadata = {
  title: 'VivaahAI Dashboard',
  description: 'Manage your matrimonial profile and discover matches',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
