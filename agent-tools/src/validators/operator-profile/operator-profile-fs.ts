/**
 * Operator profile — the filesystem primitives behind the root reader:
 * probing presence without following links, listing a directory without
 * following links, and the document reader of `operator-profile-read.ts`.
 * Absence is a first-class outcome, never an error; an unreadable path is an
 * error, never absence; a symlink found at a probed or listed entry is a
 * symlink, never what it points at. A directory swapped for a link after
 * its probe is not guarded (the reader's module note gives the boundary).
 */

import { type Dirent, type Stats } from 'node:fs';
import { lstat, readdir } from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { type ProfileEntry, type ProfileEntryKind } from './operator-profile-layout.js';
import { errorCode, readDocument } from './operator-profile-read.js';

export type Presence = 'directory' | 'absent' | 'not-a-directory' | 'symlink';

/** Reports what is at a path; the filesystem one is the default, tests inject a fake. */
export type PresenceProbe = (target: string) => Promise<Result<Presence, string>>;

/** The two questions presence asks of a stat; `lstat`'s answer is one. */
export type StatProbe = (target: string) => Promise<Pick<Stats, 'isDirectory' | 'isSymbolicLink'>>;

/**
 * What is at a path, read WITHOUT following links (`lstat`): a symlinked
 * root or scoped directory reports as a symlink, never as the directory it
 * points at, so nothing outside the profile root is listed through a link
 * present at the probe. An entry swapped for a link after the probe is not
 * guarded (`listEntries` and the reader's module note give the boundary).
 * Genuine absence (ENOENT, the expected condition) is distinguished from an
 * operational failure such as EACCES, which is never reported as absence.
 *
 * @param target - the path to probe
 * @param probe - the stat to ask (`lstat` by default; tests inject a fake)
 * @returns the presence, or the failure to read it
 */
export async function presence(
  target: string,
  probe: StatProbe = lstat,
): Promise<Result<Presence, string>> {
  try {
    const stats = await probe(target);
    if (stats.isSymbolicLink()) {
      return ok('symlink');
    }
    return ok(stats.isDirectory() ? 'directory' : 'not-a-directory');
  } catch (cause) {
    const code = errorCode(cause);
    if (code === 'ENOENT') {
      return ok('absent');
    }
    return err(`cannot read ${target} (${code})`);
  }
}

/** The three questions a listing entry answers; `Dirent` is one such object. */
export type EntryType = Pick<Dirent, 'isSymbolicLink' | 'isDirectory' | 'isFile'>;

/**
 * The entry's own kind: `readdir` does not follow links, so a symlink reports
 * as one, whatever it points at.
 *
 * @param entry - the listing entry
 * @returns the kind the layout classifies by
 */
export function entryKind(entry: EntryType): ProfileEntryKind {
  if (entry.isSymbolicLink()) {
    return 'symlink';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  return entry.isFile() ? 'file' : 'other';
}

/** One listed entry: its name and what it is. */
interface ListedEntry {
  readonly name: string;
  readonly type: EntryType;
}

/** Lists a directory's entries with their types; `readdir` with file types is one. */
export type ReadDirectory = (dir: string) => Promise<readonly ListedEntry[]>;

const readDirectoryReal: ReadDirectory = async (dir) =>
  (await readdir(dir, { withFileTypes: true })).map((entry) => ({ name: entry.name, type: entry }));

/**
 * List one level of the profile root: the root itself, or one of its scoped
 * directories. A scoped directory that is absent or not a directory lists
 * as empty, and so does a scoped directory that is a symlink at its probe:
 * the root listing reports the link itself as not regular. A directory
 * swapped for a link after its probe is listed through, within the
 * boundary the reader's module note states. A listing the platform refuses
 * after the probe (a permission change, a directory removed in between) is
 * a failure, never a thrown error.
 *
 * @param root - the profile root
 * @param dirName - the scoped directory to list, or undefined for the root
 * @param probe - the presence probe (the filesystem by default)
 * @param readDirectory - the lister (the filesystem by default)
 * @returns the entries with their kinds, or the failure to read the directory
 */
export async function listEntries(
  root: string,
  dirName: string | undefined,
  probe: PresenceProbe = presence,
  readDirectory: ReadDirectory = readDirectoryReal,
): Promise<Result<ProfileEntry[], string>> {
  const dir = dirName === undefined ? root : path.join(root, dirName);
  const there = await probe(dir);
  if (!there.ok) {
    return there;
  }
  if (there.value !== 'directory') {
    return ok([]);
  }
  const prefix = dirName === undefined ? '' : `${dirName}/`;
  try {
    const entries = await readDirectory(dir);
    return ok(
      entries.map((entry) => ({ relPath: `${prefix}${entry.name}`, kind: entryKind(entry.type) })),
    );
  } catch (cause) {
    return err(`cannot list ${dir} (${errorCode(cause)})`);
  }
}

/**
 * Whether the root is a git repository (a `.git` directory, or a worktree's
 * `.git` file), read WITHOUT following links: a symlinked `.git` is refused,
 * never followed into another repository's git directory, and a probe the
 * platform refuses is the error it is, never "not a repository".
 *
 * @param root - the profile root
 * @param probe - the stat to ask (`lstat` by default; tests inject a fake)
 * @returns whether a repository is there, or the refusal or failure
 */
export async function isGitRepository(
  root: string,
  probe: StatProbe = lstat,
): Promise<Result<boolean, string>> {
  const gitDir = path.join(root, '.git');
  const there = await presence(gitDir, probe);
  if (!there.ok) {
    return there;
  }
  if (there.value === 'symlink') {
    return err(`${gitDir} is a symlink — the profile repository is never followed`);
  }
  return ok(there.value !== 'absent');
}

/** The filesystem the root reader goes through; tests inject a fake. */
export interface ProfileFileSystem {
  readonly presence: PresenceProbe;
  readonly listEntries: (
    root: string,
    dirName: string | undefined,
  ) => Promise<Result<ProfileEntry[], string>>;
  readonly readDocument: (absolute: string) => Promise<Result<string, string>>;
  readonly isGitRepository: (root: string) => Promise<Result<boolean, string>>;
}

/** The real filesystem behind every probe, lister and reader; the default of `readProfileReport`. */
export const REAL_PROFILE_FILE_SYSTEM: ProfileFileSystem = {
  presence: (target) => presence(target),
  listEntries: (root, dirName) => listEntries(root, dirName),
  readDocument: (absolute) => readDocument(absolute),
  isGitRepository: (root) => isGitRepository(root),
};
