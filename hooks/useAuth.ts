/**
 * Authentication Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthSession } from '@/types';
import { getAuthFromStorage, isAuthenticated } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const auth = getAuthFromStorage();
          if (auth) {
            // Fetch user profile
            const response = await fetch('/api/users/profile', {
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData.data);
              setSession({
                user: userData.data,
                accessToken: auth.accessToken,
                refreshToken: auth.refreshToken,
                expiresAt: new Date(auth.expiresAt),
              });
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Auth initialization failed'));
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('vivaah_auth');
  }, []);

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  };
}
