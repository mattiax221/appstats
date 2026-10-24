/** Cache TTLs (ms) tuned for free-tier rate limits. */
export const cacheTtl = {
  /** Standings / team profiles — hours. */
  standings: 6 * 60 * 60 * 1000,
  teams: 6 * 60 * 60 * 1000,
  /** Matchday fixtures — minutes. */
  fixtures: 5 * 60 * 1000,
  /** Bookmaker odds — short window. */
  odds: 3 * 60 * 1000,
  /** Live-ish status — best-effort on free tiers. */
  live: 60 * 1000,
} as const;
