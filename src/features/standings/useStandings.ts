import { useQuery } from '@tanstack/react-query';

import { hasFootballDataKey } from '@/src/config/env';
import { standingsRepository } from '@/src/data/repositories';

export function useStandings(competitionId: string) {
  const enabled = hasFootballDataKey() && Boolean(competitionId);

  return useQuery({
    queryKey: ['standings', competitionId],
    queryFn: () => standingsRepository.getByCompetition(competitionId),
    enabled,
    staleTime: standingsRepository.staleTime,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
