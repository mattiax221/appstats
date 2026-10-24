import {
  getCatalog,
  getH2H,
  getTeam,
  getTeamStats,
  listTeams,
  type CatalogMatch,
} from './catalog';

export type OneXTwo = {
  home: number;
  draw: number;
  away: number;
};

export type HistoryPrediction = {
  id: string;
  homeTeamId: number;
  awayTeamId: number;
  homeName: string;
  awayName: string;
  homeCrest: string | null;
  awayCrest: string | null;
  competitionCode: string;
  estimate: OneXTwo;
  label: string;
  tip: '1' | 'X' | '2';
  tipPct: number;
  sampleSize: number;
};

function clamp01(n: number) {
  return Math.max(0.02, Math.min(0.96, n));
}

function normalize(p: OneXTwo): OneXTwo {
  const s = p.home + p.draw + p.away;
  if (s <= 0) return { home: 1 / 3, draw: 1 / 3, away: 1 / 3 };
  return { home: p.home / s, draw: p.draw / s, away: p.away / s };
}

/** 1X2 probabilities from form + H2H (finished matches only). Not bookmaker odds. */
export function estimate1x2(homeTeamId: number, awayTeamId: number): {
  estimate: OneXTwo;
  sampleSize: number;
} {
  const homeForm = getTeamStats(homeTeamId, 10);
  const awayForm = getTeamStats(awayTeamId, 10);
  const h2h = getH2H(homeTeamId, awayTeamId, 12);

  const homeWinRate = homeForm.played ? homeForm.wins / homeForm.played : 0.33;
  const homeDrawRate = homeForm.played ? homeForm.draws / homeForm.played : 0.28;
  const awayWinRate = awayForm.played ? awayForm.wins / awayForm.played : 0.33;
  const awayDrawRate = awayForm.played ? awayForm.draws / awayForm.played : 0.28;

  // Form blend: home strength vs away strength + home advantage nudge
  const formHome = clamp01(0.52 * homeWinRate + 0.2 * (1 - awayWinRate) + 0.08);
  const formAway = clamp01(0.48 * awayWinRate + 0.2 * (1 - homeWinRate));
  const formDraw = clamp01(0.45 * ((homeDrawRate + awayDrawRate) / 2) + 0.12);

  let h2hHome = 1 / 3;
  let h2hDraw = 1 / 3;
  let h2hAway = 1 / 3;
  if (h2h.played > 0) {
    h2hHome = h2h.teamAWins / h2h.played;
    h2hDraw = h2h.draws / h2h.played;
    h2hAway = h2h.teamBWins / h2h.played;
  }

  const h2hWeight = Math.min(0.55, 0.12 + h2h.played * 0.04);
  const formWeight = 1 - h2hWeight;

  const estimate = normalize({
    home: formWeight * formHome + h2hWeight * h2hHome,
    draw: formWeight * formDraw + h2hWeight * h2hDraw,
    away: formWeight * formAway + h2hWeight * h2hAway,
  });

  return {
    estimate,
    sampleSize: homeForm.played + awayForm.played + h2h.played,
  };
}

function tipOf(e: OneXTwo): { tip: '1' | 'X' | '2'; tipPct: number } {
  if (e.home >= e.draw && e.home >= e.away) return { tip: '1', tipPct: e.home };
  if (e.away > e.draw) return { tip: '2', tipPct: e.away };
  return { tip: 'X', tipPct: e.draw };
}

function pairKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/** Build prediction cards from frequent H2H pairs (+ optional favorite teams). */
export function listHistoryPredictions(opts?: {
  favoriteTeamIds?: number[];
  limit?: number;
}): HistoryPrediction[] {
  const limit = opts?.limit ?? 12;
  const fav = new Set(opts?.favoriteTeamIds ?? []);
  const cat = getCatalog();

  const counts = new Map<string, { a: number; b: number; n: number; last: CatalogMatch }>();
  for (const m of cat.matches) {
    const key = pairKey(m.homeTeamId, m.awayTeamId);
    const cur = counts.get(key);
    if (!cur) {
      counts.set(key, {
        a: Math.min(m.homeTeamId, m.awayTeamId),
        b: Math.max(m.homeTeamId, m.awayTeamId),
        n: 1,
        last: m,
      });
      continue;
    }
    cur.n += 1;
    if (m.matchDate > cur.last.matchDate) cur.last = m;
  }

  const ranked = [...counts.values()].sort((x, y) => {
    const favBoost = (p: { a: number; b: number }) =>
      (fav.has(p.a) ? 100 : 0) + (fav.has(p.b) ? 100 : 0);
    return favBoost(y) - favBoost(x) || y.n - x.n;
  });

  const out: HistoryPrediction[] = [];
  const seen = new Set<string>();

  for (const p of ranked) {
    if (out.length >= limit) break;
    // Prefer last home team as home for continuity
    const homeId = p.last.homeTeamId;
    const awayId = p.last.awayTeamId;
    const key = `${homeId}-${awayId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const home = getTeam(homeId);
    const away = getTeam(awayId);
    if (!home || !away) continue;
    const comp = cat.competitions.get(p.last.competitionId);
    const { estimate, sampleSize } = estimate1x2(homeId, awayId);
    const { tip, tipPct } = tipOf(estimate);
    out.push({
      id: `pred-${homeId}-${awayId}`,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeName: home.name,
      awayName: away.name,
      homeCrest: home.crestUrl,
      awayCrest: away.crestUrl,
      competitionCode: comp?.code ?? '',
      estimate,
      label: 'Stima dallo storico',
      tip,
      tipPct,
      sampleSize,
    });
  }

  // Ensure favorites appear even with thin H2H
  if (fav.size && out.length < limit) {
    const teams = listTeams().filter((t) => !fav.has(t.id));
    for (const favId of fav) {
      if (out.length >= limit) break;
      const opp = teams[0];
      if (!opp) break;
      const key = `${favId}-${opp.id}`;
      if (seen.has(key)) continue;
      const home = getTeam(favId);
      if (!home) continue;
      const { estimate, sampleSize } = estimate1x2(favId, opp.id);
      const { tip, tipPct } = tipOf(estimate);
      out.push({
        id: `pred-${favId}-${opp.id}`,
        homeTeamId: favId,
        awayTeamId: opp.id,
        homeName: home.name,
        awayName: opp.name,
        homeCrest: home.crestUrl,
        awayCrest: opp.crestUrl,
        competitionCode: '',
        estimate,
        label: 'Stima dallo storico',
        tip,
        tipPct,
        sampleSize,
      });
      seen.add(key);
    }
  }

  return out;
}

/** Implied probs from decimal odds. */
export function impliedFromOdds(odds: OneXTwo): OneXTwo {
  const inv = {
    home: 1 / Math.max(odds.home, 1.01),
    draw: 1 / Math.max(odds.draw, 1.01),
    away: 1 / Math.max(odds.away, 1.01),
  };
  return normalize(inv);
}

/** Positive value when estimate > implied (edge vs book). */
export function valueEdges(estimate: OneXTwo, decimalOdds: OneXTwo): OneXTwo {
  const implied = impliedFromOdds(decimalOdds);
  return {
    home: estimate.home - implied.home,
    draw: estimate.draw - implied.draw,
    away: estimate.away - implied.away,
  };
}
