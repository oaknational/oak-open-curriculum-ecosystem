/**
 * Which git repository a file belongs to, for a content block whose concept
 * covers only this repository's own files (`excludes_other_repositories`).
 *
 * @remarks
 * A repository is known by its common git directory: a primary checkout's
 * `.git` directory, which every worktree of it shares through the `gitdir`
 * line of its `.git` file and the `commondir` file beside that gitdir. So
 * this repository's worktrees read as this repository wherever they sit on
 * disk, and a checkout of any other repository reads as another. Two common
 * directories are compared by identity (device and inode on disk), never by
 * spelling, so a path spelt in another letter case, through a firmlink or
 * through a symbolic link names the one repository it reaches.
 *
 * The walk starts where the file really is (links followed to where the write
 * lands) and climbs to the nearest `.git` entry, reading the disk only through
 * the {@link RepositoryProbe} seam. A git directory counts only when git itself
 * would accept it: a valid `HEAD` in the git directory itself, and `objects/`
 * and `refs/` directories git can enter in its common directory.
 *
 * A file reads as in another repository only when its repository is found
 * and differs from this one's. A file in no repository, a `.git` entry that
 * cannot be read or is neither a directory nor a file, a `commondir` that
 * cannot be read, a path deeper than the climb allows, a relative path, or
 * an unknown own repository all read as not another repository, so an
 * exempting block keeps applying: the exemption fails closed, never open.
 *
 * @packageDocumentation
 */

import { dirname, isAbsolute, join, resolve } from 'node:path';

import { diskRepositoryProbe, type RepositoryProbe } from './repository-probe.js';

/** The most directories either climb visits; a deeper path names nothing, keeping the block. */
const MAX_CLIMB = 256;

/**
 * A worktree's or submodule's `.git` file as git itself accepts it: the whole file is one
 * `gitdir: <path>` line, so a file with anything more reads as malformed.
 */
const GITFILE = /^gitdir: ([^\r\n]+)[\r\n]*$/u;

/**
 * The first directory, from `start` upward, that `found` names something for,
 * within {@link MAX_CLIMB} steps; `undefined` at the filesystem root or the cap.
 */
function climb<T>(start: string, found: (directory: string) => T | undefined): T | undefined {
  let directory = start;
  for (let step = 0; step < MAX_CLIMB; step += 1) {
    const result = found(directory);
    if (result !== undefined) {
      return result;
    }
    const parent = dirname(directory);
    if (parent === directory) {
      return undefined;
    }
    directory = parent;
  }
  return undefined;
}

/**
 * Where a path really is: its real path; `null` when nothing is there; or `undefined` when an
 * entry is there that leads nowhere (a link to a path not made yet), which places nothing.
 */
function placeOf(path: string, probe: RepositoryProbe): string | null | undefined {
  const real = probe.realPath(path);
  if (real !== null) {
    return real;
  }
  return probe.entryExists(path) ? undefined : null;
}

/**
 * The directory where a file really is: its own real path's, or its nearest existing
 * directory's. A link on the way that leads nowhere places nothing, since the write would
 * land wherever the link points once that is made; nor does a file with another hard link,
 * whose content any of its paths, in any repository, may name.
 */
function realDirectoryOf(filePath: string, probe: RepositoryProbe): string | undefined {
  const place = placeOf(filePath, probe);
  if (place !== null) {
    return place === undefined || probe.sharedFile(place) ? undefined : dirname(place);
  }
  return climb(dirname(filePath), (directory) => {
    const found = placeOf(directory, probe);
    return found === null ? undefined : { found };
  })?.found;
}

/** The git directory a pointer file names, or `undefined` when it names none. */
function pointedGitDirectory(directory: string, probe: RepositoryProbe): string | undefined {
  const reading = probe.readText(join(directory, '.git'));
  const pointer = reading.kind === 'text' ? GITFILE.exec(reading.text)?.[1] : undefined;
  return pointer === undefined ? undefined : resolve(directory, pointer);
}

/**
 * A git directory's common directory: the one its `commondir` names, or itself
 * when it has none (git's own reading); `undefined` when `commondir` cannot be
 * read or names nothing.
 */
function commonOf(gitDirectory: string, probe: RepositoryProbe): string | undefined {
  const reading = probe.readText(join(gitDirectory, 'commondir'));
  if (reading.kind === 'absent') {
    return gitDirectory;
  }
  const pointer = reading.kind === 'text' ? reading.text.trim() : '';
  return pointer.length === 0 ? undefined : resolve(gitDirectory, pointer);
}

