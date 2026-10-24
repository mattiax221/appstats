/**
 * Crest / league badge resolver for Serie A + Premier teams in the seed.
 * Primary CDN: football-data.org crests (public). Fallback: api-sports media.
 */

/** football-data.org crest id by normalized name key */
const FD_TEAM: Record<string, number> = {
  // Serie A
  genoa: 107,
  inter: 108,
  parma: 112,
  fiorentina: 99,
  empoli: 445,
  monza: 5911,
  milan: 98,
  torino: 586,
  bologna: 103,
  udinese: 115,
  verona: 450,
  napoli: 113,
  cagliari: 104,
  roma: 100,
  lazio: 110,
  venezia: 454,
  lecce: 5890,
  atalanta: 102,
  juventus: 109,
  como: 1107,
  frosinone: 470,
  salernitana: 455,
  sassuolo: 471,
  sampdoria: 584,
  cremonese: 457,
  spezia: 488,
  crotone: 472,
  benevento: 474,
  // Premier
  'manchester united': 66,
  fulham: 63,
  ipswich: 349,
  liverpool: 64,
  arsenal: 57,
  wolverhampton: 76,
  everton: 62,
  brighton: 397,
  'newcastle united': 67,
  southampton: 340,
  "nott'm forest": 351,
  'nottingham forest': 351,
  bournemouth: 1044,
  'west ham': 563,
  'aston villa': 58,
  brentford: 402,
  'crystal palace': 354,
  chelsea: 61,
  'manchester city': 65,
  leicester: 338,
  tottenham: 73,
  burnley: 328,
  luton: 389,
  'sheffield utd': 356,
  'sheffield united': 356,
  leeds: 341,
  watford: 346,
  norwich: 68,
  'west brom': 74,
};

/** api-sports team ids — secondary CDN */
const API_TEAM: Record<string, number> = {
  genoa: 495,
  inter: 505,
  parma: 523,
  fiorentina: 502,
  empoli: 511,
  monza: 1579,
  milan: 489,
  torino: 503,
  bologna: 500,
  udinese: 494,
  verona: 504,
  napoli: 492,
  cagliari: 490,
  roma: 497,
  lazio: 487,
  venezia: 517,
  lecce: 867,
  atalanta: 499,
  juventus: 496,
  como: 895,
  frosinone: 512,
  salernitana: 514,
  sassuolo: 488,
  sampdoria: 498,
  cremonese: 520,
  spezia: 515,
  crotone: 508,
  benevento: 506,
  'manchester united': 33,
  fulham: 36,
  ipswich: 57,
  liverpool: 40,
  arsenal: 42,
  wolverhampton: 39,
  everton: 45,
  brighton: 51,
  'newcastle united': 34,
  southampton: 41,
  "nott'm forest": 65,
  'nottingham forest': 65,
  bournemouth: 35,
  'west ham': 48,
  'aston villa': 66,
  brentford: 55,
  'crystal palace': 52,
  chelsea: 49,
  'manchester city': 50,
  leicester: 46,
  tottenham: 47,
  burnley: 44,
  luton: 1359,
  'sheffield utd': 62,
  'sheffield united': 62,
  leeds: 63,
  watford: 38,
  norwich: 71,
  'west brom': 60,
};

const LEAGUE: Record<string, string> = {
  SA: 'https://crests.football-data.org/SA.png',
  PL: 'https://crests.football-data.org/PL.png',
  'SERIE A': 'https://crests.football-data.org/SA.png',
  'PREMIER LEAGUE': 'https://crests.football-data.org/PL.png',
};

function keyOf(name: string): string {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const cache = new Map<string, string | null>();

export function resolveTeamCrest(
  name: string,
  existing?: string | null,
): string | null {
  if (existing && /^https?:\/\//i.test(existing)) return existing;
  const k = keyOf(name);
  if (cache.has(k)) return cache.get(k) ?? null;

  // Prefer api-sports media for broader coverage; FD crests as alternate.
  const api = API_TEAM[k];
  if (api) {
    const url = `https://media.api-sports.io/football/teams/${api}.png`;
    cache.set(k, url);
    return url;
  }
  const fd = FD_TEAM[k];
  if (fd) {
    const url = `https://crests.football-data.org/${fd}.png`;
    cache.set(k, url);
    return url;
  }
  cache.set(k, null);
  return null;
}

export function resolveLeagueBadge(codeOrName: string): string | null {
  const raw = String(codeOrName || '').trim();
  if (!raw) return null;
  return LEAGUE[raw] ?? LEAGUE[raw.toUpperCase()] ?? null;
}
