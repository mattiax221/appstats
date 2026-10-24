import { cacheTtl } from '@/src/config/cache-ttl';
import { footballDataAdapter } from '@/src/data/adapters';
import type { Match } from '@/src/domain';

export const matchesRepository = {
  staleTime: cacheTtl.fixtures,

  async listForDate(dateIso: string): Promise<Match[]> {
    return footballDataAdapter.getMatchesForDate(dateIso);
  },

  async listUpcoming(daysAhead = 7): Promise<Match[]> {
    return footballDataAdapter.getUpcomingMatches(daysAhead);
  },

  async getById(id: string): Promise<Match | null> {
    return footballDataAdapter.getMatch(id);
  },
};
