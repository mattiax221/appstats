import { resolveLeagueBadge, resolveTeamCrest } from './crests';
import { getBundledSeed } from './seedAsset';
import type { HistoryMatchRow, HistorySeed, HistorySeedMatch } from './types';

export type HistoryTeam = {
  id: number;
  nameKey: string;
  name: string;
  crestUrl: string | null;
};

export type HistoryCompetition = {
  id: number;
  code: string;
  name: string;
};

export type CatalogMatch = {
  id: number;
  competitionId: number;
  season: string;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
  homeGoals: number;
  awayGoals: number;
  htHomeGoals: number | null;
  htAwayGoals: number | null;
  source: string;
  sourceMatchId: string;
};

export type TeamSeasonStats = {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: Array<'V' | 'N' | 'P'>;
};

export type H2HSummary = {
  played: number;
  teamAWins: number;
  draws: number;
  teamBWins: number;
  matches: CatalogMatch[];
};

type Catalog = {
  seed: HistorySeed;
  teams: Map<number, HistoryTeam>;
  competitions: Map<number, HistoryCompetition>;
  matches: CatalogMatch[];
  byTeam: Map<number, CatalogMatch[]>;
};

let catalog: Catalog | null = null;

function build(): Catalog {
  const seed = getBundledSeed();
  const teams = new Map<number, HistoryTeam>();
  for (const t of seed.teams) {
    teams.set(t.id, {
      id: t.id,
      nameKey: t.name_key,
      name: t.display_name,
      crestUrl: resolveTeamCrest(t.display_name, t.crest_url),
    });
  }
  const competitions = new Map<number, HistoryCompetition>();
  for (const c of seed.competitions) {
    competitions.set(c.id, { id: c.id, code: c.code, name: c.name });
  }
  const matches: CatalogMatch[] = seed.matches.map((row: HistorySeedMatch, i) => {
    const [
      competitionId,
      season,
      matchDate,
      homeTeamId,
      awayTeamId,
      homeGoals,
      awayGoals,
      htHomeGoals,
      htAwayGoals,
      source,
      sourceMatchId,
    ] = row;
    return {
      id: i + 1,
      competitionId,
      season,
      matchDate,
      homeTeamId,
      awayTeamId,
      homeGoals,
      awayGoals,
      htHomeGoals,
      htAwayGoals,
      source,
      sourceMatchId,
    };
  });
  const byTeam = new Map<number, CatalogMatch[]>();
  for (const m of matches) {
    if (!byTeam.has(m.homeTeamId)) byTeam.set(m.homeTeamId, []);
    if (!byTeam.has(m.awayTeamId)) byTeam.set(m.awayTeamId, []);
    byTeam.get(m.homeTeamId)!.push(m);
    byTeam.get(m.awayTeamId)!.push(m);
  }
  for (const list of byTeam.values()) {
    list.sort((a, b) => b.matchDate.localeCompare(a.matchDate));
  }
  return { seed, teams, competitions, matches, byTeam };
}

export function getCatalog(): Catalog {
  if (!catalog) catalog = build();
  return catalog;
}

export function toHistoryRow(m: CatalogMatch): HistoryMatchRow {
  const c = getCatalog();
  const home = c.teams.get(m.homeTeamId);
  const away = c.teams.get(m.awayTeamId);
  const comp = c.competitions.get(m.competitionId);
  return {
    id: m.id,
    matchDate: m.matchDate,
    season: m.season,
    competitionCode: comp?.code ?? '',
    competitionName: comp?.name ?? '',
    homeName: home?.name ?? '?',
    awayName: away?.name ?? '?',
    homeCrest: home?.crestUrl ?? null,
    awayCrest: away?.crestUrl ?? null,
    homeGoals: m.homeGoals,
    awayGoals: m.awayGoals,
    htHomeGoals: m.htHomeGoals,
    htAwayGoals: m.htAwayGoals,
  };
}

export function listTeams(): HistoryTeam[] {
  return [...getCatalog().teams.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTeam(id: number): HistoryTeam | null {
  return getCatalog().teams.get(id) ?? null;
}

export function findTeamByNameKey(key: string): HistoryTeam | null {
  const k = key.trim().toLowerCase();
  for (const t of getCatalog().teams.values()) {
    if (t.nameKey === k || String(t.id) === k) return t;
  }
  return null;
}

export function getMatch(id: number): CatalogMatch | null {
  return getCatalog().matches.find((m) => m.id === id) ?? null;
}

export function listRecentMatches(limit = 40): HistoryMatchRow[] {
  return [...getCatalog().matches]
    .sort((a, b) => b.matchDate.localeCompare(a.matchDate))
    .slice(0, limit)
    .map(toHistoryRow);
}

export function listTeamMatches(teamId: number, limit = 20): HistoryMatchRow[] {
  return (getCatalog().byTeam.get(teamId) ?? []).slice(0, limit).map(toHistoryRow);
}

export function getTeamStats(teamId: number, lastN = 10): TeamSeasonStats {
  const recent = (getCatalog().byTeam.get(teamId) ?? []).slice(0, lastN);
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  const form: Array<'V' | 'N' | 'P'> = [];
  for (const m of recent) {
    const isHome = m.homeTeamId === teamId;
    const gf = isHome ? m.homeGoals : m.awayGoals;
    const ga = isHome ? m.awayGoals : m.homeGoals;
    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) {
      wins += 1;
      form.push('V');
    } else if (gf === ga) {
      draws += 1;
      form.push('N');
    } else {
      losses += 1;
      form.push('P');
    }
  }
  return {
    played: recent.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    form,
  };
}

export function getH2H(teamAId: number, teamBId: number, limit = 12): H2HSummary {
  const matches = getCatalog()
    .matches.filter(
      (m) =>
        (m.homeTeamId === teamAId && m.awayTeamId === teamBId) ||
        (m.homeTeamId === teamBId && m.awayTeamId === teamAId),
    )
    .sort((a, b) => b.matchDate.localeCompare(a.matchDate))
    .slice(0, limit);

  let teamAWins = 0;
  let draws = 0;
  let teamBWins = 0;
  for (const m of matches) {
    if (m.homeGoals === m.awayGoals) {
      draws += 1;
      continue;
    }
    const homeWon = m.homeGoals > m.awayGoals;
    const aIsHome = m.homeTeamId === teamAId;
    if ((homeWon && aIsHome) || (!homeWon && !aIsHome)) teamAWins += 1;
    else teamBWins += 1;
  }
  return { played: matches.length, teamAWins, draws, teamBWins, matches };
}

export function listCompetitions(): HistoryCompetition[] {
  return [...getCatalog().competitions.values()];
}

export function competitionBadgeUrl(code: string): string | null {
  return resolveLeagueBadge(code);
}

export function parseHistoryMatchParam(id: string | undefined): number | null {
  if (!id) return null;
  const raw = id.startsWith('h-') ? id.slice(2) : id;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function parseTeamParam(id: string | undefined): number | null {
  if (!id) return null;
  const n = Number(id);
  if (Number.isFinite(n)) return n;
  return findTeamByNameKey(id)?.id ?? null;
}
