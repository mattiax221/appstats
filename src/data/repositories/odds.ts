import { cacheTtl } from '@/src/config/cache-ttl';
import { oddsApiAdapter } from '@/src/data/adapters';
import type { MarketOdds } from '@/src/domain';

export const oddsRepository = {
  staleTime: cacheTtl.odds,

  async getForMatch(matchId: string): Promise<MarketOdds | null> {
    return oddsApiAdapter.getMarketOdds(matchId);
  },
};
