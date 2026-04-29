/**
 * Detect stale `node scripts/<name>.{mjs,ts,js}` invocations in authored
 * surfaces (workflow YAML, markdown documentation, research notes, app
 * docs). The canonical TS-script invocation pattern across this repo is
 * `pnpm exec tsx scripts/<name>.ts`; bare `node scripts/...` invocations
 * either reference renamed `.mjs` paths that no longer exist (the failure
 * mode that broke CI on PR #90) or describe an invocation form that
 * cannot run without a TypeScript loader.
 *
 * The helper is pure and operates on an in-memory list of files; the
 * runtime that walks the file system is in
 * `validate-no-stale-script-invocations.ts`.
 *
 * @packageDocumentation
 */

/**
 * A single stale-invocation finding.
 */
export interface StaleScriptInvocationFinding {
  /** Repo-relative path to the file containing the finding. */
  readonly path: string;
  /** 1-based line number of the finding. */
  readonly line: number;
  /** The matched substring, e.g. `node scripts/foo.mjs`. */
  readonly match: string;
}

/**
 * Optional configuration for {@link findStaleScriptInvocations}.
 */
export interface FindStaleScriptInvocationsOptions {
  /**
   * Repo-relative paths exempted from the check. Use for plan documents
   * and similar surfaces that legitimately discuss the stale invocation
   * pattern in prose (e.g. the PR-90 closure plan describes the drift
   * verbatim while specifying the cure).
   */
  readonly allowlistedPaths?: ReadonlyArray<string>;
}

/**
 * The canonical pattern matches `node scripts/<filename>.<ext>` where
 * `<ext>` is one of `mjs`, `ts`, or `js` and `<filename>` is a slug-like
 * token (alphanumeric plus dot, dash, and underscore). Restricting to
 * `scripts/` (and not, say, `dist/` or `build/`) keeps the gate focused
 * on authored TypeScript-source invocations.
 */
const STALE_INVOCATION_PATTERN = /node scripts\/[A-Za-z0-9_.-]+\.(?:mjs|ts|js)/g;

/**
 * Find stale `node scripts/<name>.{mjs,ts,js}` invocations across the
 * provided files.
 *
 * @param files - In-memory representation of the files to scan. Each
 *   entry carries a repo-relative path and the file contents as a UTF-8
 *   string.
 * @param options - Optional configuration; see
 *   {@link FindStaleScriptInvocationsOptions}.
 * @returns The list of findings, in file then line order. Empty when no
 *   stale invocations are present.
 *
 * @example Catches the failure mode that broke CI on PR #90:
 *
 * ```ts
 * findStaleScriptInvocations([
 *   {
 *     path: '.github/workflows/ci.yml',
 *     content: 'run: node scripts/ci-turbo-report.mjs\n',
 *   },
 * ]);
 * // [{ path: '.github/workflows/ci.yml', line: 1, match: 'node scripts/ci-turbo-report.mjs' }]
 * ```
 */
export function findStaleScriptInvocations(
  files: ReadonlyArray<{ readonly path: string; readonly content: string }>,
  options: FindStaleScriptInvocationsOptions = {},
): ReadonlyArray<StaleScriptInvocationFinding> {
  const allowlistedPaths = new Set(options.allowlistedPaths ?? []);
  const findings: StaleScriptInvocationFinding[] = [];

  for (const file of files) {
    if (allowlistedPaths.has(file.path)) {
      continue;
    }

    const lines = file.content.split('\n');
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const lineText = lines[lineIndex];
      const matches = lineText.matchAll(STALE_INVOCATION_PATTERN);
      for (const match of matches) {
        findings.push({
          path: file.path,
          line: lineIndex + 1,
          match: match[0],
        });
      }
    }
  }

  return findings;
}
