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
    summary: 'Seed bundlato (~3800 SA+PL); Storico subito senza ingest.',
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
    summary: 'Segui squadre e leghe sul device; Home filtrata sullo storico.',
    status: 'done',
  },
  {
    id: 'p4',
    phase: 'P4',
    title: 'Previsioni dallo storico',
    summary: '1X2 stima da form/H2H; quote bookmaker solo con chiave.',
    status: 'next',
  },
  {
    id: 'p5',
    phase: 'P5',
    title: 'Rifinitura',
    summary: 'Live best-effort, player stats, qualità complessiva.',
    status: 'planned',
  },
];
