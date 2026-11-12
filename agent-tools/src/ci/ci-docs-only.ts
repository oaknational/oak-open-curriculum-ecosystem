/**
 * Whether a pull request is a docs-only change, computed from the paths it
 * changes and never declared by its author.
 *
 * A docs-only change is one where every changed path is a Markdown file
 * under `.agent` or the repository's root `docs` folder. No browser suite
 * takes such a file as an input, so the CI workflow skips `browser-tests`
 * for it. Everything else runs every gate, conservatively: one path outside
 * the definition makes the whole change a code change.
 *
 * This is narrower than the merge door's records class
 * (`merge-bot/change-class.ts`), which answers a different question (which
 * reviews a pull request waits for) and also takes other documentation roots.
 *
 * @packageDocumentation
 */

const MARKDOWN_SUFFIX = '.md';

/** The top-level folders whose Markdown is documentation for this purpose. */
const DOCS_ROOTS: ReadonlySet<string> = new Set(['.agent', 'docs']);

function isDocsPath(path: string): boolean {
  if (!path.endsWith(MARKDOWN_SUFFIX)) {
    return false;
  }
  const segments = path.split('/');
  if (segments.length < 2) {
    return false;
  }
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return false;
  }
  return DOCS_ROOTS.has(segments[0] ?? '');
}

/**
 * True when the change is docs-only. An empty list is not: a change whose
 * paths could not be read must run every gate.
 */
export function isDocsOnlyChange(paths: readonly string[]): boolean {
  return paths.length > 0 && paths.every(isDocsPath);
}

/** The paths in `git diff --name-only -z` output: NUL-separated, so any byte a path may hold survives. */
export function parseChangedPaths(nulSeparated: string): readonly string[] {
  return nulSeparated.split('\0').filter((path) => path !== '');
}
