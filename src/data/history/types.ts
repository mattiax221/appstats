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

/** Minimal async SQLite surface used by CSV import on native. */
export type HistorySqlite = {
  runAsync: (
    sql: string,
    params?: unknown[],
  ) => Promise<{ changes: number; lastInsertRowId: number }>;
  getFirstAsync: <T>(sql: string, params?: unknown[]) => Promise<T | null>;
};
