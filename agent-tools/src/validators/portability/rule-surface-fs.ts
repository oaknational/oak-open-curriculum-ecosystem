/**
 * The projection leg's surface reads: the listing and the single-entry read, each a typed
 * outcome and never a throw past the leg's refusal contract; the mutations and the port the
 * leg takes are next door (`rule-projection-fs.ts`) over the same injected `SurfaceFs`.
 *
 * Nothing here follows a link. The listing walks every path segment of the surface with
 * `lstat`, so a surface root or ancestor that is a symlink is `foreign` before `readdir`
 * could follow it into another tree (the #74 round-one finding, 2026-09-14). The entry read
 * re-classifies the ancestor chain and the leaf unfollowed immediately before the open, then
 * reads through the estate's fd-anchored reader (`read-regular-file.ts`: one open with
 * `O_NOFOLLOW` and `O_NONBLOCK` where the host has them, so a link at the leaf fails the open
 * and a fifo cannot block it; the post-open device-and-inode identity check where it has
 * not), so a link swapped in at the leaf between the classification and the open is read as
 * `foreign`, never as its target (rounds three and four). Each mutation re-classifies its
 * ancestors and its leaf the same way and refuses when the entry is not what a projection
 * surface admits (a real directory above, an absent or regular-file leaf): a link at the leaf
 * is refused, never written through, replaced or unlinked. What remains, for the read as for
 * the mutations, is the window between an ancestor's classification and the open, mkdir,
 * rename or unlink under it: `O_NOFOLLOW` guards the leaf only, so a link swapped into an
 * ancestor there is followed and the act lands wherever it points
 * (`rule-projection-fs.ts` says what that admits); closed by nothing short of directory
 * descriptors, which Node does not expose. ENOENT is the only failure read as absence. The
 * `node:fs` calls are an injected port (`SurfaceFs`), so every order-of-operations claim is
 * proven over an in-memory tree.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { writeTextAtomically } from '../../collaboration-state/atomic-file.js';
import { isEnoent } from '../../core/authored-surfaces.js';
import { toLfText } from '../../core/lf-text.js';
import type { FsRead } from '../../skills-adapter-generate/carriage-fs.js';
import { readRegularFileTextNoFollow } from '../../skills-adapter-generate/read-regular-file.js';

import {
  classifyDirectoryEntries,
  type DirectoryEntry,
  type DirectoryListing,
  type EntryRead,
} from './directory-listing.js';

/** What `lstat` says about a path, its leaf unfollowed (`fs.Stats` satisfies it). */
export interface UnfollowedStat {
  isFile(): boolean;
  isDirectory(): boolean;
}

/**
 * The calls the surface helpers make, all on absolute paths; the real `node:fs` by default.
 * `readUnfollowed` is the fd-anchored no-follow read: the text of a regular file, `undefined`
 * when nothing regular of ours stands at the name (a link, a directory, a special file,
 * nothing), a typed failure otherwise; `writeAtomically` renames a synced temp file over the
 * leaf; `remove` unlinks the leaf itself.
 */
export interface SurfaceFs {
  lstat: (absolutePath: string) => Promise<UnfollowedStat>;
  readdir: (absolutePath: string) => Promise<readonly DirectoryEntry[]>;
  readUnfollowed: (absolutePath: string) => Promise<FsRead<string | undefined>>;
  mkdir: (absolutePath: string) => Promise<void>;
  writeAtomically: (absolutePath: string, text: string) => Promise<void>;
  remove: (absolutePath: string) => Promise<void>;
}

/** The real file system. */
export const realSurfaceFs: SurfaceFs = {
  lstat: (absolutePath) => fs.lstat(absolutePath),
  readdir: (absolutePath) => fs.readdir(absolutePath, { withFileTypes: true }),
  readUnfollowed: readRegularFileTextNoFollow,
  mkdir: async (absolutePath) => {
    await fs.mkdir(absolutePath, { recursive: true });
  },
  writeAtomically: (absolutePath, text) => writeTextAtomically(absolutePath, text),
  remove: (absolutePath) => fs.rm(absolutePath),
};

function causeOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function failed(error: unknown): { kind: 'absent' } | { kind: 'unreadable'; cause: string } {
  return isEnoent(error) ? { kind: 'absent' } : { kind: 'unreadable', cause: causeOf(error) };
}

/**
 * The first ancestor of `<repoRoot>/<relDir>` (the directory itself included) that is not a
 * directory when its leaf is left unfollowed, as a listing outcome; `undefined` when every
 * segment is a real directory.
 */
