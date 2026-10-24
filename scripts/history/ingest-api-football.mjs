/**
 * Optional tiny batch from API-Football (api-sports). Skipped if no key.
 * Free tier is tiny — one recent finished-fixtures page for SA + PL.
 */

import {
  getCheckpoint,
  insertFinishedMatch,
  setCheckpoint,
  upsertCompetition,
  upsertTeam,
} from './db.mjs';

function envKey() {
  return (
    process.env.API_FOOTBALL_KEY?.trim() ||
    process.env.EXPO_PUBLIC_API_FOOTBALL_API_KEY?.trim() ||
    process.env.EXPO_PUBLIC_API_FOOTBALL_KEY?.trim() ||
    ''
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const LEAGUES = [
  { apiId: 135, code: 'SA', name: 'Serie A' },
  { apiId: 39, code: 'PL', name: 'Premier League' },
];

export async function ingestApiFootball(db) {
  const key = envKey();
  if (!key) {
    console.log('  [api-football] no key — skip');
    return { inserted: 0, skipped: 0 };
  }

  const season = new Date().getFullYear(); // calendar year; API uses season start year
  const seasonStart = new Date().getMonth() >= 7 ? season : season - 1;
  let inserted = 0;
  let skipped = 0;

  const base =
    process.env.EXPO_PUBLIC_API_FOOTBALL_BASE_URL ||
    'https://v3.football.api-sports.io';

  for (const league of LEAGUES) {
    const cursorKey = `finished:${league.apiId}:${seasonStart}`;
    if (getCheckpoint(db, 'api-football', cursorKey) === 'done') {
      console.log(`  [api-football] skip ${league.code} (checkpoint)`);
      continue;
    }

    const url = `${base}/fixtures?league=${league.apiId}&season=${seasonStart}&status=FT&last=20`;
    console.log(`  [api-football] ${league.code} last 20 FT`);
    const res = await fetch(url, {
      headers: { 'x-apisports-key': key },
    });
    if (!res.ok) {
      console.warn(`  [api-football] ${res.status} — skip ${league.code}`);
      await sleep(2000);
      continue;
    }
    const data = await res.json();
    const competitionId = upsertCompetition(db, league.code, league.name, null);
    for (const item of data.response ?? []) {
      const fx = item.fixture;
      const goals = item.goals;
      const teams = item.teams;
      if (goals?.home == null || goals?.away == null) {
        skipped += 1;
        continue;
      }
      const matchDate = String(fx?.date || '').slice(0, 10);
      const homeId = upsertTeam(db, teams?.home?.name, {
        crestUrl: teams?.home?.logo || null,
      });
      const awayId = upsertTeam(db, teams?.away?.name, {
        crestUrl: teams?.away?.logo || null,
      });
      const ok = insertFinishedMatch(db, {
        source: 'api-football',
        sourceMatchId: String(fx?.id ?? `${league.code}-${matchDate}-${teams?.home?.id}`),
        competitionId,
        season: `${seasonStart}-${String(seasonStart + 1).slice(2)}`,
        matchDate,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeGoals: goals.home,
        awayGoals: goals.away,
        htHomeGoals: item.score?.halftime?.home ?? null,
        htAwayGoals: item.score?.halftime?.away ?? null,
      });

      // Scorer counts when available (events)
      if (ok && Array.isArray(item.events)) {
        const matchRow = db
          .prepare(
            `SELECT id FROM matches WHERE source = ? AND source_match_id = ?`,
          )
          .get('api-football', String(fx.id));
        if (matchRow) {
          for (const ev of item.events) {
            if (ev.type !== 'Goal') continue;
            db.prepare(
              `INSERT INTO goal_events (match_id, player_name, minute, is_home)
               VALUES (?, ?, ?, ?)`,
            ).run(
              matchRow.id,
              ev.player?.name || null,
              ev.time?.elapsed ?? null,
              ev.team?.id === teams?.home?.id ? 1 : 0,
            );
          }
        }
      }

      if (ok) inserted += 1;
      else skipped += 1;
    }

    setCheckpoint(db, 'api-football', cursorKey, 'done');
    await sleep(2000);
  }

  return { inserted, skipped };
}
