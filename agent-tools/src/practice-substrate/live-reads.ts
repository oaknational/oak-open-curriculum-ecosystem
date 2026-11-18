/**
 * The substrate readers' reads of a repository: one injected seam for the
 * collaboration surfaces, and the read that is also the existence test.
 *
 * @packageDocumentation
 */

import { readFile } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

import { isErrnoCode } from '../collaboration-state/errno.js';
import { failureAsError } from '../core/failure-as-error.js';
import { listJsonFiles } from './live-json-support.js';
import { absolutePath } from './live-types.js';

/**
 * The reads the collaboration readers make of a repository, injected so a
 * test holds the files in memory (the injected-seams rule).
 */
export interface SubstrateReads {
  /** A repo file's UTF-8 text; rejects as `readFile` does, with code `ENOENT` when no file is there. */
  readonly readText: (repoPath: string) => Promise<string>;
  /**
   * The `.json` files directly under `root` (a repo path ending in `/`), sorted;
   * none when it is absent or cannot be listed: the live read treats every
   * directory-read failure as empty.
   */
  readonly listJsonFiles: (root: string) => Promise<readonly string[]>;
}

/** The reads of the repository on disk at `repoRoot`. */
export function liveSubstrateReads(repoRoot: string): SubstrateReads {
  return {
    readText: (repoPath) => readFile(absolutePath(repoRoot, repoPath), 'utf8'),
    listJsonFiles: (root) => listJsonFiles(repoRoot, root),
  };
}

/**
 * Read a surface whose absence the audit classifies: its text, or `undefined`
 * when no file is there. The read is the existence test, so nothing can change
 * between a check and the read (CodeQL `js/file-system-race`). Any other
 * failure is the `Err`, the original error intact (the Result pattern).
 */
export async function readTextIfPresent(
  reads: SubstrateReads,
  repoPath: string,
): Promise<Result<string | undefined, Error>> {
  try {
    return ok(await reads.readText(repoPath));
  } catch (error) {
    const failure = failureAsError(error, 'the practice-substrate surface read');
    return isErrnoCode(failure, 'ENOENT') ? ok(undefined) : err(failure);
  }
}
