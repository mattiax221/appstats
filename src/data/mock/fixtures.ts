import type { Match } from '@/src/domain';

/** Realistic Serie A / top-league placeholders for UI until P1 wires APIs. */
export const mockFixtures: Match[] = [
  {
    id: 'sa-int-mil',
    competitionId: 'SA',
    competitionName: 'Serie A',
    utcDate: '2026-10-24T18:45:00Z',
    status: 'live',
    matchday: 8,
    home: { id: 'inter', name: 'Inter', shortName: 'INT' },
    away: { id: 'milan', name: 'Milan', shortName: 'MIL' },
    score: { home: 1, away: 1 },
  },
  {
    id: 'sa-juv-nap',
    competitionId: 'SA',
    competitionName: 'Serie A',
    utcDate: '2026-10-24T18:45:00Z',
    status: 'scheduled',
    matchday: 8,
    home: { id: 'juve', name: 'Juventus', shortName: 'JUV' },
    away: { id: 'napoli', name: 'Napoli', shortName: 'NAP' },
  },
  {
    id: 'sa-rom-laz',
    competitionId: 'SA',
    competitionName: 'Serie A',
    utcDate: '2026-10-24T20:45:00Z',
    status: 'scheduled',
    matchday: 8,
    home: { id: 'roma', name: 'Roma', shortName: 'ROM' },
    away: { id: 'lazio', name: 'Lazio', shortName: 'LAZ' },
  },
  {
    id: 'pl-ars-liv',
    competitionId: 'PL',
    competitionName: 'Premier League',
    utcDate: '2026-10-25T16:30:00Z',
    status: 'scheduled',
    matchday: 9,
    home: { id: 'arsenal', name: 'Arsenal', shortName: 'ARS' },
    away: { id: 'liverpool', name: 'Liverpool', shortName: 'LIV' },
  },
  {
    id: 'sa-fio-ata',
    competitionId: 'SA',
    competitionName: 'Serie A',
    utcDate: '2026-10-25T13:00:00Z',
    status: 'scheduled',
    matchday: 8,
    home: { id: 'fiorentina', name: 'Fiorentina', shortName: 'FIO' },
    away: { id: 'atalanta', name: 'Atalanta', shortName: 'ATA' },
  },
];

export type MockMarket = {
  matchId: string;
  home: string;
  away: string;
  competition: string;
  kickoffLabel: string;
  consensus: { home: number; draw: number; away: number };
  odds: { home: number; draw: number; away: number };
};

export const mockMarkets: MockMarket[] = [
  {
    matchId: 'sa-juv-nap',
    home: 'Juventus',
    away: 'Napoli',
    competition: 'Serie A · Giornata 8',
    kickoffLabel: 'Oggi · 20:45',
    consensus: { home: 0.38, draw: 0.28, away: 0.34 },
    odds: { home: 2.45, draw: 3.2, away: 2.9 },
  },
  {
    matchId: 'sa-rom-laz',
    home: 'Roma',
    away: 'Lazio',
    competition: 'Serie A · Giornata 8',
    kickoffLabel: 'Oggi · 20:45',
    consensus: { home: 0.41, draw: 0.3, away: 0.29 },
    odds: { home: 2.25, draw: 3.1, away: 3.4 },
  },
  {
    matchId: 'pl-ars-liv',
    home: 'Arsenal',
    away: 'Liverpool',
    competition: 'Premier League · MD 9',
    kickoffLabel: 'Domani · 17:30',
    consensus: { home: 0.36, draw: 0.27, away: 0.37 },
    odds: { home: 2.55, draw: 3.4, away: 2.7 },
  },
];

export const mockFavoriteTeams = [
  { id: 'inter', name: 'Inter', competition: 'Serie A' },
  { id: 'napoli', name: 'Napoli', competition: 'Serie A' },
  { id: 'arsenal', name: 'Arsenal', competition: 'Premier League' },
];
