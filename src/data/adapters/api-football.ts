import { env, hasApiFootballKey } from '@/src/config/env';
import type { Match, Standing, Team } from '@/src/domain';

import type { FootballStatsAdapter } from './types';

/**
 * Adapter for API-Football (api-sports / RapidAPI free tier).
 * Used later for match depth (events, lineups, player stats). Stub in P0.
 */
export class ApiFootballAdapter implements FootballStatsAdapter {
  readonly name = 'api-football';

  private headers(): HeadersInit {
    return {
      Accept: 'application/json',
      'x-apisports-key': env.apiFootballApiKey,
    };
  }

  async getMatchesForDate(_dateIso: string): Promise<Match[]> {
    if (!hasApiFootballKey()) return [];
    void env.apiFootballBaseUrl;
    void this.headers;
    return [];
  }

  async getMatch(_id: string): Promise<Match | null> {
    if (!hasApiFootballKey()) return null;
    return null;
  }

  async getTeam(_id: string): Promise<Team | null> {
    if (!hasApiFootballKey()) return null;
    return null;
  }

  async getStandings(_competitionId: string): Promise<Standing | null> {
    if (!hasApiFootballKey()) return null;
    return null;
  }
}

export const apiFootballAdapter = new ApiFootballAdapter();
