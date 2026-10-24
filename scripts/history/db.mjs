import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import { canonicalName, nameKey } from './team-normalize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
export const DATA_DIR = path.join(ROOT, 'data');
export const DB_PATH = path.join(DATA_DIR, 'history.sqlite');
export const SCHEMA_PATH = path.join(ROOT, 'src/data/history/schema.sql');

export function openHistoryDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  return db;
}

export function getCheckpoint(db, source, cursorKey) {
  const row = db
    .prepare(
      'SELECT cursor_value FROM ingest_checkpoints WHERE source = ? AND cursor_key = ?',
    )
    .get(source, cursorKey);
  return row?.cursor_value ?? null;
}

export function setCheckpoint(db, source, cursorKey, cursorValue) {
  db.prepare(
    `INSERT INTO ingest_checkpoints (source, cursor_key, cursor_value, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(source, cursor_key) DO UPDATE SET
       cursor_value = excluded.cursor_value,
       updated_at = excluded.updated_at`,
  ).run(source, cursorKey, String(cursorValue), new Date().toISOString());
}

export function upsertCompetition(db, code, name, country = null) {
  db.prepare(
    `INSERT INTO competitions (code, name, country) VALUES (?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET name = excluded.name`,
  ).run(code, name, country);
  return db.prepare('SELECT id FROM competitions WHERE code = ?').get(code).id;
}

export function upsertTeam(db, rawName, { crestUrl = null } = {}) {
  const display = canonicalName(rawName);
  const key = nameKey(display);
  db.prepare(
    `INSERT INTO teams (name_key, display_name, crest_url) VALUES (?, ?, ?)
     ON CONFLICT(name_key) DO UPDATE SET
       display_name = excluded.display_name,
       crest_url = COALESCE(excluded.crest_url, teams.crest_url)`,
  ).run(key, display, crestUrl);
  const id = db.prepare('SELECT id FROM teams WHERE name_key = ?').get(key).id;
  for (const a of new Set([key, nameKey(rawName)].filter(Boolean))) {
    db.prepare(
      `INSERT INTO team_aliases (alias_key, team_id) VALUES (?, ?)
       ON CONFLICT(alias_key) DO UPDATE SET team_id = excluded.team_id`,
    ).run(a, id);
  }
  return id;
}

export function insertFinishedMatch(db, row) {
  const info = db
    .prepare(
      `INSERT INTO matches (
         source, source_match_id, competition_id, season, match_date,
         home_team_id, away_team_id, home_goals, away_goals,
         ht_home_goals, ht_away_goals, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'finished')
       ON CONFLICT DO NOTHING`,
    )
    .run(
      row.source,
      row.sourceMatchId,
      row.competitionId,
      row.season,
      row.matchDate,
      row.homeTeamId,
      row.awayTeamId,
      row.homeGoals,
      row.awayGoals,
      row.htHomeGoals ?? null,
      row.htAwayGoals ?? null,
    );
  return info.changes > 0;
}

export function countMatches(db) {
  return db.prepare('SELECT COUNT(*) AS n FROM matches').get().n;
}
