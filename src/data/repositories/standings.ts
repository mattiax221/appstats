import { cacheTtl } from '@/src/config/cache-ttl';
import { footballDataAdapter } from '@/src/data/adapters';
import type { Standing } from '@/src/domain';

export const standingsRepository = {
  staleTime: cacheTtl.standings,

  async getByCompetition(competitionId: string): Promise<Standing | null> {
    return footballDataAdapter.getStandings(competitionId);
  },
};
