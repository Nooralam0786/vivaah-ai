/**
 * Authentication Utilities
 */

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = 'vivaah_auth';

export function getAuthFromStorage(): StoredAuth | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const auth = JSON.parse(stored) as StoredAuth;

    // Check if token is expired
    if (auth.expiresAt < Date.now()) {
      removeAuthFromStorage();
      return null;
    }

    return auth;
  } catch (error) {
    console.error('Failed to parse stored auth:', error);
    return null;
  }
}

export function saveAuthToStorage(auth: StoredAuth) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error('Failed to save auth:', error);
  }
}

export function removeAuthFromStorage() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove auth:', error);
  }
}

export function isTokenExpired(expiresAt: number): boolean {
  return expiresAt < Date.now();
}

export function getTokenExpirationTime(hoursFromNow = 24): number {
  return Date.now() + hoursFromNow * 60 * 60 * 1000;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const auth = getAuthFromStorage();
  return auth !== null && !isTokenExpired(auth.expiresAt);
}
