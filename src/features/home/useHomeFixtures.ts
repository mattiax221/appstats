import { useQuery } from '@tanstack/react-query';

import { hasFootballDataKey } from '@/src/config/env';
import { matchesRepository } from '@/src/data/repositories';

export function useHomeFixtures() {
  const enabled = hasFootballDataKey();

  return useQuery({
    queryKey: ['fixtures', 'upcoming', 7],
    queryFn: () => matchesRepository.listUpcoming(7),
    enabled,
    staleTime: matchesRepository.staleTime,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
