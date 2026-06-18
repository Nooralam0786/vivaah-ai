import StatsCards from '@/components/dashboard/StatsCards';
import { AIRecommendedMatches } from '@/components/dashboard/MatchCard';
import ProfileStrength from '@/components/dashboard/ProfileStrength';
import FamilyConnect from '@/components/dashboard/FamilyConnect';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
            Welcome back, Rohan! 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">You have <span className="font-semibold text-primary-700">12 new matches</span> today</p>
        </div>
        <div className="flex gap-2">
          <a href="/profile"
            className="px-4 py-2 border border-primary-700 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors">
            Edit Profile
          </a>
          <a href="/discover"
            className="px-4 py-2 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Discover →
          </a>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* AI Matches */}
      <AIRecommendedMatches />

      {/* Profile Strength + Family Connect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <ProfileStrength />
        <FamilyConnect />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
