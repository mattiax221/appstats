import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Minimal .env loader (Windows-friendly). Does not override existing env. */
export function loadDotEnv(root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')) {
  const file = path.join(root, '.env');
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = val;
    }
  }
}
