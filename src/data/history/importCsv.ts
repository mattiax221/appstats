/**
 * Optional maintainer helper — end users get `assets/history/seed.json` bundled.
 * Kept for local experiments; not linked from UI.
 */
export async function importCsvHistoryIntoApp(): Promise<{ inserted: number }> {
  throw new Error(
    'CSV UI import disabilitato: usa lo seed bundlato. Maintainer: npm run history:export-seed',
  );
}
