import { getBundledSeed } from './seedAsset';
import type { HistoryMatchRow, HistorySeed, HistorySqlite } from './types';

export type WebStore = {
  competitions: Array<{ id: number; code: string; name: string }>;
  teams: Array<{ id: number; name_key: string; display_name: string; crest_url: string | null }>;
  matches: Array<{
    id: number;
    source: string;
    source_match_id: string;
    competition_id: number;
    season: string;
    match_date: string;
    home_team_id: number;
    away_team_id: number;
    home_goals: number;
    away_goals: number;
    ht_home_goals: number | null;
    ht_away_goals: number | null;
    status: string;
  }>;
  meta: Record<string, string>;
  seq: { competition: number; team: number; match: number };
};

function seedToStore(seed: HistorySeed): WebStore {
  const competitions = seed.competitions.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
  }));
  const teams = seed.teams.map((t) => ({
    id: t.id,
    name_key: t.name_key,
    display_name: t.display_name,
    crest_url: t.crest_url,
  }));
  const matches = seed.matches.map((row, i) => {
    const [
      competition_id,
      season,
      match_date,
      home_team_id,
      away_team_id,
      home_goals,
      away_goals,
      ht_home_goals,
      ht_away_goals,
      source,
      source_match_id,
    ] = row;
    return {
      id: i + 1,
      source,
      source_match_id,
      competition_id,
      season,
      match_date,
      home_team_id,
      away_team_id,
      home_goals,
      away_goals,
      ht_home_goals,
      ht_away_goals,
      status: 'finished',
    };
  });
  return {
    competitions,
    teams,
    matches,
    meta: {
      seeded_from: seed.generatedAt,
      seed_version: String(seed.version),
    },
    seq: {
      competition: Math.max(0, ...competitions.map((c) => c.id)) + 1,
      team: Math.max(0, ...teams.map((t) => t.id)) + 1,
      match: matches.length + 1,
    },
  };
}

/** In-memory store from bundled seed — no localStorage, available on first paint. */
let memoryStore: WebStore | null = null;

function store(): WebStore {
  if (!memoryStore) memoryStore = seedToStore(getBundledSeed());
  return memoryStore;
}

export function getWebStore(): WebStore {
  return store();
}

export function saveWebStore(next: WebStore) {
  memoryStore = next;
}

export async function getHistoryMatchCount(): Promise<number> {
  return store().matches.length;
}

export async function listRecentHistoryMatches(limit = 40): Promise<HistoryMatchRow[]> {
  const s = store();
  const teamById = new Map(s.teams.map((t) => [t.id, t]));
  const compById = new Map(s.competitions.map((c) => [c.id, c]));
  return [...s.matches]
    .sort((a, b) => b.match_date.localeCompare(a.match_date))
    .slice(0, limit)
    .map((m) => {
      const home = teamById.get(m.home_team_id);
      const away = teamById.get(m.away_team_id);
      const comp = compById.get(m.competition_id);
      return {
        id: m.id,
        matchDate: m.match_date,
        season: m.season,
        competitionCode: comp?.code ?? '',
        competitionName: comp?.name ?? '',
        homeName: home?.display_name ?? '?',
        awayName: away?.display_name ?? '?',
        homeCrest: home?.crest_url ?? null,
        awayCrest: away?.crest_url ?? null,
        homeGoals: m.home_goals,
        awayGoals: m.away_goals,
        htHomeGoals: m.ht_home_goals,
        htAwayGoals: m.ht_away_goals,
      };
    });
}

export async function getNativeHistoryDb(): Promise<HistorySqlite> {
  throw new Error('SQLite nativo non disponibile sul web');
}

export async function ensureHistoryReady(): Promise<void> {
  store();
}
