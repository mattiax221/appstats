/** Minimal shapes from football-data.org v4 JSON. */

export type FdTeam = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
};

export type FdCompetition = {
  id: number;
  name: string;
  code?: string;
  emblem?: string;
};

export type FdScore = {
  fullTime?: { home: number | null; away: number | null };
  halfTime?: { home: number | null; away: number | null };
};

export type FdMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number | null;
  competition?: FdCompetition;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score?: FdScore;
};

export type FdMatchesResponse = {
  matches: FdMatch[];
};

export type FdStandingRow = {
  position: number;
  team: FdTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string | null;
};

export type FdStandingsResponse = {
  competition?: FdCompetition;
  season?: { startDate?: string; endDate?: string };
  standings: Array<{
    type: string;
    table: FdStandingRow[];
  }>;
};
