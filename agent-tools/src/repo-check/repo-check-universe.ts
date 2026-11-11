/**
 * The file universes the root gates read, both git's: the staged set for the
 * pre-commit hook and the tracked tree for the root gates. The names never
 * come from a disk walk, so a gate reads the same file list on every checkout
 * and in CI (`repo-check-files.ts` carries the reasoning and the pure mapping
 * this module composes); each gate then reads what it needs of the files git
 * names.
 *
 * @remarks
 * Every read fails closed. A failed git read throws in git's own words, and a
 * tracked listing that names no file throws too, since a gate that read
 * nothing must never pass as if it checked everything.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { failureAsError } from '../core/failure-as-error.js';

import {
  parseNulSeparatedPaths,
  parseSymlinkPaths,
  type TrackedTreeReading,
} from './repo-check-files.js';
import type { RepoCheckRuntime } from './repo-check-types.js';

/** A git read's standard output; a failed read throws in git's own words. */
function gitOutput(runtime: RepoCheckRuntime, args: readonly string[], what: string): string {
  const result = runtime.runCaptured('git', args);
  if ((result.status ?? 1) !== 0) {
    throw new Error(
      result.stderr.trim() || `git ${args[0] ?? ''} failed while discovering ${what}`,
    );
  }
  return result.stdout;
}

/** Index entries that are symbolic links, read from their index modes. */
function indexSymlinkPaths(runtime: RepoCheckRuntime): ReadonlySet<string> {
  return parseSymlinkPaths(gitOutput(runtime, ['ls-files', '--cached', '-s', '-z'], 'symlinks'));
}

/** The files staged for the next commit (added, copied, modified, renamed), without symlinks. */
export function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const names = parseNulSeparatedPaths(
    gitOutput(
      runtime,
      ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
      'staged files',
    ),
  );
  const symlinks = indexSymlinkPaths(runtime);
  return names.filter((name) => !symlinks.has(name));
}

/**
 * What git says about the tracked tree, in three reads:
 *
 * - `ls-files -z --deduplicate`: each tracked file once, even mid-merge;
 * - `diff-files --name-only --diff-filter=DT -z`: tracked files deleted or
 *   retyped in the working tree and not yet staged (the plumbing command never
 *   detects renames, so a deletion is never read as half of one);
 * - `ls-files --cached -s -z`: the symlinks, from the index modes.
 *
 * @throws When a read fails, or when git lists no tracked file (it read the
 *   wrong place).
 */
export function readTrackedTree(runtime: RepoCheckRuntime): TrackedTreeReading {
  const tracked = parseNulSeparatedPaths(
    gitOutput(runtime, ['ls-files', '-z', '--deduplicate'], 'tracked files'),
  );
  if (tracked.length === 0) {
    throw new Error('git listed no tracked file; run the gate from the repository root');
  }
  const gone = parseNulSeparatedPaths(
    gitOutput(
      runtime,
      ['diff-files', '--name-only', '--diff-filter=DT', '-z'],
      'tracked files deleted or retyped in the working tree',
    ),
  );
  return { tracked, goneFromWorkingTree: new Set(gone), symlinks: indexSymlinkPaths(runtime) };
}

/** The tracked tree, or why git could not give it: {@link readTrackedTree}'s throw as a Result. */
export function readTrackedTreeResult(
  runtime: RepoCheckRuntime,
): Result<TrackedTreeReading, string> {
  try {
    return ok(readTrackedTree(runtime));
  } catch (error: unknown) {
    return err(failureAsError(error, 'readTrackedTree').message);
  }
}
