import type { HistoryMatchRow } from './types';

const WEB_KEY = 'appstats.history.v1';

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

function emptyWebStore(): WebStore {
  return {
    competitions: [],
    teams: [],
    matches: [],
    meta: {},
    seq: { competition: 1, team: 1, match: 1 },
  };
}

export function getWebStore(): WebStore {
  if (typeof localStorage === 'undefined') return emptyWebStore();
  try {
    const raw = localStorage.getItem(WEB_KEY);
    if (!raw) return emptyWebStore();
    return JSON.parse(raw) as WebStore;
  } catch {
    return emptyWebStore();
  }
}

export function saveWebStore(store: WebStore) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(WEB_KEY, JSON.stringify(store));
}

export async function getHistoryMatchCount(): Promise<number> {
  return getWebStore().matches.length;
}

export async function listRecentHistoryMatches(limit = 40): Promise<HistoryMatchRow[]> {
  const store = getWebStore();
  const teamById = new Map(store.teams.map((t) => [t.id, t]));
  const compById = new Map(store.competitions.map((c) => [c.id, c]));
  return [...store.matches]
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

export async function getNativeHistoryDb(): Promise<import('./types').HistorySqlite> {
  throw new Error('SQLite nativo non disponibile sul web');
}
