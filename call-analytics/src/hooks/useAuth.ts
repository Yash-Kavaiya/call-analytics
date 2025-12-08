'use client';

import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user as SessionUser | undefined,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    status,
  };
}
