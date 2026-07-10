'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GamutProvider, theme } from '@codecademy/gamut-styles';
import { AppWrapper } from '@codecademy/gamut';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GamutProvider theme={theme}>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppWrapper>
    </GamutProvider>
  );
}
