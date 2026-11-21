/**
 * Pure helpers for the code-owner-names validator.
 *
 * @remarks
 * A repository is cloned and forked, and a fork inherits every tracked file.
 * The one file that must name real accounts is the code-owners file, because
 * the forge resolves it. The validator therefore reads its list of names from
 * that file and looks for them everywhere else, so no second list of real
 * names is tracked and a fork checks its own owners with no setup.
 *
 * A name matches as a whole account name, whatever its case: it is not found
 * inside a longer name. It is found as a mention, a branch prefix, a package
 * scope, the stem of a domain and the local part of a mail address, because
 * each of those is the account name followed or preceded by punctuation.
 *
 * @packageDocumentation
 */

/** One line of one file that holds a name. */
export interface NameHit {
  readonly path: string;
  readonly line: number;
}

/** How many files and lines under one directory hold a name. */
export interface DirectorySummary {
  readonly directory: string;
  readonly files: number;
  readonly lines: number;
}

/** The file that names the code owners, relative to the repository root. */
export const CODE_OWNERS_PATH = '.github/CODEOWNERS';

/** The Practice Core carries its authors and origins as attribution. */
const PRACTICE_CORE_PREFIX = '.agent/practice-core/';

/** The characters an account name is made of. */
const ACCOUNT_CHARACTER = 'a-z0-9-';

/**
 * The account names a code-owners file gives ownership to, lower-cased, each
 * once, in file order. A team (`@org/team`) names no person and is left out,
 * and so is anything in a comment, whether the comment is a whole line or
 * ends a pattern line.
 */
export function parseCodeOwnerLogins(content: string): string[] {
  const logins = new Set<string>();
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }
    for (const token of line.split(/\s+/u).slice(1)) {
      if (token.startsWith('#')) {
        break;
      }
      if (token.startsWith('@') && !token.includes('/')) {
        logins.add(token.slice(1).toLowerCase());
      }
    }
  }
  return [...logins];
}

/**
 * The names a machine's own untracked list adds: one per line, lower-cased,
 * blank lines and `#` comments skipped.
 */
export function parseExtraNames(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

/** Whether a tracked path may name a code owner. */
export function isExemptPath(path: string): boolean {
  return path === CODE_OWNERS_PATH || path.startsWith(PRACTICE_CORE_PREFIX);
}

function escapeForPattern(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);
}

/** A pattern that finds any of the names as a whole account name, or null for none. */
function buildPattern(names: readonly string[]): RegExp | null {
  if (names.length === 0) {
    return null;
  }
  const alternatives = names.map(escapeForPattern).join('|');
  return new RegExp(
    `(?<![${ACCOUNT_CHARACTER}])(?:${alternatives})(?![${ACCOUNT_CHARACTER}])`,
    'iu',
  );
}

/** Every line of one file that holds one of the names, each line once. */
export function scanForNames(path: string, content: string, names: readonly string[]): NameHit[] {
  const pattern = buildPattern(names);
  if (pattern === null) {
    return [];
  }
  const hits: NameHit[] = [];
  const lines = content.split('\n');
  for (const [index, line] of lines.entries()) {
    if (pattern.test(line)) {
      hits.push({ path, line: index + 1 });
    }
  }
  return hits;
}

function directoryOf(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '.' : path.slice(0, slash);
}

/** Files and lines per directory, the directory with the most lines first. */
export function summariseByDirectory(hits: readonly NameHit[]): DirectorySummary[] {
  const byDirectory = new Map<string, { files: Set<string>; lines: number }>();
  for (const hit of hits) {
    const directory = directoryOf(hit.path);
    const entry = byDirectory.get(directory) ?? { files: new Set<string>(), lines: 0 };
    entry.files.add(hit.path);
    entry.lines += 1;
    byDirectory.set(directory, entry);
  }
  return [...byDirectory.entries()]
    .map(([directory, entry]) => ({ directory, files: entry.files.size, lines: entry.lines }))
    .sort(
      (left, right) => right.lines - left.lines || left.directory.localeCompare(right.directory),
    );
}
