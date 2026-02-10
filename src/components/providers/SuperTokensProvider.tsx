'use client';

import { useEffect, useState } from 'react';
import { initSuperTokens } from '@/lib/supertokens';

export function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initSuperTokens();
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return <>{children}</>;
}
