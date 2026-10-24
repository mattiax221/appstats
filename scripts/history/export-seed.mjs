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

  /** Keep in sync with src/data/history/crests.ts (api-sports media). */
  const API = {
    genoa: 495,
    inter: 505,
    parma: 523,
    fiorentina: 502,
    empoli: 511,
    monza: 1579,
    milan: 489,
    torino: 503,
    bologna: 500,
    udinese: 494,
    verona: 504,
    napoli: 492,
    cagliari: 490,
    roma: 497,
    lazio: 487,
    venezia: 517,
    lecce: 867,
    atalanta: 499,
    juventus: 496,
    como: 895,
    frosinone: 512,
    salernitana: 514,
    sassuolo: 488,
    sampdoria: 498,
    cremonese: 520,
    spezia: 515,
    crotone: 508,
    benevento: 506,
    'manchester united': 33,
    fulham: 36,
    ipswich: 57,
    liverpool: 40,
    arsenal: 42,
    wolverhampton: 39,
    everton: 45,
    brighton: 51,
    'newcastle united': 34,
    southampton: 41,
    "nott'm forest": 65,
    bournemouth: 35,
    'west ham': 48,
    'aston villa': 66,
    brentford: 55,
    'crystal palace': 52,
    chelsea: 49,
    'manchester city': 50,
    leicester: 46,
    tottenham: 47,
    burnley: 44,
    luton: 1359,
    'sheffield utd': 62,
    leeds: 63,
    watford: 38,
    norwich: 71,
    'west brom': 60,
  };
  const keyOf = (n) =>
    String(n || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9']+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const seed = {
    version: 1,
    generatedAt: new Date().toISOString(),
    competitions: competitions.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      country: c.country,
    })),
    teams: teams.map((t) => {
      const api = API[keyOf(t.display_name)];
      return {
        id: t.id,
        name_key: t.name_key,
        display_name: t.display_name,
        crest_url: api
          ? `https://media.api-sports.io/football/teams/${api}.png`
          : t.crest_url,
      };
    }),
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
