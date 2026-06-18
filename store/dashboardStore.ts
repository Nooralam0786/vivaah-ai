'use client';

import { create } from 'zustand';

interface DashboardState {
  sidebarOpen: boolean;
  activeTab: string;
  notifications: number;
  messages: number;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setNotifications: (count: number) => void;
  setMessages: (count: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: true,
  activeTab: 'dashboard',
  notifications: 3,
  messages: 12,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setNotifications: (count) => set({ notifications: count }),
  setMessages: (count) => set({ messages: count }),
}));
