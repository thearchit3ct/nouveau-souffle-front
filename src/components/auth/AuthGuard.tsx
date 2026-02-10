'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Session from 'supertokens-auth-react/recipe/session';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const exists = await Session.doesSessionExist();
        if (!exists) {
          router.replace('/auth/login');
          return;
        }
        setAuthenticated(true);
      } catch {
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
