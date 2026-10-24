#!/usr/bin/env node
/**
 * Maintainer-only: export data/history.sqlite → assets/history/seed.json
 * (committed asset the app seeds on first launch).
 *
 *   node scripts/history/ingest.mjs
 *   node scripts/history/export-seed.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import { DB_PATH } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'assets', 'history', 'seed.json');

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Missing ${DB_PATH}. Run ingest first.`);
    process.exit(1);
  }
  const db = new DatabaseSync(DB_PATH);
  const competitions = db
    .prepare('SELECT id, code, name, country FROM competitions ORDER BY id')
    .all();
  const teams = db
    .prepare('SELECT id, name_key, display_name, crest_url FROM teams ORDER BY id')
    .all();
  const matches = db
    .prepare(
      `SELECT competition_id, season, match_date, home_team_id, away_team_id,
              home_goals, away_goals, ht_home_goals, ht_away_goals, source, source_match_id
       FROM matches WHERE status = 'finished' ORDER BY match_date, id`,
    )
    .all();

  const seed = {
    version: 1,
    generatedAt: new Date().toISOString(),
    competitions: competitions.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      country: c.country,
    })),
    teams: teams.map((t) => ({
      id: t.id,
      name_key: t.name_key,
      display_name: t.display_name,
      crest_url: t.crest_url,
    })),
    matches: matches.map((m) => [
      m.competition_id,
      m.season,
      m.match_date,
      m.home_team_id,
      m.away_team_id,
      m.home_goals,
      m.away_goals,
      m.ht_home_goals,
      m.ht_away_goals,
      m.source,
      m.source_match_id,
    ]),
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(seed));
  console.log(
    `Wrote ${OUT} (${fs.statSync(OUT).size} bytes, ${matches.length} matches)`,
  );
  db.close();
}

main();
