/**
 * TypeScript entry. Metro resolves db.web.ts / db.native.ts at bundle time.
 */
export {
  getHistoryMatchCount,
  getNativeHistoryDb,
  getWebStore,
  listRecentHistoryMatches,
  saveWebStore,
} from './db.web';
