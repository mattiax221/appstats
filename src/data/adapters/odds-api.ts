import { env, hasOddsApiKey } from '@/src/config/env';
import type { MarketOdds } from '@/src/domain';

import type { OddsAdapter } from './types';

type OddsOutcome = { name: string; price: number };
type OddsMarket = { key: string; outcomes: OddsOutcome[] };
type OddsBookmaker = { title: string; markets: OddsMarket[] };
type OddsEvent = {
  id: string;
  home_team: string;
  away_team: string;
  bookmakers?: OddsBookmaker[];
};

function nameKey(raw: string) {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function fuzzyMatch(a: string, b: string) {
  const x = nameKey(a);
  const y = nameKey(b);
  return x === y || x.includes(y) || y.includes(x);
}

/**
 * Adapter for https://the-odds-api.com/ (free ~500 req/month).
 * Returns null when no key — never invents prices.
 */
export class OddsApiAdapter implements OddsAdapter {
  readonly name = 'the-odds-api';

  private cache: { at: number; events: OddsEvent[] } | null = null;

  async getMarketOdds(matchId: string): Promise<MarketOdds | null> {
    void matchId;
    return null;
  }

  async getH2HOdds(homeName: string, awayName: string): Promise<{
    home: number;
    draw: number;
    away: number;
    bookmaker: string;
  } | null> {
    if (!hasOddsApiKey()) return null;
    const events = await this.loadSoccerEvents();
    const hit = events.find(
      (e) =>
        (fuzzyMatch(e.home_team, homeName) && fuzzyMatch(e.away_team, awayName)) ||
        (fuzzyMatch(e.home_team, awayName) && fuzzyMatch(e.away_team, homeName)),
    );
    if (!hit?.bookmakers?.length) return null;

    for (const book of hit.bookmakers) {
      const market = book.markets.find((m) => m.key === 'h2h');
      if (!market) continue;
      const home = market.outcomes.find((o) => fuzzyMatch(o.name, hit.home_team));
      const away = market.outcomes.find((o) => fuzzyMatch(o.name, hit.away_team));
      const draw = market.outcomes.find((o) => /draw|pareggio|x/i.test(o.name));
      if (!home || !away || !draw) continue;
      const swapped =
        fuzzyMatch(hit.home_team, awayName) && fuzzyMatch(hit.away_team, homeName);
      return swapped
        ? { home: away.price, draw: draw.price, away: home.price, bookmaker: book.title }
        : { home: home.price, draw: draw.price, away: away.price, bookmaker: book.title };
    }
    return null;
  }

  private async loadSoccerEvents(): Promise<OddsEvent[]> {
    if (this.cache && Date.now() - this.cache.at < 5 * 60 * 1000) {
      return this.cache.events;
    }
    const sports = ['soccer_italy_serie_a', 'soccer_epl'];
    const all: OddsEvent[] = [];
    for (const sport of sports) {
      const url =
        `${env.oddsApiBaseUrl}/sports/${sport}/odds/?apiKey=${encodeURIComponent(env.oddsApiKey)}` +
        `&regions=eu&markets=h2h&oddsFormat=decimal`;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = (await res.json()) as OddsEvent[];
        if (Array.isArray(data)) all.push(...data);
      } catch {
        /* ignore network */
      }
    }
    this.cache = { at: Date.now(), events: all };
    return all;
  }
}

export const oddsApiAdapter = new OddsApiAdapter();
