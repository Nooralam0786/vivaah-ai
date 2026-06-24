'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Renders as a <button> styled like a link/CTA.
 * Logged-in  → /dashboard
 * Logged-out → /signup
 */
export default function SmartSignupLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    onClick?.();
    router.push(isAuthenticated ? '/dashboard' : '/signup');
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
