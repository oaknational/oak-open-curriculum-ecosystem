/**
 * The projection leg's mutations and the port it takes: each write and removal re-classifies
 * its ancestors and its leaf unfollowed immediately before acting (`rule-surface-fs.ts`) and
 * refuses when the entry is not what a projection surface admits (a real directory above,
 * an absent or regular-file leaf), so a link, directory or special entry at the leaf is
 * refused, never written through or unlinked (a link swapped in at the leaf after its
 * classification is replaced whole by the rename, the safe outcome); the write is the
 * estate's atomic writer (a synced temp file renamed over the leaf, so a failed write leaves
 * no partial file) and the removal unlinks the leaf itself (the #74 round-three finding,
 * 2026-09-14). What
 * remains is the window between an ancestor's classification and the mkdir, rename or unlink
 * into it: a link swapped in there is resolved by every later call, so the residue is a
 * directory created, a projection's text renamed over a regular file of the projection's
 * basename, or a regular file of a stale basename unlinked, wherever the link points. Named
 * here and closed by nothing short of directory descriptors, which Node does not expose.
 * Every outcome is typed: a refusal before the act and a failure of the act itself (a
 * permission, a full disk, a directory swapped in at the leaf) both return the reason, so
 * the leg ends a fix run at the first with what it had written on record.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { isEnoent } from '../../core/authored-surfaces.js';

import type { DirectoryListing, EntryRead } from './directory-listing.js';
import {
  classifyAncestors,
  listDirectory,
  readEntry,
  realSurfaceFs,
  type SurfaceFs,
} from './rule-surface-fs.js';

/** The mutation being admitted, for the refusal's wording. */
type Act = 'write' | 'removal';

function refusing(act: Act): string {
  return act === 'write' ? 'refusing the projection write' : 'refusing to remove it';
}

function causeOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Every ancestor a real directory (created when absent for a write), else the refusal. */
async function admitAncestors(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs,
  act: Act,
): Promise<Result<undefined, string>> {
  const relDir = path.posix.dirname(relPath);
  const ancestor =
    relDir === '.' ? undefined : await classifyAncestors(repoRoot, relDir, surfaceFs);
  if (ancestor === undefined || ancestor.kind === 'files') {
    return ok(undefined);
  }
  if (ancestor.kind === 'absent' && act === 'write') {
    // POSIX joins throughout: every surface path is POSIX-relative, Node's fs accepts forward slashes
    // on Windows, and the fakes the tests inject key their trees by POSIX paths.
    await surfaceFs.mkdir(path.posix.join(repoRoot, relDir));
    return ok(undefined);
  }
  if (ancestor.kind === 'foreign') {
    return err(`${ancestor.entry}: not a directory at the moment of the ${act}; ${refusing(act)}`);
  }
  const why = ancestor.kind === 'absent' ? 'vanished' : `unreadable (${ancestor.cause})`;
  return err(`${relDir}: ${why}; ${refusing(act)}`);
}

/** The whole mutation as a typed outcome: a failure of the file system is the reason, never a throw. */
async function attempt(
  relPath: string,
  act: Act,
  perform: () => Promise<Result<undefined, string>>,
): Promise<Result<undefined, string>> {
  try {
    return await perform();
  } catch (error: unknown) {
    return err(`${relPath}: ${causeOf(error)}; the projection ${act} failed`);
  }
}

/** The leaf as `lstat` finds it at the moment of the mutation. */
async function leafKind(
  absolutePath: string,
  surfaceFs: SurfaceFs,
): Promise<'absent' | 'file' | 'other'> {
  try {
    return (await surfaceFs.lstat(absolutePath)).isFile() ? 'file' : 'other';
  } catch (error: unknown) {
    if (isEnoent(error)) {
      return 'absent';
    }
    throw error;
  }
}

/**
 * Write a projection at `<repoRoot>/<relPath>`: ancestors admitted (created when absent), the
 * leaf absent or a regular file at the moment of the write, then the atomic writer; a
 * failure of any call along the way is the outcome.
 */
export function writeProjection(
  repoRoot: string,
  relPath: string,
  text: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<Result<undefined, string>> {
  return attempt(relPath, 'write', async () => {
    const admitted = await admitAncestors(repoRoot, relPath, surfaceFs, 'write');
    if (!admitted.ok) {
      return admitted;
    }
    const absolutePath = path.posix.join(repoRoot, relPath);
    if ((await leafKind(absolutePath, surfaceFs)) === 'other') {
      return err(`${relPath}: not a regular file at the moment of the write; ${refusing('write')}`);
    }
    await surfaceFs.writeAtomically(absolutePath, text);
    return ok(undefined);
  });
}

/**
 * Remove a stale projection at `<repoRoot>/<relPath>`: ancestors admitted, the leaf a regular
 * file at the moment of the removal, then the leaf itself unlinked; a failure of any call
 * along the way is the outcome.
 */
export function removeProjection(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<Result<undefined, string>> {
  return attempt(relPath, 'removal', async () => {
    const admitted = await admitAncestors(repoRoot, relPath, surfaceFs, 'removal');
    if (!admitted.ok) {
      return admitted;
    }
    const absolutePath = path.posix.join(repoRoot, relPath);
    if ((await leafKind(absolutePath, surfaceFs)) !== 'file') {
      return err(
        `${relPath}: not a regular file at the moment of the removal; ${refusing('removal')}`,
      );
    }
    await surfaceFs.remove(absolutePath);
    return ok(undefined);
  });
}

/** The file-system operations the projection leg needs, repo-relative, every one a typed outcome. */
export interface RuleProjectionFs {
  listDirectory: (relDir: string, extension: string) => Promise<DirectoryListing>;
  readEntry: (relPath: string) => Promise<EntryRead>;
  writeText: (relPath: string, text: string) => Promise<Result<undefined, string>>;
  removeFile: (relPath: string) => Promise<Result<undefined, string>>;
}

/** The real port over `<repoRoot>`. */
export function realRuleProjectionFs(repoRoot: string): RuleProjectionFs {
  return {
    listDirectory: (relDir, extension) => listDirectory(repoRoot, relDir, extension),
    readEntry: (relPath) => readEntry(repoRoot, relPath),
    writeText: (relPath, text) => writeProjection(repoRoot, relPath, text),
    removeFile: (relPath) => removeProjection(repoRoot, relPath),
  };
}
