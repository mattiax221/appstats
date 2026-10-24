import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

import { cacheTtl } from '@/src/config/cache-ttl';

type Props = { children: ReactNode };

export function QueryProvider({ children }: Props) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: cacheTtl.fixtures,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
