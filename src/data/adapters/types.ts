import type { MarketOdds, Match, Standing, Team } from '@/src/domain';

/** Contract every stats/odds adapter implements (stubs OK in P0). */
export interface FootballStatsAdapter {
  readonly name: string;
  getMatchesForDate(dateIso: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | null>;
  getTeam(id: string): Promise<Team | null>;
  getStandings(competitionId: string): Promise<Standing | null>;
}

export interface OddsAdapter {
  readonly name: string;
  getMarketOdds(matchId: string): Promise<MarketOdds | null>;
}
