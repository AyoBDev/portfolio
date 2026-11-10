import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Terms that must never appear in published content (employer, client or
 * private repo names). The terms themselves are NOT stored in git: they come
 * from the FORBIDDEN_TERMS env var (comma-separated) or an untracked
 * `.privacy-denylist` file at the repo root (one term per line).
 */
const DENYLIST_FILE = resolve(process.cwd(), '.privacy-denylist');

export const DENYLIST_SKIP_MESSAGE =
  'Privacy deny-list skipped: set FORBIDDEN_TERMS (comma-separated) or create an untracked .privacy-denylist file (one term per line).';

function splitTerms(raw: string, separator: RegExp): string[] {
  return raw
    .split(separator)
    .map((term) => term.trim())
    .filter((term) => term.length > 0);
}

export function loadDenylist(): string[] {
  const fromEnv = process.env.FORBIDDEN_TERMS;
  if (fromEnv && fromEnv.trim()) return splitTerms(fromEnv, /,/);
  if (existsSync(DENYLIST_FILE)) return splitTerms(readFileSync(DENYLIST_FILE, 'utf8'), /\r?\n/);
  return [];
}

/** Returns the deny-listed terms found in `text` (case-insensitive). */
export function findForbiddenTerms(text: string, terms: string[]): string[] {
  const lowered = text.toLowerCase();
  return terms.filter((term) => lowered.includes(term.toLowerCase()));
}
