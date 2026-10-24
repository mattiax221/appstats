/**
 * Recent finished matches from football-data.org (token required).
 * Slow / rate-limited (~10 req/min) — checkpoint by date window.
 */

import {
  getCheckpoint,
  insertFinishedMatch,
  setCheckpoint,
  upsertCompetition,
  upsertTeam,
} from './db.mjs';

function envToken() {
  return (
    process.env.FOOTBALL_DATA_TOKEN?.trim() ||
    process.env.EXPO_PUBLIC_FOOTBALL_DATA_TOKEN?.trim() ||
    process.env.EXPO_PUBLIC_FOOTBALL_DATA_API_KEY?.trim() ||
    ''
  );
}

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function seasonFromDate(isoDate) {
  const y = Number(isoDate.slice(0, 4));
  const m = Number(isoDate.slice(5, 7));
  // European season: Aug–May
  if (m >= 8) return `${y}-${String(y + 1).slice(2)}`;
  return `${y - 1}-${String(y).slice(2)}`;
}

export async function ingestFootballDataOrg(db) {
  const token = envToken();
  if (!token) {
    console.log('  [fd.org] no token — skip (set EXPO_PUBLIC_FOOTBALL_DATA_TOKEN in .env)');
    return { inserted: 0, skipped: 0 };
  }

  const base =
    process.env.EXPO_PUBLIC_FOOTBALL_DATA_BASE_URL ||
    'https://api.football-data.org/v4';
  let inserted = 0;
  let skipped = 0;

  // Last ~60 days of finished matches, 10-day windows to stay gentle.
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 60);

  const windows = [];
  for (let cursor = new Date(start); cursor < end; ) {
    const from = new Date(cursor);
    const to = new Date(cursor);
    to.setDate(to.getDate() + 9);
    if (to > end) to.setTime(end.getTime());
    windows.push({ from: iso(from), to: iso(to) });
    cursor.setDate(cursor.getDate() + 10);
  }

  for (const w of windows) {
    const cursorKey = `finished:${w.from}:${w.to}`;
    if (getCheckpoint(db, 'football-data-org', cursorKey) === 'done') {
      console.log(`  [fd.org] skip ${w.from}→${w.to}`);
      continue;
    }

    const url = `${base}/matches?competitions=SA,PL&status=FINISHED&dateFrom=${w.from}&dateTo=${w.to}`;
    console.log(`  [fd.org] ${w.from} → ${w.to}`);
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Auth-Token': token },
    });
    if (res.status === 429) {
      console.warn('  [fd.org] rate limited — stop this run (rerun later)');
      break;
    }
    if (!res.ok) {
      console.warn(`  [fd.org] ${res.status} — skip window`);
      await sleep(6500);
      continue;
    }
    const data = await res.json();
    for (const m of data.matches ?? []) {
      const hg = m.score?.fullTime?.home;
      const ag = m.score?.fullTime?.away;
      if (hg == null || ag == null) {
        skipped += 1;
        continue;
      }
      const code = m.competition?.code || 'UNK';
      const competitionId = upsertCompetition(
        db,
        code,
        m.competition?.name || code,
        null,
      );
      const homeId = upsertTeam(db, m.homeTeam?.name, {
        crestUrl: m.homeTeam?.crest || null,
      });
      const awayId = upsertTeam(db, m.awayTeam?.name, {
        crestUrl: m.awayTeam?.crest || null,
      });
      const matchDate = String(m.utcDate || '').slice(0, 10);
      const ok = insertFinishedMatch(db, {
        source: 'football-data-org',
        sourceMatchId: String(m.id),
        competitionId,
        season: seasonFromDate(matchDate),
        matchDate,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeGoals: hg,
        awayGoals: ag,
        htHomeGoals: m.score?.halfTime?.home ?? null,
        htAwayGoals: m.score?.halfTime?.away ?? null,
      });
      if (ok) inserted += 1;
      else skipped += 1;
    }

    setCheckpoint(db, 'football-data-org', cursorKey, 'done');
    await sleep(6500); // ~9 req/min headroom under free 10/min
  }

  return { inserted, skipped };
}