/**
 * A `HEAD` git accepts (git's `validate_headref`): within the first
 * {@link HEAD_WINDOW} bytes, `ref:` then ASCII whitespace then a reference
 * under `refs/`, or a detached object id.
 */
const VALID_HEAD = /^(?:ref:[ \t\n\r]*refs\/|[0-9a-fA-F]{40})/u;

/** The bytes of `HEAD` git reads to validate it; nothing past them counts. */
const HEAD_WINDOW = 255;

/**
 * Whether git itself would accept a git directory (git's `is_git_directory`):
 * its own `HEAD` is valid, and its common directory holds `objects/` and
 * `refs/` directories git can enter. A `.git` holding only a `HEAD`, or a
 * worktree gitdir borrowing another repository through `commondir` without a
 * `HEAD` of its own, is no repository.
 */
function isGitDirectory(gitDirectory: string, common: string, probe: RepositoryProbe): boolean {
  const head = probe.readText(join(gitDirectory, 'HEAD'));
  return (
    head.kind === 'text' &&
    VALID_HEAD.test(head.text.slice(0, HEAD_WINDOW)) &&
    probe.searchableDirectory(join(common, 'objects')) &&
    probe.searchableDirectory(join(common, 'refs'))
  );
}

/** The identity of the repository whose `.git` entry sits in `directory`, if it is a valid one. */
function identityAt(directory: string, entry: 'directory' | 'file', probe: RepositoryProbe) {
  const gitDirectory =
    entry === 'directory' ? join(directory, '.git') : pointedGitDirectory(directory, probe);
  const common = gitDirectory === undefined ? undefined : commonOf(gitDirectory, probe);
  if (
    gitDirectory === undefined ||
    common === undefined ||
    !isGitDirectory(gitDirectory, common, probe)
  ) {
    return undefined;
  }
  return probe.identity(common) ?? undefined;
}

/**
 * The identity of the repository holding a directory: its nearest `.git`
 * entry's common git directory. `null` stands for a `.git` entry found and
 * not understood, which stops the climb as surely as an answer does.
 */
function identityFrom(start: string, probe: RepositoryProbe): string | undefined {
  const found = climb(start, (directory): string | null | undefined => {
    const entry = probe.gitEntry(directory);
    if (entry === 'absent') {
      return undefined;
    }
    return entry === 'unknown' ? null : (identityAt(directory, entry, probe) ?? null);
  });
  return found ?? undefined;
}

/**
 * The identity of the repository holding `filePath`: its common git
 * directory's, found from where the file really is.
 *
 * @param filePath - An absolute path; the file itself need not exist yet.
 * @param probe - The disk reads.
 * @returns The identity, or `undefined` when the file is in no repository or
 *   its repository cannot be read.
 */
export function repositoryIdentity(filePath: string, probe: RepositoryProbe): string | undefined {
  const start = realDirectoryOf(filePath, probe);
  return start === undefined ? undefined : identityFrom(start, probe);
}

/**
 * Whether `filePath` lies in a git repository other than this one.
 *
 * @param filePath - The file a content change targets.
 * @param ownIdentity - This repository's identity, when known.
 * @param probe - The disk reads.
 * @returns `true` only when the file's repository is found and differs from
 *   this one; every unknown reads as `false` (fail closed).
 */
export function isInOtherRepository(
  filePath: string,
  ownIdentity: string | undefined,
  probe: RepositoryProbe,
): boolean {
  if (ownIdentity === undefined || !isAbsolute(filePath)) {
    return false;
  }
  const fileIdentity = repositoryIdentity(filePath, probe);
  return fileIdentity !== undefined && fileIdentity !== ownIdentity;
}

/**
 * The hook's test for a file in another repository: "another" is judged
 * against the repository `repoRoot` is in, whose identity is read once, on
 * the first file asked about, so a request that asks nothing reads nothing.
 *
 * @param repoRoot - The session's project directory.
 * @param probe - The disk reads; the live ones by default.
 * @returns Whether a file lies in a repository other than `repoRoot`'s.
 */
export function otherRepositoryTest(
  repoRoot: string,
  probe: RepositoryProbe = diskRepositoryProbe,
): (filePath: string) => boolean {
  let own: { readonly identity: string | undefined } | undefined;
  return (filePath) => {
    if (own === undefined) {
      const root = probe.realPath(repoRoot);
      own = { identity: root === null ? undefined : identityFrom(root, probe) };
    }
    return isInOtherRepository(filePath, own.identity, probe);
  };
}
