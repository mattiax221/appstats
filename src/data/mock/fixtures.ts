import type { Match, TeamRef } from '@/src/domain';

/** api-sports media CDN — stable free crest URLs for demo IDs. */
export function crestUrl(apiSportsTeamId: number): string {
  return `https://media.api-sports.io/football/teams/${apiSportsTeamId}.png`;
}

export function leagueCrestUrl(apiSportsLeagueId: number): string {
  return `https://media.api-sports.io/football/leagues/${apiSportsLeagueId}.png`;
}

function team(
  id: string,
  name: string,
  shortName: string,
  apiId: number,
): TeamRef {
  return { id, name, shortName, crestUrl: crestUrl(apiId) };
}

export type UiMatch = Match & {
  liveMinute?: number;
  competitionCrestUrl?: string;
};

/** Realistic Serie A / PL placeholders with real crest URLs. */
export const mockFixtures: UiMatch[] = [
  {
    id: 'sa-int-mil',
    competitionId: 'SA',
    competitionName: 'Serie A',
    competitionCrestUrl: leagueCrestUrl(135),
    utcDate: '2026-10-24T18:45:00Z',
    status: 'live',
    matchday: 8,
    liveMinute: 67,
    home: team('inter', 'Inter', 'INT', 505),
    away: team('milan', 'Milan', 'MIL', 489),
    score: { home: 1, away: 1 },
  },
  {
    id: 'sa-juv-nap',
    competitionId: 'SA',
    competitionName: 'Serie A',
    competitionCrestUrl: leagueCrestUrl(135),
    utcDate: '2026-10-24T18:45:00Z',
    status: 'scheduled',
    matchday: 8,
    home: team('juve', 'Juventus', 'JUV', 496),
    away: team('napoli', 'Napoli', 'NAP', 492),
  },
  {
    id: 'sa-rom-laz',
    competitionId: 'SA',
    competitionName: 'Serie A',
    competitionCrestUrl: leagueCrestUrl(135),
    utcDate: '2026-10-24T20:45:00Z',
    status: 'scheduled',
    matchday: 8,
    home: team('roma', 'Roma', 'ROM', 497),
    away: team('lazio', 'Lazio', 'LAZ', 487),
  },
  {
    id: 'pl-ars-liv',
    competitionId: 'PL',
    competitionName: 'Premier League',
    competitionCrestUrl: leagueCrestUrl(39),
    utcDate: '2026-10-25T16:30:00Z',
    status: 'scheduled',
    matchday: 9,
    home: team('arsenal', 'Arsenal', 'ARS', 42),
    away: team('liverpool', 'Liverpool', 'LIV', 40),
  },
  {
    id: 'sa-fio-ata',
    competitionId: 'SA',
    competitionName: 'Serie A',
    competitionCrestUrl: leagueCrestUrl(135),
    utcDate: '2026-10-25T13:00:00Z',
    status: 'scheduled',
    matchday: 8,
    home: team('fiorentina', 'Fiorentina', 'FIO', 502),
    away: team('atalanta', 'Atalanta', 'ATA', 499),
  },
];

export type MockMarket = {
  matchId: string;
  homeId: string;
  awayId: string;
  home: string;
  away: string;
  homeCrest: string;
  awayCrest: string;
  competition: string;
  competitionCrestUrl: string;
  kickoffLabel: string;
  consensus: { home: number; draw: number; away: number };
  odds: { home: number; draw: number; away: number };
};

export const mockMarkets: MockMarket[] = [
  {
    matchId: 'sa-juv-nap',
    homeId: 'juve',
    awayId: 'napoli',
    home: 'Juventus',
    away: 'Napoli',
    homeCrest: crestUrl(496),
    awayCrest: crestUrl(492),
    competition: 'Serie A · Giornata 8',
    competitionCrestUrl: leagueCrestUrl(135),
    kickoffLabel: 'Oggi · 20:45',
    consensus: { home: 0.38, draw: 0.28, away: 0.34 },
    odds: { home: 2.45, draw: 3.2, away: 2.9 },
  },
  {
    matchId: 'sa-rom-laz',
    homeId: 'roma',
    awayId: 'lazio',
    home: 'Roma',
    away: 'Lazio',
    homeCrest: crestUrl(497),
    awayCrest: crestUrl(487),
    competition: 'Serie A · Giornata 8',
    competitionCrestUrl: leagueCrestUrl(135),
    kickoffLabel: 'Oggi · 20:45',
    consensus: { home: 0.41, draw: 0.3, away: 0.29 },
    odds: { home: 2.25, draw: 3.1, away: 3.4 },
  },
  {
    matchId: 'pl-ars-liv',
    homeId: 'arsenal',
    awayId: 'liverpool',
    home: 'Arsenal',
    away: 'Liverpool',
    homeCrest: crestUrl(42),
    awayCrest: crestUrl(40),
    competition: 'Premier League · MD 9',
    competitionCrestUrl: leagueCrestUrl(39),
    kickoffLabel: 'Domani · 17:30',
    consensus: { home: 0.36, draw: 0.27, away: 0.37 },
    odds: { home: 2.55, draw: 3.4, away: 2.7 },
  },
];

export const mockFavoriteTeams = [
  {
    id: 'inter',
    name: 'Inter',
    competition: 'Serie A',
    crestUrl: crestUrl(505),
  },
  {
    id: 'napoli',
    name: 'Napoli',
    competition: 'Serie A',
    crestUrl: crestUrl(492),
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    competition: 'Premier League',
    crestUrl: crestUrl(42),
  },
];

export const leagueFilters = [
  { id: 'all', label: 'Tutte' },
  { id: 'SA', label: 'Serie A', crestUrl: leagueCrestUrl(135) },
  { id: 'PL', label: 'Premier', crestUrl: leagueCrestUrl(39) },
] as const;
