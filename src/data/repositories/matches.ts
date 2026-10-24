import { cacheTtl } from '@/src/config/cache-ttl';
import { footballDataAdapter } from '@/src/data/adapters';
import type { Match } from '@/src/domain';

/** Repository: fixtures via football-data.org (primary calendar source). */
export const matchesRepository = {
  staleTime: cacheTtl.fixtures,

  async listForDate(dateIso: string): Promise<Match[]> {
    return footballDataAdapter.getMatchesForDate(dateIso);
  },

  async getById(id: string): Promise<Match | null> {
    return footballDataAdapter.getMatch(id);
  },
};
