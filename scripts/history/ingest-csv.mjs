/**
 * Primary backfill: football-data.co.uk historical CSVs (no API key).
 * Docs: https://www.football-data.co.uk/data.php
 */

import {
  getCheckpoint,
  insertFinishedMatch,
  setCheckpoint,
  upsertCompetition,
  upsertTeam,
} from './db.mjs';

const LEAGUES = [
  { code: 'SA', name: 'Serie A', country: 'Italy', csv: 'I1' },
  { code: 'PL', name: 'Premier League', country: 'England', csv: 'E0' },
];

/** Season folder codes on football-data.co.uk (e.g. 2425 = 2024/25). */
const DEFAULT_SEASONS = ['2425', '2324', '2223', '2122', '2021'];

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    return row;
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (c === ',' && !inQ) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** CSV dates are usually DD/MM/YYYY or DD/MM/YY. */
function toIsoDate(raw) {
  const s = String(raw || '').trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = Number(y) > 70 ? `19${y}` : `20${y}`;
  return `${y.padStart(4, '0')}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function seasonLabel(code) {
  // 2425 → 2024-25
  if (code.length === 4) return `20${code.slice(0, 2)}-${code.slice(2)}`;
  return code;
}

function intOrNull(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function ingestCsv(db, { seasons = DEFAULT_SEASONS } = {}) {
  let inserted = 0;
  let skipped = 0;

  for (const league of LEAGUES) {
    const competitionId = upsertCompetition(db, league.code, league.name, league.country);

    for (const season of seasons) {
      const cursorKey = `${league.csv}:${season}`;
      if (getCheckpoint(db, 'football-data-co-uk', cursorKey) === 'done') {
        console.log(`  [csv] skip ${league.code} ${season} (checkpoint)`);
        continue;
      }

      const url = `https://www.football-data.co.uk/mmz4281/${season}/${league.csv}.csv`;
      console.log(`  [csv] fetch ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  [csv] ${res.status} for ${url} — skip`);
        continue;
      }
      const text = await res.text();
      if (text.includes('<html') || text.includes('404')) {
        console.warn(`  [csv] not a CSV for ${url} — skip`);
        continue;
      }

      const rows = parseCsv(text);
      let seasonInserted = 0;
      for (const r of rows) {
        const home = r.HomeTeam || r.Home;
        const away = r.AwayTeam || r.Away;
        const dateIso = toIsoDate(r.Date);
        const hg = intOrNull(r.FTHG ?? r.HG);
        const ag = intOrNull(r.FTAG ?? r.AG);
        if (!home || !away || !dateIso || hg == null || ag == null) {
          skipped += 1;
          continue;
        }
        const homeId = upsertTeam(db, home);
        const awayId = upsertTeam(db, away);
        const sourceMatchId = `${league.csv}-${season}-${dateIso}-${home}-${away}`;
        const ok = insertFinishedMatch(db, {
          source: 'football-data-co-uk',
          sourceMatchId,
          competitionId,
          season: seasonLabel(season),
          matchDate: dateIso,
          homeTeamId: homeId,
          awayTeamId: awayId,
          homeGoals: hg,
          awayGoals: ag,
          htHomeGoals: intOrNull(r.HTHG),
          htAwayGoals: intOrNull(r.HTAG),
        });
        if (ok) {
          inserted += 1;
          seasonInserted += 1;
        } else {
          skipped += 1;
        }
      }

      setCheckpoint(db, 'football-data-co-uk', cursorKey, 'done');
      console.log(`  [csv] ${league.code} ${season}: +${seasonInserted}`);
    }
  }

  return { inserted, skipped };
}
