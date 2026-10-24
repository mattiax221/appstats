/** Domain models shared across adapters and UI. */

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'finished'
  | 'postponed'
  | 'cancelled'
  | 'unknown';

export interface TeamRef {
  id: string;
  name: string;
  shortName?: string;
  crestUrl?: string;
}

export interface Team extends TeamRef {
  competitionIds?: string[];
  founded?: number;
  venue?: string;
  country?: string;
}

export interface Match {
  id: string;
  competitionId: string;
  competitionName?: string;
  utcDate: string;
  status: MatchStatus;
  matchday?: number;
  home: TeamRef;
  away: TeamRef;
  score?: {
    home: number | null;
    away: number | null;
  };
  /** Provider-specific raw ids for cross-API matching later. */
  providerIds?: Partial<Record<'footballData' | 'apiFootball' | 'oddsApi', string>>;
}

export interface StandingRow {
  position: number;
  team: TeamRef;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface Standing {
  competitionId: string;
  competitionName?: string;
  season?: string;
  updatedAt?: string;
  table: StandingRow[];
}

export type OddsOutcome = 'home' | 'draw' | 'away';

export interface BookmakerOdds {
  bookmaker: string;
  lastUpdate?: string;
  /** Decimal odds for 1 / X / 2. */
  home: number;
  draw: number;
  away: number;
}

export interface MarketOdds {
  matchId: string;
  sportKey?: string;
  homeTeam?: string;
  awayTeam?: string;
  bookmakers: BookmakerOdds[];
  fetchedAt: string;
}
