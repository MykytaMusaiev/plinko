'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/auth.store';

function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrateFromStorage);
  const done = useRef(false);

  useEffect(() => {
    if (!done.current) {
      done.current = true;
      hydrate();
    }
  }, [hydrate]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 30_000 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      {children}
      <Toaster
        theme="dark"
        richColors
        position="top-right"
        toastOptions={{ duration: 4000 }}
      />
    </QueryClientProvider>
  );
}