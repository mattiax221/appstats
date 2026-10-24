#!/usr/bin/env node
/**
 * Build / update the local historical SQLite DB (finished matches only).
 *
 * Windows (PowerShell / cmd from repo root):
 *   node scripts\history\ingest.mjs
 *   node scripts\history\pack-for-app.mjs
 *
 * Sources (checkpointed — safe to re-run):
 *   1) football-data.co.uk CSV (no key) — primary bulk
 *   2) football-data.org — needs EXPO_PUBLIC_FOOTBALL_DATA_TOKEN in .env
 *   3) API-Football — only if EXPO_PUBLIC_API_FOOTBALL_API_KEY set
 */

import { countMatches, DB_PATH, openHistoryDb } from './db.mjs';
import { ingestApiFootball } from './ingest-api-football.mjs';
import { ingestCsv } from './ingest-csv.mjs';
import { ingestFootballDataOrg } from './ingest-football-data-org.mjs';
import { loadDotEnv } from './load-env.mjs';

async function main() {
  loadDotEnv();
  console.log('AppStats history ingest');
  console.log(`DB → ${DB_PATH}`);

  const db = openHistoryDb();
  db.prepare(
    `INSERT INTO meta (key, value) VALUES ('schema_version', '1')
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run();

  console.log('\n[1/3] football-data.co.uk CSV…');
  const csv = await ingestCsv(db);
  console.log(`  inserted=${csv.inserted} skipped=${csv.skipped}`);

  console.log('\n[2/3] football-data.org…');
  const fd = await ingestFootballDataOrg(db);
  console.log(`  inserted=${fd.inserted} skipped=${fd.skipped}`);

  console.log('\n[3/3] API-Football…');
  const af = await ingestApiFootball(db);
  console.log(`  inserted=${af.inserted} skipped=${af.skipped}`);

  const total = countMatches(db);
  db.prepare(
    `INSERT INTO meta (key, value) VALUES ('last_ingest_at', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(new Date().toISOString());
  db.prepare(
    `INSERT INTO meta (key, value) VALUES ('match_count', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(String(total));

  console.log(`\nDone. matches in DB: ${total}`);
  console.log('Next (Windows): node scripts\\history\\pack-for-app.mjs');
  db.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
