import { env, hasOddsApiKey } from '@/src/config/env';
import type { MarketOdds } from '@/src/domain';

import type { OddsAdapter } from './types';

/**
 * Adapter for https://the-odds-api.com/ (free ~500 req/month).
 * Load only on Predizioni / match focus — never global polling.
 */
export class OddsApiAdapter implements OddsAdapter {
  readonly name = 'the-odds-api';

  async getMarketOdds(_matchId: string): Promise<MarketOdds | null> {
    if (!hasOddsApiKey()) return null;
    void env.oddsApiBaseUrl;
    return null;
  }
}

export const oddsApiAdapter = new OddsApiAdapter();
