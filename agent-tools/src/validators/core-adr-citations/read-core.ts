/**
 * The tracked Core files as text, for the Core ADR-citation validator.
 *
 * The entry point runs at import and reads the tree it lives in, so its
 * refusal branches cannot be exercised from a test without a seam. This module
 * is that seam: the two reads `readCore` makes (the tracked listing through
 * `repository-paths`, this estate's one git read path, and the text read
 * through `tracked-file-scan`) are injectable, and every branch is proven in
 * the read-core integration cells over in-memory readers. The live readers are the
 * default; the entry passes nothing.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import {
  describeGitReadFailure,
  listTrackedFiles,
  type GitReadFailure,
} from '../../core/repository-paths.js';
import {
  readScanFiles,
  type ScanFile,
  type UnreadableTrackedFile,
} from '../../core/tracked-file-scan.js';

import { isCorePath } from './validate-core-adr-citations-helpers.js';

/** The two reads `readCore` makes; the live pair by default, fakes in the cells. */
export interface CoreReaders {
  readonly listTrackedFiles: (repoRoot: string) => Result<readonly string[], GitReadFailure>;
  readonly readScanFiles: (
    repoRoot: string,
    relativePaths: readonly string[],
  ) => Result<ScanFile[], UnreadableTrackedFile>;
}

/** The readers the entry point uses: git through the trusted seam, files from disk. */
const liveReaders: CoreReaders = { listTrackedFiles, readScanFiles };

/**
 * The tracked Core files as text; a refusal reason when they cannot be listed
 * or read as text. Every failure is a refusal (the caller exits 2), never a
 * silent pass: a scan over a listing git could not give, or over a Core file
 * it could not read, would vouch for files it never saw.
 */
export function readCore(
  repoRoot: string,
  readers: CoreReaders = liveReaders,
): Result<ScanFile[], string> {
  const listing = readers.listTrackedFiles(repoRoot);
  if (!listing.ok) {
    return err(`cannot list tracked files — ${describeGitReadFailure(listing.error)}`);
  }
  const corePaths = listing.value.filter(isCorePath);
  if (corePaths.length === 0) {
    return err('zero tracked Core files found — refusing a vacuous pass');
  }
  const scan = readers.readScanFiles(repoRoot, corePaths);
  if (!scan.ok) {
    return err(
      `cannot read tracked file '${scan.error.relativePath}' — fix the file or its permissions; ` +
        `the scan must not skip a tracked file (${String(scan.error.cause)})`,
    );
  }
  if (scan.value.length !== corePaths.length) {
    const read = new Set(scan.value.map((file) => file.path));
    const dropped = corePaths.filter((corePath) => !read.has(corePath));
    return err(
      `tracked Core file(s) not scannable as text, so the scan cannot vouch for them: ` +
        dropped.join(', '),
    );
  }
  return ok(scan.value);
}
