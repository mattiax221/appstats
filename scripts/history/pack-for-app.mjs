#!/usr/bin/env node
/**
 * Copy data/history.sqlite → assets/databases/history.db for the Expo app.
 * Gitignored — never commit the filled DB.
 *
 * Windows:
 *   node scripts\history\pack-for-app.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DB_PATH } from './db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DEST_DIR = path.join(ROOT, 'assets', 'databases');
const DEST = path.join(DEST_DIR, 'history.db');
const META = path.join(DEST_DIR, 'history.meta.json');

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Missing ${DB_PATH}. Run: node scripts\\history\\ingest.mjs`);
    process.exit(1);
  }
  fs.mkdirSync(DEST_DIR, { recursive: true });
  fs.copyFileSync(DB_PATH, DEST);
  const stat = fs.statSync(DEST);
  const meta = {
    packedAt: new Date().toISOString(),
    bytes: stat.size,
    source: 'data/history.sqlite',
  };
  fs.writeFileSync(META, JSON.stringify(meta, null, 2));
  console.log(`Packed → ${DEST} (${stat.size} bytes)`);
  console.log('Restart Expo so the app can import the asset.');
}

main();