export async function classifyAncestors(
  repoRoot: string,
  relDir: string,
  surfaceFs: SurfaceFs,
): Promise<DirectoryListing | undefined> {
  const segments = relDir.split('/');
  for (let depth = 1; depth <= segments.length; depth += 1) {
    const prefix = segments.slice(0, depth).join('/');
    try {
      // POSIX joins throughout: every surface path is POSIX-relative, Node's fs accepts forward slashes
      // on Windows, and the fakes the tests inject key their trees by POSIX paths.
      if (!(await surfaceFs.lstat(path.posix.join(repoRoot, prefix))).isDirectory()) {
        return { kind: 'foreign', entry: prefix };
      }
    } catch (error: unknown) {
      return failed(error);
    }
  }
  return undefined;
}

/**
 * List the regular files in `<repoRoot>/<relDir>`, sorted, as a typed outcome: absence is
 * ENOENT and nothing else, any other read failure is `unreadable`, and a directory, symlink or
 * special entry, on the surface or as the surface itself or any of its ancestors, is `foreign`
 * before any file is listed (`directory-listing.ts` says why a directory is foreign on a rule
 * surface). A caller that acts destructively on the listing can therefore never read a failure
 * as "nothing here" (the posture `carriage-fs.ts` documents).
 *
 * @param repoRoot  - Absolute path to the repository root.
 * @param relDir    - Repo-relative path to the directory to list.
 * @param extension - File extension that marks a rule file (including the leading dot).
 * @param surfaceFs - The file-system port; the real `node:fs` by default.
 * @returns The listing outcome; file paths are repo-relative.
 */
export async function listDirectory(
  repoRoot: string,
  relDir: string,
  extension: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<DirectoryListing> {
  const ancestor = await classifyAncestors(repoRoot, relDir, surfaceFs);
  if (ancestor !== undefined) {
    return ancestor;
  }
  try {
    const entries = await surfaceFs.readdir(path.posix.join(repoRoot, relDir));
    return classifyDirectoryEntries(relDir, entries, extension);
  } catch (error: unknown) {
    return failed(error);
  }
}

/**
 * Why the ancestor chain cannot be read, classified unfollowed at the moment of the read;
 * `undefined` when every segment is a real directory (or the path has none).
 */
async function ancestorRefusal(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs,
): Promise<EntryRead | undefined> {
  const relDir = path.posix.dirname(relPath);
  const ancestor =
    relDir === '.' ? undefined : await classifyAncestors(repoRoot, relDir, surfaceFs);
  if (ancestor === undefined) {
    return undefined;
  }
  return ancestor.kind === 'absent' || ancestor.kind === 'unreadable'
    ? ancestor
    : { kind: 'foreign' };
}

/** Why the leaf cannot be read, as `lstat` finds it at the moment of the read; `undefined` for a regular file. */
async function leafRefusal(
  absolutePath: string,
  surfaceFs: SurfaceFs,
): Promise<EntryRead | undefined> {
  try {
    return (await surfaceFs.lstat(absolutePath)).isFile() ? undefined : { kind: 'foreign' };
  } catch (error: unknown) {
    return failed(error);
  }
}

/** The fd-anchored read of a leaf just classified as a regular file. */
async function readLeaf(absolutePath: string, surfaceFs: SurfaceFs): Promise<EntryRead> {
  const read = await surfaceFs.readUnfollowed(absolutePath);
  if (read.kind === 'failure') {
    return { kind: 'unreadable', cause: read.message };
  }
  return read.value === undefined
    ? { kind: 'foreign' }
    : { kind: 'text', text: toLfText(read.value) };
}

/**
 * Read the regular file at `<repoRoot>/<relPath>` as a typed outcome: its ancestor chain and
 * its leaf are classified unfollowed first (a link or directory anywhere on the way is
 * `foreign` before any open), then the leaf is read through the fd-anchored no-follow
 * reader, so an entry swapped for a link, a directory or nothing after the classification is
 * `foreign` too; ENOENT alone is `absent`; any other failure is `unreadable` with its cause.
 * Text is LF-normalised as `readText` normalises it.
 *
 * @param repoRoot  - Absolute path to the repository root.
 * @param relPath   - Repo-relative path to the file.
 * @param surfaceFs - The file-system port; the real `node:fs` by default.
 * @returns The read outcome.
 */
export async function readEntry(
  repoRoot: string,
  relPath: string,
  surfaceFs: SurfaceFs = realSurfaceFs,
): Promise<EntryRead> {
  const absolutePath = path.posix.join(repoRoot, relPath);
  return (
    (await ancestorRefusal(repoRoot, relPath, surfaceFs)) ??
    (await leafRefusal(absolutePath, surfaceFs)) ??
    readLeaf(absolutePath, surfaceFs)
  );
}
