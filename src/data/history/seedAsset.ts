import type { HistorySeed } from './types';

/** Bundled finished-match snapshot (Serie A + Premier). No API keys. */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const seed = require('../../../assets/history/seed.json') as HistorySeed;

export function getBundledSeed(): HistorySeed {
  return seed;
}
