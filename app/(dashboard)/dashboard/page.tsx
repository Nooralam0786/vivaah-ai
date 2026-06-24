'use client';

import StatsCards from '@/components/dashboard/StatsCards';
import { AIRecommendedMatches } from '@/components/dashboard/MatchCard';
import ProfileStrength from '@/components/dashboard/ProfileStrength';
import FamilyConnect from '@/components/dashboard/FamilyConnect';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useAuth } from '@/hooks/useAuth';
import { UserRound } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Welcome Header — full width */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            You have <span className="font-semibold text-primary-700">12 new matches</span> today
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 items-center">
          <a href="/profile"
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors whitespace-nowrap">
            <UserRound size={15} className="text-neutral-500" />
            Edit Profile
          </a>
          <a href="/discover"
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
            Discover People →
          </a>
        </div>
      </div>

      {/* Stats Cards — full width */}
      <StatsCards />

      {/* 2-column: Main content + Right panel */}
      <div className="flex gap-5 items-start">

        {/* Left — main content */}
        <div className="flex-1 min-w-0 space-y-5">
          <AIRecommendedMatches />
          <RecentActivity />
        </div>

        {/* Right panel — Profile Strength + Family Connect */}
        <div className="hidden xl:flex flex-col gap-4 w-[300px] flex-shrink-0">
          <ProfileStrength />
          <FamilyConnect />
        </div>
      </div>

    </div>
  );
}
