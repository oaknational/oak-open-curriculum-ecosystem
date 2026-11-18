/**
 * The change class of a pull request, computed from its changed paths and
 * never declared by a seat.
 *
 * The owner's ruling of 2026-09-03 ("Change the merge policy instead") gives a
 * bot-authored pull request that touches only documentation and Practice
 * surfaces its merge at checks green with zero unresolved threads, no vendor
 * leg waited on; the retrospective of 2026-10-10 priced the synchronous round
 * every such fold was paying while the door knew one verdict. The lifetime
 * rule's test decides the other class: "is this code?" — source, workflows,
 * hooks, config-as-code, anything executable or CI-affecting. A Markdown file
 * is never executed by the estate's CI, so the records class is Markdown under
 * the documentation and Practice roots, outside any directory whose Markdown a
 * test or a hook reads as an input. The platform adapter directories are
 * generated surfaces a validator recomputes, and the retrospective's ratified
 * path set keeps generated adapters code-class with hook policy and
 * workflows. Everything else is code-class, conservatively: a records fold
 * that carries one code path keeps the SETTLE-READY door.
 */

const MARKDOWN_SUFFIX = '.md';

/** The top-level directories whose Markdown is documentation or Practice prose. */
const RECORDS_ROOTS: ReadonlySet<string> = new Set(['.agent', 'docs', 'linkedin']);

/**
 * The root-level Markdown that is documentation. Every other root Markdown
 * file is a harness entry surface (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`,
 * `skills.md`) or a generated index (`RULES_INDEX.md`) and is code-class
 * with the platform adapters.
 */
const ROOT_RECORDS_FILES: ReadonlySet<string> = new Set([
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'ATTRIBUTION.md',
  'LICENSE.md',
]);

/** Path segments under which Markdown is an input to code (fixtures, hooks, schemas), never prose. */
const CODE_SEGMENTS: ReadonlySet<string> = new Set([
  'hooks',
  'scripts',
  'schemas',
  'setup',
  'src',
  'tests',
  'test',
  'fixtures',
  '__snapshots__',
  'e2e-tests',
]);

const OFFENDERS_NAMED = 5;

export type ChangeClass =
  | { readonly kind: 'records'; readonly pathCount: number }
  | { readonly kind: 'code'; readonly offenders: readonly string[] };

/** The policy in one sentence, for usage text and the merge report. */
export const RECORDS_CLASS_DESCRIPTION =
  'records-class: every changed path is a Markdown file under .agent, docs or linkedin, outside ' +
  'any hooks, scripts, schemas, setup, src, tests, fixtures, snapshots or end-to-end directory, or ' +
  'one of the root documentation files (README, CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, ' +
  'ATTRIBUTION, LICENSE); generated platform adapters, the root harness entry files, hook policy ' +
  'and workflows are code-class';

function hasOnlyPlainSegments(segments: readonly string[]): boolean {
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

/** Whether one repository-relative path is documentation or Practice prose by the policy above. */
export function isRecordsPath(path: string): boolean {
  if (!path.endsWith(MARKDOWN_SUFFIX)) {
    return false;
  }
  const segments = path.split('/');
  if (!hasOnlyPlainSegments(segments)) {
    return false;
  }
  if (segments.length === 1) {
    return ROOT_RECORDS_FILES.has(path);
  }
  if (!RECORDS_ROOTS.has(segments[0] ?? '')) {
    return false;
  }
  return !segments.slice(1, -1).some((segment) => CODE_SEGMENTS.has(segment));
}

/**
 * Classify a pull request by every path it changes (a rename contributes both
 * names). An empty set is code-class: absence of evidence is never prose.
 */
export function classifyChangedPaths(paths: readonly string[]): ChangeClass {
  const offenders = paths.filter((path) => !isRecordsPath(path));
  if (paths.length === 0 || offenders.length > 0) {
    return { kind: 'code', offenders };
  }
  return { kind: 'records', pathCount: paths.length };
}

/** The first few code-class paths for a refusal reason, the rest counted. */
export function describeOffenders(offenders: readonly string[]): string {
  const named = offenders.slice(0, OFFENDERS_NAMED).join(', ');
  const rest = offenders.length - OFFENDERS_NAMED;
  return rest > 0 ? `${named} and ${rest} more` : named;
}
