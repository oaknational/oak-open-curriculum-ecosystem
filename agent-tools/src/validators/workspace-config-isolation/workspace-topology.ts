/**
 * Workspace topology for the workspace-config-isolation validator: which
 * files are in scope, which workspace owns a path, and whether the scan
 * set is populated at all. Split from `containment.ts` so each module
 * stays within the estate's size cap; the scanning halves live there.
 *
 * @packageDocumentation
 */

import path from 'node:path';

const CONFIG_FILE_BASENAME =
  /^(?:vitest|tsup|eslint|stryker)(?:\.[\w-]+)*\.config\.(?:ts|mts|cts|js|mjs|cjs)$/;

/**
 * Is this repo-relative path a workspace tooling config file in scope?
 *
 * @remarks The vitest family is a glob by design: `vitest.e2e.config.ts`,
 * `vitest.smoke.config.ts`, and `vitest.experiment.config.ts` all carry
 * real escapes today and a literal `vitest.config.ts` match would
 * silently exempt them. Declaration files never match.
 */
export function isWorkspaceConfigFile(filePath: string): boolean {
  const base = path.posix.basename(filePath);
  if (base.endsWith('.d.ts')) {
    return false;
  }
  return CONFIG_FILE_BASENAME.test(base);
}

/**
 * Expand `pnpm-workspace.yaml` member entries into repo-relative
 * workspace directories, using the tracked-file list as the directory
 * source of truth (a directory is a member candidate iff it holds a
 * tracked `package.json`).
 *
 * @remarks Supports the two shapes the manifest uses: literal
 * directories and single-level `<prefix>/*` globs. A literal entry is
 * kept only when its `package.json` is tracked — a stale manifest line
 * must not manufacture a phantom owner.
 */
export function expandWorkspaceGlobs(
  entries: readonly string[],
  trackedFiles: readonly string[],
): readonly string[] {
  const packageDirs = new Set(
    trackedFiles
      .filter((file) => path.posix.basename(file) === 'package.json')
      .map((file) => path.posix.dirname(file)),
  );

  const dirs = entries.flatMap((entry) => {
    if (entry.endsWith('/*')) {
      const prefix = entry.slice(0, -2);
      return [...packageDirs].filter((dir) => path.posix.dirname(dir) === prefix);
    }
    return packageDirs.has(entry) ? [entry] : [];
  });
  return [...dirs].sort((a, b) => a.localeCompare(b));
}

/**
 * The owning workspace of a repo-relative file: the longest member
 * directory that path-prefixes it (`''` = repo root).
 *
 * @remarks Longest-prefix matters: a workspace member can be nested
 * inside a non-member directory, and a
 * plain first-match would mis-assign it. The prefix test is
 * boundary-aware — `packages/core/result` does not own
 * `packages/core/result-extras/`.
 */
export function resolveOwner(workspaceDirs: readonly string[], filePath: string): string {
  let owner = '';
  for (const dir of workspaceDirs) {
    if (filePath.startsWith(`${dir}/`) && dir.length > owner.length) {
      owner = dir;
    }
  }
  return owner;
}

/**
 * Is the scan's input set degenerate — zero workspaces or zero config
 * files?
 *
 * @remarks A manifest-shape change (`packages/*\/*` tidying, a rename of
 * the config-file family) can silently empty the scan set; a validator
 * printing success over nothing checked is the silent-fallback class
 * this estate bans, so the bin refuses (exit 2) instead of passing.
 */
export function isDegenerateScan(input: {
  readonly workspaceCount: number;
  readonly configFileCount: number;
}): boolean {
  return input.workspaceCount === 0 || input.configFileCount === 0;
}
