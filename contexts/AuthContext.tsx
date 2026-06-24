'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAuthFromStorage, saveAuthToStorage, removeAuthFromStorage, isAuthenticated, getTokenExpirationTime } from '@/lib/auth';

/* ─── Types ─────────────────────────────────────────────────── */

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  photo?: string | null;
  subscriptionTier?: string;
  phoneVerified?: boolean;
  onboardingStep?: string;
  gender?: string;
  profileCompleteness?: number;
}

export interface LoginTokens {
  token: string;
  refreshToken: string;
  userId: string;
  expiresIn: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: LoginTokens) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/* ─── localStorage helpers ──────────────────────────────────── */

const USER_KEY = 'vivaah_user';

function readUserCache(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeUserCache(user: AuthUser) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch { /* ignore */ }
}

function clearUserCache() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(USER_KEY); } catch { /* ignore */ }
}

/* ─── Context ───────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Fetch fresh user data from API */
  const fetchProfile = useCallback(async (accessToken: string): Promise<AuthUser | null> => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data as AuthUser) ?? null;
    } catch {
      return null;
    }
  }, []);

  /* On mount — restore session from localStorage */
  useEffect(() => {
    const restore = async () => {
      try {
        const cached = readUserCache();
        if (cached) setUser(cached); // show cached immediately (no flash)

        if (isAuthenticated()) {
          const auth = getAuthFromStorage();
          if (auth) {
            const fresh = await fetchProfile(auth.accessToken);
            if (fresh) {
              setUser(fresh);
              writeUserCache(fresh);
            } else if (!cached) {
              // API unreachable AND no cache — wipe session
              removeAuthFromStorage();
              clearUserCache();
              setUser(null);
            }
            // If API fails but cache exists, keep cached user (offline-tolerant)
          }
        } else {
          setUser(null);
          clearUserCache();
        }
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, [fetchProfile]);

  /* Called after a successful login API response */
  const login = useCallback(async (tokens: LoginTokens) => {
    saveAuthToStorage({
      accessToken: tokens.token,
      refreshToken: tokens.refreshToken,
      userId: tokens.userId,
      expiresAt: getTokenExpirationTime(tokens.expiresIn / 3600),
    });

    const userData = await fetchProfile(tokens.token);
    if (userData) {
      setUser(userData);
      writeUserCache(userData);
    }
  }, [fetchProfile]);

  /* Refresh user data (call after profile update) */
  const refreshUser = useCallback(async () => {
    const auth = getAuthFromStorage();
    if (!auth) return;
    const userData = await fetchProfile(auth.accessToken);
    if (userData) {
      setUser(userData);
      writeUserCache(userData);
    }
  }, [fetchProfile]);

  /* Logout */
  const logout = useCallback(() => {
    setUser(null);
    removeAuthFromStorage();
    clearUserCache();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
