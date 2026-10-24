import { cacheTtl } from '@/src/config/cache-ttl';
import { footballDataAdapter } from '@/src/data/adapters';
import type { Team } from '@/src/domain';

export const teamsRepository = {
  staleTime: cacheTtl.teams,

  async getById(id: string): Promise<Team | null> {
    return footballDataAdapter.getTeam(id);
  },
};
