import { env, hasFootballDataKey } from '@/src/config/env';
import type { Match, Standing, Team } from '@/src/domain';

import type { FootballStatsAdapter } from './types';

/**
 * Adapter for https://www.football-data.org/
 * Stubbed until P1 wires real fixtures. Requires EXPO_PUBLIC_FOOTBALL_DATA_API_KEY.
 */
export class FootballDataAdapter implements FootballStatsAdapter {
  readonly name = 'football-data.org';

  private headers(): HeadersInit {
    return {
      Accept: 'application/json',
      'X-Auth-Token': env.footballDataApiKey,
    };
  }

  async getMatchesForDate(_dateIso: string): Promise<Match[]> {
    if (!hasFootballDataKey()) {
      return [];
    }
    // P1: GET /matches?dateFrom=&dateTo=
    void env.footballDataBaseUrl;
    void this.headers;
    return [];
  }

  async getMatch(_id: string): Promise<Match | null> {
    if (!hasFootballDataKey()) return null;
    return null;
  }

  async getTeam(_id: string): Promise<Team | null> {
    if (!hasFootballDataKey()) return null;
    return null;
  }

  async getStandings(_competitionId: string): Promise<Standing | null> {
    if (!hasFootballDataKey()) return null;
    return null;
  }
}

export const footballDataAdapter = new FootballDataAdapter();
