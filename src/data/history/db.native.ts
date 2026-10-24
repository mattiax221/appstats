import * as SQLite from 'expo-sqlite';

import type { HistoryMatchRow } from './types';

const DB_NAME = 'history.db';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getNativeDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS competitions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          country TEXT
        );
        CREATE TABLE IF NOT EXISTS teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name_key TEXT NOT NULL UNIQUE,
          display_name TEXT NOT NULL,
          crest_url TEXT
        );
        CREATE TABLE IF NOT EXISTS matches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source TEXT NOT NULL,
          source_match_id TEXT,
          competition_id INTEGER NOT NULL,
          season TEXT NOT NULL,
          match_date TEXT NOT NULL,
          home_team_id INTEGER NOT NULL,
          away_team_id INTEGER NOT NULL,
          home_goals INTEGER NOT NULL,
          away_goals INTEGER NOT NULL,
          ht_home_goals INTEGER,
          ht_away_goals INTEGER,
          status TEXT NOT NULL DEFAULT 'finished',
          UNIQUE (source, source_match_id),
          UNIQUE (competition_id, match_date, home_team_id, away_team_id)
        );
        CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date DESC);
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function getNativeHistoryDb(): Promise<import('./types').HistorySqlite> {
  return getNativeDb() as unknown as import('./types').HistorySqlite;
}

export async function getHistoryMatchCount(): Promise<number> {
  const db = await getNativeDb();
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM matches');
  return row?.n ?? 0;
}

export async function listRecentHistoryMatches(limit = 40): Promise<HistoryMatchRow[]> {
  const db = await getNativeDb();
  const rows = await db.getAllAsync<{
    id: number;
    match_date: string;
    season: string;
    home_goals: number;
    away_goals: number;
    ht_home_goals: number | null;
    ht_away_goals: number | null;
    competition_code: string;
    competition_name: string;
    home_name: string;
    away_name: string;
    home_crest: string | null;
    away_crest: string | null;
  }>(
    `SELECT m.id, m.match_date, m.season, m.home_goals, m.away_goals,
            m.ht_home_goals, m.ht_away_goals,
            c.code AS competition_code, c.name AS competition_name,
            th.display_name AS home_name, ta.display_name AS away_name,
            th.crest_url AS home_crest, ta.crest_url AS away_crest
     FROM matches m
     JOIN competitions c ON c.id = m.competition_id
     JOIN teams th ON th.id = m.home_team_id
     JOIN teams ta ON ta.id = m.away_team_id
     WHERE m.status = 'finished'
     ORDER BY m.match_date DESC
     LIMIT ?`,
    [limit],
  );

  return rows.map((r) => ({
    id: r.id,
    matchDate: r.match_date,
    season: r.season,
    competitionCode: r.competition_code,
    competitionName: r.competition_name,
    homeName: r.home_name,
    awayName: r.away_name,
    homeCrest: r.home_crest,
    awayCrest: r.away_crest,
    homeGoals: r.home_goals,
    awayGoals: r.away_goals,
    htHomeGoals: r.ht_home_goals,
    htAwayGoals: r.ht_away_goals,
  }));
}

/** Web-only helpers — stubs on native. */
export function getWebStore(): never {
  throw new Error('Web store non disponibile su native');
}

export function saveWebStore(): never {
  throw new Error('Web store non disponibile su native');
}
