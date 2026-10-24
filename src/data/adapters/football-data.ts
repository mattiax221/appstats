import { env, hasFootballDataKey } from '@/src/config/env';
import type { Match, Standing, Team } from '@/src/domain';

import {
  dateRangeUpcoming,
  mapFdMatch,
  mapFdStandings,
  mapFdTeam,
} from './football-data-map';
import type {
  FdMatchesResponse,
  FdStandingsResponse,
} from './football-data-types';
import type { FootballStatsAdapter } from './types';

const DEFAULT_COMPETITIONS = 'SA,PL';

/**
 * Adapter for https://www.football-data.org/ v4.
 * Free tier ~10 req/min — callers must cache aggressively.
 */
export class FootballDataAdapter implements FootballStatsAdapter {
  readonly name = 'football-data.org';

  private headers(): HeadersInit {
    return {
      Accept: 'application/json',
      'X-Auth-Token': env.footballDataApiKey,
    };
  }

  private async getJson<T>(path: string): Promise<T> {
    if (!hasFootballDataKey()) {
      throw new Error('FOOTBALL_DATA_TOKEN_MISSING');
    }
    const url = `${env.footballDataBaseUrl}${path}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`football-data ${res.status}: ${body.slice(0, 160)}`);
    }
    return (await res.json()) as T;
  }

  async getMatchesForDate(dateIso: string): Promise<Match[]> {
    const day = dateIso.slice(0, 10);
    const data = await this.getJson<FdMatchesResponse>(
      `/matches?dateFrom=${day}&dateTo=${day}&competitions=${DEFAULT_COMPETITIONS}`,
    );
    return (data.matches ?? []).map(mapFdMatch);
  }

  /** Today → +N days across Serie A + Premier League. */
  async getUpcomingMatches(daysAhead = 7): Promise<Match[]> {
    const { from, to } = dateRangeUpcoming(daysAhead);
    const data = await this.getJson<FdMatchesResponse>(
      `/matches?dateFrom=${from}&dateTo=${to}&competitions=${DEFAULT_COMPETITIONS}`,
    );
    return (data.matches ?? []).map(mapFdMatch);
  }

  async getMatch(id: string): Promise<Match | null> {
    try {
      const data = await this.getJson<FdMatchLike>(`/matches/${id}`);
      return mapFdMatch(data);
    } catch {
      return null;
    }
  }

  async getTeam(id: string): Promise<Team | null> {
    try {
      const data = await this.getJson<{
        id: number;
        name: string;
        shortName?: string;
        tla?: string;
        crest?: string;
        founded?: number;
        venue?: string;
        area?: { name?: string };
      }>(`/teams/${id}`);
      return {
        ...mapFdTeam(data),
        founded: data.founded,
        venue: data.venue,
        country: data.area?.name,
      };
    } catch {
      return null;
    }
  }

  async getStandings(competitionId: string): Promise<Standing | null> {
    const code = competitionId.toUpperCase();
    const data = await this.getJson<FdStandingsResponse>(
      `/competitions/${code}/standings`,
    );
    const total = data.standings?.find((s) => s.type === 'TOTAL') ?? data.standings?.[0];
    if (!total?.table?.length) return null;
    return mapFdStandings(
      data.competition?.code ?? code,
      data.competition?.name,
      total.table,
    );
  }
}

type FdMatchLike = Parameters<typeof mapFdMatch>[0];

export const footballDataAdapter = new FootballDataAdapter();
