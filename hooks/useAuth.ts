/**
 * Re-export useAuth from AuthContext so all components import from one place.
 */
export { useAuth } from '@/contexts/AuthContext';
export type { AuthUser, LoginTokens } from '@/contexts/AuthContext';
