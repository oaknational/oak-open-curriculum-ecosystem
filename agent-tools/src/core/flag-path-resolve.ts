import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { assertPathWithinBase } from '@oaknational/safe-path';

import { nodeSyncFileSystem, type SyncFileSystem } from './sync-file-system.js';

/**
 * Flag-path resolution for agent-tools CLIs: constrain caller-supplied
 * paths to the repository with read/write-appropriate canonicalisation.
 * Born in the plan-corpus refounding CLIs (retired 2026-11-01) and consolidated
 * here at their third consumer; used by restatement-audit, merge-bot and spawn.
 *
 * Read targets must already exist, so they canonicalise with
 * {@link assertPathWithinBase} directly — `realpathSync` resolves `..` AND
 * symlinks, and its throw-on-missing is the correct refusal for a path the
 * tool is about to read.
 *
 * Write targets need not exist yet: `realpathSync` would throw ENOENT on
 * them, making a CLI refuse to create its own artefacts (the founding
 * defect, caught on `refound-plant-challenge-canary`'s output flags).
 * Containment is therefore asserted lexically on the resolved path, and the
 * symlink-resolving assertion runs on the deepest EXISTING ancestor — an
 * ancestor symlinked outside the repo is rejected before any later `mkdir`
 * or write could follow it. Directory creation stays deferred to each
 * tool's write phase, after every refusal has passed.
 *
 * Both resolvers probe the file system through {@link PathProbe}, the
 * process's own by default; the probe carries no write, so resolution cannot
 * create anything, and the refusals are proved over an in-memory tree.
 *
 * @packageDocumentation
 */

/** The three probes write-target resolution is made of. */
export type PathProbe = Pick<SyncFileSystem, 'exists' | 'isSymbolicLink' | 'realpath'>;

/** Deepest ancestor of `absPath` (possibly itself) that exists. */
export function nearestExistingAncestor(
  absPath: string,
  exists: PathProbe['exists'] = nodeSyncFileSystem.exists,
): string {
  let dir = absPath;
  while (!exists(dir)) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      return dir;
    }
    dir = parent;
  }
  return dir;
}

/** Canonicaliser seam for {@link resolveReadPathWithinRepo} (ADR-078). */
export interface ReadPathOptions {
  /**
   * Canonicalises a path to its real, symlink-resolved form. Defaults to the
   * `assertPathWithinBase` default (`realpathSync`); tests inject a pure
   * function to prove containment refusals with literal fixtures and no IO.
   */
  readonly realpath?: (path: string) => string;
}

/**
 * Resolve a flag path the tool will READ, constrained to the repository.
 * Returns the canonical (symlink-resolved) path; a missing path refuses.
 */
export function resolveReadPathWithinRepo(
  repoRoot: string,
  flagPath: string,
  options: ReadPathOptions = {},
): Result<string, Error> {
  try {
    return ok(
      assertPathWithinBase(
        path.resolve(repoRoot, flagPath),
        repoRoot,
        options.realpath === undefined ? {} : { realpath: options.realpath },
      ),
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(message));
  }
}

/**
 * Resolve a flag path the tool will WRITE (a file or directory that may not
 * exist yet), constrained to the repository WITHOUT requiring existence and
 * WITHOUT creating anything. Returns the lexically resolved path.
 */
export function resolveWriteTargetWithinRepo(
  repoRoot: string,
  flagPath: string,
  probe: PathProbe = nodeSyncFileSystem,
): Result<string, Error> {
  const targetAbs = path.resolve(repoRoot, flagPath);
  if (targetAbs !== repoRoot && !targetAbs.startsWith(`${repoRoot}${path.sep}`)) {
    return err(new Error(`'${flagPath}' resolves outside the repository`));
  }
  // Dangling-symlink write bypass (security-expert, R0b gateway 2026-07-07):
  // `exists` FOLLOWS symlinks, so a dangling link at the target reports
  // "absent", the ancestor walk skips over it, and a later write would
  // create the file at the link's destination -- possibly outside the repo.
  // An existing symlink is realpath-checked below; the dangling case refuses.
  if (probe.isSymbolicLink(targetAbs) && !probe.exists(targetAbs)) {
    return err(
      new Error(
        `'${flagPath}' is a dangling symlink -- a write would follow it to an unverifiable ` +
          'destination; refusing',
      ),
    );
  }
  try {
    assertPathWithinBase(nearestExistingAncestor(targetAbs, probe.exists), repoRoot, {
      realpath: probe.realpath,
    });
    return ok(targetAbs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(message));
  }
}
