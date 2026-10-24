export type RoadmapStatus = 'done' | 'next' | 'planned';

export type RoadmapPhase = {
  id: string;
  phase: string;
  title: string;
  summary: string;
  status: RoadmapStatus;
};

/** User-facing phases aligned with the product plan (P0–P5). */
export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'p0',
    phase: 'P0',
    title: 'Base app',
    summary: 'Navigazione, tema matchday, schermate principali.',
    status: 'done',
  },
  {
    id: 'p1',
    phase: 'P1',
    title: 'Partite e classifiche',
    summary: 'Calendario, risultati e tabelle da football-data.org.',
    status: 'done',
  },
  {
    id: 'p1b',
    phase: 'P1b',
    title: 'Database storico',
    summary: 'SQLite locale: risultati passati da CSV e API free (no live).',
    status: 'done',
  },
  {
    id: 'p2',
    phase: 'P2',
    title: 'Statistiche profonde',
    summary: 'Schede squadra, forma, H2H e stats match dallo storico locale.',
    status: 'done',
  },
  {
    id: 'p3',
    phase: 'P3',
    title: 'Preferiti',
    summary: 'Segui squadre e leghe; Home più personale.',
    status: 'planned',
  },
  {
    id: 'p4',
    phase: 'P4',
    title: 'Previsioni da quote',
    summary: '1X2 dal mercato bookmaker, consenso e value.',
    status: 'planned',
  },
  {
    id: 'p5',
    phase: 'P5',
    title: 'Rifinitura',
    summary: 'Live best-effort, player stats, qualità complessiva.',
    status: 'planned',
  },
];
