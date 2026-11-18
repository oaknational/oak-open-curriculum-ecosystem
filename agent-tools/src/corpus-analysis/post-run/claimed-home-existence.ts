import { lstatSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { assertPathWithinBase, type AssertPathWithinBaseOptions } from '@oaknational/safe-path';

import { toGitPath } from '../../core/git-relative-path.js';
import { CORROBORATION_ROOTS } from '../corroboration-roots.js';
import type { CorroborationClaim } from '../real-world-signal.js';

/**
 * Resolve which claimed corroboration homes genuinely exist on disk, anchored at the
 * repo root.
 *
 * @remarks
 * The meta stage claims home paths under the two corroboration roots, repo-relative
 * (e.g. `.agent/rules/x.md`) or in the absolute form it emits. Checking
 * them with a bare `existsSync` resolves against the process working directory — the
 * agent-tools workspace under the documented driver usage — so every real home reads
 * as missing. This helper anchors each claim at the supplied repo root instead, via
 * `assertPathWithinBase` exactly as the driver's checkpoint reads do (tssecurity:S8707
 * lineage): success proves the path both EXISTS (`realpathSync` throws on an absent
 * path) and stays CONTAINED within its corroboration root, so a claim that is absent or
 * that escapes the root is simply not corroborating — a discrepancy the caller surfaces,
 * never a crash. The root is matched on the claim's repo-relative form, so the absolute
 * spelling of a home corroborates exactly as its relative spelling does.
 *
 * The returned set carries each claim's ORIGINAL path string, so downstream
 * set-membership against the claims themselves (`corroborateAgainstHomes`) matches.
 * Existence means a regular file: a claim whose path is a directory or any other kind of
 * entry does not corroborate (`isRegularFile`, `lstatSync(...).isFile()` on the canonical
 * path by default);
 * claims are pipeline-internal document paths from a committed, zod-validated checkpoint.
 *
 * @param input - The corroboration claims and the repo root to anchor them at.
 * @param options - The safe-path canonicalisation seam and the regular-file seam; tests
 *   inject a pure map and a pure predicate.
 * @returns The claimed home paths that exist on disk as regular files within their root.
 */
export function existingClaimedHomePaths(
  input: {
    readonly claims: readonly CorroborationClaim[];
    readonly repoRoot: string;
  },
  options: ClaimedHomeOptions = {},
): ReadonlySet<string> {
  const existing = new Set<string>();
  for (const claim of input.claims) {
    for (const home of claim.claimedHomePaths) {
      if (claimedHomeExists({ home, repoRoot: input.repoRoot }, options)) {
        existing.add(home);
      }
    }
  }
  return existing;
}

/** The existence seams: the safe-path realpath, and a regular-file check. */
export interface ClaimedHomeOptions extends AssertPathWithinBaseOptions {
  /**
   * Whether the canonical path names a regular file. Defaults to `lstatSync`, which does
   * not follow a symlink swapped in after the realpath; a throw reads as not corroborating.
   */
  readonly isRegularFile?: (path: string) => boolean;
}

function isRegularFileOnDisk(path: string): boolean {
  return lstatSync(path).isFile();
}

function claimedHomeExists(
  input: { readonly home: string; readonly repoRoot: string },
  options: ClaimedHomeOptions,
): boolean {
  // A claim outside the two roots the prompt names (`.git/HEAD`, a directory, an unrelated
  // file) is never corroboration, existing or not. The root is matched on the claim's
  // repo-relative form (a parent segment resolved first, an absolute claim relativised). The
  // root must itself stay within the repo root, and the claim within the root, so neither a
  // symlinked root nor a symlink after the prefix can leave the checkout.
  const claimedPath = resolve(input.repoRoot, input.home);
  const repoRelativeHome = toGitPath(relative(input.repoRoot, claimedPath));
  const matchedRoot = CORROBORATION_ROOTS.find((candidate) =>
    repoRelativeHome.startsWith(candidate),
  );
  if (matchedRoot === undefined) {
    return false;
  }
  const isRegularFile = options.isRegularFile ?? isRegularFileOnDisk;
  try {
    const rootPath = resolve(input.repoRoot, matchedRoot);
    assertPathWithinBase(rootPath, input.repoRoot, options);
    const safePath = assertPathWithinBase(claimedPath, rootPath, options);
    return isRegularFile(safePath);
  } catch {
    // Absent on disk, escaping its root, or unreadable by stat — in each case the claim is
    // not corroborating; the caller reports it as a missing claim.
    return false;
  }
}
