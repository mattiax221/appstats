/**
 * Public Expo env placeholders. Never commit real secrets.
 * Copy `.env.example` → `.env` and fill values locally.
 */
export const env = {
  footballDataApiKey: process.env.EXPO_PUBLIC_FOOTBALL_DATA_API_KEY ?? '',
  apiFootballApiKey: process.env.EXPO_PUBLIC_API_FOOTBALL_API_KEY ?? '',
  oddsApiKey: process.env.EXPO_PUBLIC_ODDS_API_KEY ?? '',
  footballDataBaseUrl:
    process.env.EXPO_PUBLIC_FOOTBALL_DATA_BASE_URL ??
    'https://api.football-data.org/v4',
  apiFootballBaseUrl:
    process.env.EXPO_PUBLIC_API_FOOTBALL_BASE_URL ??
    'https://v3.football.api-sports.io',
  oddsApiBaseUrl:
    process.env.EXPO_PUBLIC_ODDS_API_BASE_URL ?? 'https://api.the-odds-api.com/v4',
} as const;

export function hasFootballDataKey(): boolean {
  return Boolean(env.footballDataApiKey);
}

export function hasApiFootballKey(): boolean {
  return Boolean(env.apiFootballApiKey);
}

export function hasOddsApiKey(): boolean {
  return Boolean(env.oddsApiKey);
}
