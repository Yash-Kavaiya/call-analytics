'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthProviderProps {
  children: ReactNode;
}

function FirebaseSync({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // Sync with Firebase
      fetch('/api/auth/firebase-token', { method: 'POST' })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.token) {
            try {
              await signInWithCustomToken(auth, data.token);
              console.log('Firebase auth synced');
            } catch (error) {
              console.error('Firebase auth sync failed:', error);
            }
          }
        })
        .catch((err) => console.error('Token fetch failed:', err));
    } else {
      // Sign out of Firebase if not logged in
      signOut(auth);
    }
  }, [session, status]);

  return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <FirebaseSync>{children}</FirebaseSync>
    </SessionProvider>
  );
}
