/**
 * Optional in-app CSV bootstrap (football-data.co.uk) into local history store.
 */

import { Platform } from 'react-native';

import * as historyDb from './db';

type League = { code: string; name: string; csv: string };

const LEAGUES: League[] = [
  { code: 'SA', name: 'Serie A', csv: 'I1' },
  { code: 'PL', name: 'Premier League', csv: 'E0' },
];

const SEASONS = ['2425', '2324'];

function nameKey(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitCsvLine(line: string) {
  const out: string[] = [];
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

function parseCsv(text: string) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [] as Record<string, string>[];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    return row;
  });
}

function toIsoDate(raw: string) {
  const m = String(raw || '')
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = Number(y) > 70 ? `19${y}` : `20${y}`;
  return `${y.padStart(4, '0')}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function seasonLabel(code: string) {
  return `20${code.slice(0, 2)}-${code.slice(2)}`;
}

async function fetchLeagueRows(league: League, season: string) {
  const url = `https://www.football-data.co.uk/mmz4281/${season}/${league.csv}.csv`;
  const res = await fetch(url);
  if (!res.ok) return [] as Record<string, string>[];
  const text = await res.text();
  if (text.includes('<html')) return [];
  return parseCsv(text);
}

async function importOnWeb(): Promise<number> {
  const store = historyDb.getWebStore();
  let inserted = 0;

  for (const league of LEAGUES) {
    let comp = store.competitions.find((c) => c.code === league.code);
    if (!comp) {
      comp = { id: store.seq.competition++, code: league.code, name: league.name };
      store.competitions.push(comp);
    }
    for (const season of SEASONS) {
      for (const r of await fetchLeagueRows(league, season)) {
        const home = r.HomeTeam;
        const away = r.AwayTeam;
        const dateIso = toIsoDate(r.Date);
        const hg = Number(r.FTHG);
        const ag = Number(r.FTAG);
        if (!home || !away || !dateIso || !Number.isFinite(hg) || !Number.isFinite(ag)) continue;

        const ensureTeam = (name: string) => {
          const key = nameKey(name);
          let t = store.teams.find((x) => x.name_key === key);
          if (!t) {
            t = {
              id: store.seq.team++,
              name_key: key,
              display_name: name.trim(),
              crest_url: null,
            };
            store.teams.push(t);
          }
          return t.id;
        };

        const homeId = ensureTeam(home);
        const awayId = ensureTeam(away);
        const sourceMatchId = `${league.csv}-${season}-${dateIso}-${home}-${away}`;
        if (store.matches.some((m) => m.source_match_id === sourceMatchId)) continue;

        store.matches.push({
          id: store.seq.match++,
          source: 'football-data-co-uk',
          source_match_id: sourceMatchId,
          competition_id: comp.id,
          season: seasonLabel(season),
          match_date: dateIso,
          home_team_id: homeId,
          away_team_id: awayId,
          home_goals: hg,
          away_goals: ag,
          ht_home_goals: r.HTHG === '' ? null : Number(r.HTHG),
          ht_away_goals: r.HTAG === '' ? null : Number(r.HTAG),
          status: 'finished',
        });
        inserted += 1;
      }
    }
  }

  store.meta.last_ingest_at = new Date().toISOString();
  historyDb.saveWebStore(store);
  return inserted;
}

async function importOnNative(): Promise<number> {
  const db = await historyDb.getNativeHistoryDb();
  let inserted = 0;

  for (const league of LEAGUES) {
    await db.runAsync(
      `INSERT INTO competitions (code, name) VALUES (?, ?)
       ON CONFLICT(code) DO UPDATE SET name = excluded.name`,
      [league.code, league.name],
    );
    const comp = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM competitions WHERE code = ?',
      [league.code],
    );
    if (!comp) continue;

    for (const season of SEASONS) {
      for (const r of await fetchLeagueRows(league, season)) {
        const home = r.HomeTeam;
        const away = r.AwayTeam;
        const dateIso = toIsoDate(r.Date);
        const hg = Number(r.FTHG);
        const ag = Number(r.FTAG);
        if (!home || !away || !dateIso || !Number.isFinite(hg) || !Number.isFinite(ag)) continue;

        const upsertTeam = async (name: string) => {
          const key = nameKey(name);
          await db.runAsync(
            `INSERT INTO teams (name_key, display_name) VALUES (?, ?)
             ON CONFLICT(name_key) DO UPDATE SET display_name = excluded.display_name`,
            [key, name.trim()],
          );
          const row = await db.getFirstAsync<{ id: number }>(
            'SELECT id FROM teams WHERE name_key = ?',
            [key],
          );
          return row!.id;
        };

        const homeId = await upsertTeam(home);
        const awayId = await upsertTeam(away);
        const sourceMatchId = `${league.csv}-${season}-${dateIso}-${home}-${away}`;
        const result = await db.runAsync(
          `INSERT INTO matches (
             source, source_match_id, competition_id, season, match_date,
             home_team_id, away_team_id, home_goals, away_goals,
             ht_home_goals, ht_away_goals, status
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'finished')
           ON CONFLICT DO NOTHING`,
          [
            'football-data-co-uk',
            sourceMatchId,
            comp.id,
            seasonLabel(season),
            dateIso,
            homeId,
            awayId,
            hg,
            ag,
            r.HTHG === '' ? null : Number(r.HTHG),
            r.HTAG === '' ? null : Number(r.HTAG),
          ],
        );
        if (result.changes > 0) inserted += 1;
      }
    }
  }

  await db.runAsync(
    `INSERT INTO meta (key, value) VALUES ('last_ingest_at', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [new Date().toISOString()],
  );
  return inserted;
}

export async function importCsvHistoryIntoApp(): Promise<{ inserted: number }> {
  const inserted = Platform.OS === 'web' ? await importOnWeb() : await importOnNative();
  return { inserted };
}
