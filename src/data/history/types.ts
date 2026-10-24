export type HistoryMatchRow = {
  id: number;
  matchDate: string;
  season: string;
  competitionCode: string;
  competitionName: string;
  homeName: string;
  awayName: string;
  homeCrest: string | null;
  awayCrest: string | null;
  homeGoals: number;
  awayGoals: number;
  htHomeGoals: number | null;
  htAwayGoals: number | null;
};

/** Compact seed row from assets/history/seed.json */
export type HistorySeedMatch = [
  competitionId: number,
  season: string,
  matchDate: string,
  homeTeamId: number,
  awayTeamId: number,
  homeGoals: number,
  awayGoals: number,
  htHomeGoals: number | null,
  htAwayGoals: number | null,
  source: string,
  sourceMatchId: string,
];

export type HistorySeed = {
  version: number;
  generatedAt: string;
  competitions: Array<{ id: number; code: string; name: string; country: string | null }>;
  teams: Array<{
    id: number;
    name_key: string;
    display_name: string;
    crest_url: string | null;
  }>;
  matches: HistorySeedMatch[];
};

/** Minimal async SQLite surface used by CSV import on native. */
export type HistorySqlite = {
  runAsync: (
    sql: string,
    params?: unknown[],
  ) => Promise<{ changes: number; lastInsertRowId: number }>;
  getFirstAsync: <T>(sql: string, params?: unknown[]) => Promise<T | null>;
  execAsync: (sql: string) => Promise<void>;
};
