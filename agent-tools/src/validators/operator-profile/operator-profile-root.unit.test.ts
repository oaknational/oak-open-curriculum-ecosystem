import path from 'node:path';

import { err, ok, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { VALID_INDEX_DOCUMENT } from './operator-profile-fixtures.js';
import {
  entryKind,
  isGitRepository,
  listEntries,
  type Presence,
  presence,
  type PresenceProbe,
  type ProfileFileSystem,
  type StatProbe,
} from './operator-profile-fs.js';
import {
  type DocumentHandle,
  type EntryIdentity,
  type ReadProbes,
  readDocument,
} from './operator-profile-read.js';
import { type ProfileEntry } from './operator-profile-layout.js';
import { existingProfilePaths, readProfileReport } from './operator-profile-root.js';

// The probe is injected: nothing here touches a filesystem. The fake answers
// by the path's last segment, as the real probe answers by what is on disk.
const ROOT = path.join('profile-root');

type Present = Readonly<Record<string, Exclude<Presence, 'absent'>>>;

function probeOf(present: Present): PresenceProbe {
  return (target) => Promise.resolve(ok(present[path.basename(target)] ?? 'absent'));
}

describe('existingProfilePaths — the document paths a push may stage', () => {
  it('lists only the paths that exist, in layout order, so a minimal profile can be pushed', async () => {
    const probe = probeOf({ 'index.md': 'not-a-directory', machines: 'directory' });
    expect(unwrap(await existingProfilePaths(ROOT, probe))).toEqual(['index.md', 'machines']);
  });

  it('lists nothing for an empty root and everything for a full one', async () => {
    expect(unwrap(await existingProfilePaths(ROOT, probeOf({})))).toEqual([]);
    const full = probeOf({
      'index.md': 'not-a-directory',
      repos: 'directory',
      machines: 'directory',
    });
    expect(unwrap(await existingProfilePaths(ROOT, full))).toEqual([
      'index.md',
      'repos',
      'machines',
    ]);
  });

  it('refuses a symlinked document path rather than staging it', async () => {
    const probe = probeOf({ 'index.md': 'symlink' });
    const result = await existingProfilePaths(ROOT, probe);
    expect(result.ok ? '' : result.error).toContain('index.md at profile-root is a symlink');
  });

  it('reports an unreadable path as an error, never as absent', async () => {
    const probe: PresenceProbe = (target) =>
      Promise.resolve(
        path.basename(target) === 'repos' ? err(`cannot read ${target} (EACCES)`) : ok('absent'),
      );
    const result = await existingProfilePaths(ROOT, probe);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.error).toContain('EACCES');
  });
});

describe('presence — what is at a path, never following a link', () => {
  const statOf = (symlink: boolean, directory: boolean) => () =>
    Promise.resolve({ isSymbolicLink: () => symlink, isDirectory: () => directory });

  it('reports a symlink as a symlink even when it points at a directory', async () => {
    expect(unwrap(await presence('repos', statOf(true, true)))).toBe('symlink');
    expect(unwrap(await presence('repos', statOf(false, true)))).toBe('directory');
    expect(unwrap(await presence('index.md', statOf(false, false)))).toBe('not-a-directory');
  });

  it('reads ENOENT as absence and any other failure as an error', async () => {
    const enoent = Object.assign(new Error('missing'), { code: 'ENOENT' });
    expect(unwrap(await presence('nowhere', () => Promise.reject(enoent)))).toBe('absent');
    const eacces = Object.assign(new Error('denied'), { code: 'EACCES' });
    const denied = await presence('locked', () => Promise.reject(eacces));
    expect(denied).toEqual({ ok: false, error: 'cannot read locked (EACCES)' });
  });
});

describe('listEntries — one level, never through a link, never a thrown error', () => {
  const directory: PresenceProbe = () => Promise.resolve(ok('directory'));

  it('lists a scoped directory that is a symlink as empty, so nothing behind it is ever read', async () => {
    const linked: PresenceProbe = () => Promise.resolve(ok('symlink'));
    const reads: string[] = [];
    const lister = (dir: string) => {
      reads.push(dir);
      return Promise.resolve([]);
    };
    expect(unwrap(await listEntries(ROOT, 'repos', linked, lister))).toEqual([]);
    expect(reads).toEqual([]);
  });

  it('turns a listing the platform refuses after the probe into an error, never a throw', async () => {
    const eacces = Object.assign(new Error('denied'), { code: 'EACCES' });
    const listed = await listEntries(ROOT, 'repos', directory, () => Promise.reject(eacces));
    expect(listed).toEqual({
      ok: false,
      error: `cannot list ${path.join(ROOT, 'repos')} (EACCES)`,
    });
  });

  it("prefixes scoped entries with their directory and keeps each entry's kind", async () => {
    const lister = () =>
      Promise.resolve([
        {
          name: 'a--b.md',
          type: { isSymbolicLink: () => false, isDirectory: () => false, isFile: () => true },
        },
        {
          name: 'link.md',
          type: { isSymbolicLink: () => true, isDirectory: () => false, isFile: () => false },
        },
      ]);
    expect(unwrap(await listEntries(ROOT, 'repos', directory, lister))).toEqual([
      { relPath: 'repos/a--b.md', kind: 'file' },
      { relPath: 'repos/link.md', kind: 'symlink' },
    ]);
  });
});

describe('entryKind', () => {
  it('reports a symlink as a symlink whatever it points at, then a directory, a file, or other', () => {
    const answers = (symlink: boolean, directory: boolean, file: boolean) => ({
      isSymbolicLink: () => symlink,
      isDirectory: () => directory,
      isFile: () => file,
    });
    expect(entryKind(answers(true, false, false))).toBe('symlink');
    expect(entryKind(answers(true, true, false))).toBe('symlink');
    expect(entryKind(answers(false, true, false))).toBe('directory');
    expect(entryKind(answers(false, false, true))).toBe('file');
    expect(entryKind(answers(false, false, false))).toBe('other');
  });
});

/** A fake filesystem: a fixed listing, a fixed document text, and the reads it was asked for. */
function fakeFileSystem(
  entries: readonly ProfileEntry[],
  text: string,
): { readonly fs: ProfileFileSystem; readonly reads: string[] } {
  const reads: string[] = [];
  const fs: ProfileFileSystem = {
    presence: () => Promise.resolve(ok('directory')),
    listEntries: (_root, dirName) => Promise.resolve(ok(dirName === undefined ? [...entries] : [])),
    readDocument: (absolute) => {
      reads.push(absolute);
      return Promise.resolve(ok(text));
    },
    isGitRepository: () => Promise.resolve(ok(false)),
  };
  return { fs, reads };
}

describe('isGitRepository — read without following links', () => {
  const stats =
    (kind: 'directory' | 'file' | 'symlink'): StatProbe =>
    (): ReturnType<StatProbe> =>
      Promise.resolve({
        isDirectory: () => kind === 'directory',
        isSymbolicLink: () => kind === 'symlink',
      });

  it('reports a .git directory and a worktree .git file as a repository', async () => {
    expect(await isGitRepository(ROOT, stats('directory'))).toEqual(ok(true));
    expect(await isGitRepository(ROOT, stats('file'))).toEqual(ok(true));
  });

  it('refuses a symlinked .git by name, never following it into another repository', async () => {
    expect(await isGitRepository(ROOT, stats('symlink'))).toEqual(
      err(`${path.join(ROOT, '.git')} is a symlink — the profile repository is never followed`),
    );
  });

  it('reads absence as not a repository and a refused probe as the failure it is', async () => {
    const absent: StatProbe = () =>
      Promise.reject(Object.assign(new Error('gone'), { code: 'ENOENT' }));
    expect(await isGitRepository(ROOT, absent)).toEqual(ok(false));
    const sealed: StatProbe = () =>
      Promise.reject(Object.assign(new Error('no'), { code: 'EACCES' }));
    expect(await isGitRepository(ROOT, sealed)).toEqual(
      err(`cannot read ${path.join(ROOT, '.git')} (EACCES)`),
    );
  });
});

describe('readProfileReport — entries that are not regular files', () => {
  it('reads a regular index.md and reports it as one conforming document, carrying the text it read', async () => {
    const { fs, reads } = fakeFileSystem(
      [{ relPath: 'index.md', kind: 'file' }],
      VALID_INDEX_DOCUMENT,
    );
    expect(unwrap(await readProfileReport(ROOT, fs))).toMatchObject({
      documentCount: 1,
      documents: [{ relPath: 'index.md', content: VALID_INDEX_DOCUMENT }],
      failures: [],
    });
    expect(reads).toEqual([path.join(ROOT, 'index.md')]);
  });

  it('refuses a profile root that is a symlink, never following it', async () => {
    const { fs, reads } = fakeFileSystem(
      [{ relPath: 'index.md', kind: 'file' }],
      VALID_INDEX_DOCUMENT,
    );
    const linkedRoot: ProfileFileSystem = { ...fs, presence: () => Promise.resolve(ok('symlink')) };
    const report = await readProfileReport(ROOT, linkedRoot);
    expect(report).toEqual({
      ok: false,
      error: `${ROOT} is a symlink — the profile root is never followed`,
    });
    expect(reads).toEqual([]);
  });

  it('refuses a symlinked index.md as not a regular file and never reads through it', async () => {
    // The fake would answer the read with a conforming document; a report
    // that names no document and asked for no read proves the link was
    // refused by kind, not read and validated.
    const { fs, reads } = fakeFileSystem(
      [{ relPath: 'index.md', kind: 'symlink' }],
      VALID_INDEX_DOCUMENT,
    );
    expect(unwrap(await readProfileReport(ROOT, fs))).toMatchObject({
      documentCount: 0,
      failures: [
        {
          relPath: 'index.md',
          messages: [
            'index.md is not a regular file or directory (a symlink or a special entry) — never read as part of the profile',
          ],
        },
      ],
    });
    expect(reads).toEqual([]);
  });

  it("reports a document the reader refuses as that document's failure, never a thrown error", async () => {
    const { fs } = fakeFileSystem([{ relPath: 'index.md', kind: 'file' }], VALID_INDEX_DOCUMENT);
    const refusing: ProfileFileSystem = {
      ...fs,
      readDocument: () =>
        Promise.resolve(
          err(
            'cannot read the document (ELOOP) — a symlink or an unreadable file is never a profile document',
          ),
        ),
    };
    expect(unwrap(await readProfileReport(ROOT, refusing))).toMatchObject({
      failures: [{ relPath: 'index.md', messages: [expect.stringContaining('(ELOOP)')] }],
    });
  });
});

describe('readDocument — reading without following a symlink', () => {
  const regular: EntryIdentity = { isFile: () => true, dev: 1n, ino: 42n };
  // Every read names its host, so no test takes the runner's own probes; the
  // arm without O_NOFOLLOW is driven by its own test below.
  const noFollowHost: ReadProbes = {
    noFollowAtOpen: true,
    entryStat: () => Promise.resolve(regular),
  };
  const handleOf = (
    text: string,
    closed: string[],
    identity: EntryIdentity = regular,
  ): DocumentHandle => ({
    stat: () => Promise.resolve(identity),
    readFile: () => Promise.resolve(text),
    close: () => {
      closed.push('closed');
      return Promise.resolve();
    },
  });

  it('refuses a descriptor that is not a regular file (a fifo, a directory) and closes it', async () => {
    const closed: string[] = [];
    const read = await readDocument(
      'index.md',
      () => Promise.resolve(handleOf('text', closed, { isFile: () => false, dev: 1n, ino: 42n })),
      noFollowHost,
    );
    expect(read).toEqual({
      ok: false,
      error:
        'the path is not a regular file — a directory, a fifo or a special file is never a profile document',
    });
    expect(closed).toEqual(['closed']);
  });

  it('names a refused close beside a descriptor refusal', async () => {
    const refusal = Object.assign(new Error('EIO: i/o error'), { code: 'EIO' });
    const read = await readDocument(
      'index.md',
      () =>
        Promise.resolve({
          stat: () => Promise.resolve({ isFile: () => false, dev: 1n, ino: 42n }),
          readFile: () => Promise.resolve('text'),
          close: () => Promise.reject(refusal),
        }),
      noFollowHost,
    );
    expect(read).toEqual({
      ok: false,
      error:
        'the path is not a regular file — a directory, a fifo or a special file is never a profile document; the close after it failed too (EIO)',
    });
  });

  it('on a host without O_NOFOLLOW, refuses a path entry that is not the opened file, and reads one that is', async () => {
    const closed: string[] = [];
    const swapped = await readDocument(
      'index.md',
      () => Promise.resolve(handleOf('text', closed)),
      {
        noFollowAtOpen: false,
        entryStat: () => Promise.resolve({ isFile: () => true, dev: 1n, ino: 7n }),
      },
    );
    expect(swapped).toEqual({
      ok: false,
      error:
        'the path entry is not the file that was opened — a symlink or a swapped entry is never read through',
    });
    const same = await readDocument('index.md', () => Promise.resolve(handleOf('text', closed)), {
      noFollowAtOpen: false,
      entryStat: () => Promise.resolve(regular),
    });
    expect(unwrap(same)).toBe('text');
    expect(closed).toEqual(['closed', 'closed']);
  });

  it('reads the text through the opened handle and closes it', async () => {
    const closed: string[] = [];
    const read = await readDocument(
      'index.md',
      () => Promise.resolve(handleOf('text', closed)),
      noFollowHost,
    );
    expect(unwrap(read)).toBe('text');
    expect(closed).toEqual(['closed']);
  });

  it('names a close the platform refuses after a read as a close failure, never a throw', async () => {
    const refusal = Object.assign(new Error('EIO: i/o error'), { code: 'EIO' });
    const read = await readDocument(
      'index.md',
      () =>
        Promise.resolve({
          stat: () => Promise.resolve(regular),
          readFile: () => Promise.resolve('text'),
          close: () => Promise.reject(refusal),
        }),
      noFollowHost,
    );
    expect(read).toEqual({
      ok: false,
      error:
        'cannot close the document after reading it (EIO) — the text read is discarded, never trusted',
    });
  });

  it('contains a close that throws synchronously after a failed read and names both causes', async () => {
    const readRefusal = Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' });
    const read = await readDocument(
      'index.md',
      () =>
        Promise.resolve({
          stat: () => Promise.resolve(regular),
          readFile: () => Promise.reject(readRefusal),
          close: () => {
            throw Object.assign(new Error('EBADF: bad file descriptor'), { code: 'EBADF' });
          },
        }),
      noFollowHost,
    );
    expect(read).toEqual({
      ok: false,
      error:
        'cannot read the document (EACCES) — a symlink or an unreadable file is never a profile document; the close after it failed too (EBADF)',
    });
  });

  it('closes the handle once when the read fails, and names a refused close beside the read failure', async () => {
    const readRefusal = Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' });
    const closeRefusal = Object.assign(new Error('EIO: i/o error'), { code: 'EIO' });
    const closed: string[] = [];
    const read = await readDocument(
      'index.md',
      () =>
        Promise.resolve({
          stat: () => Promise.resolve(regular),
          readFile: () => Promise.reject(readRefusal),
          close: () => {
            closed.push('closed');
            return Promise.reject(closeRefusal);
          },
        }),
      noFollowHost,
    );
    expect(read).toEqual({
      ok: false,
      error:
        'cannot read the document (EACCES) — a symlink or an unreadable file is never a profile document; the close after it failed too (EIO)',
    });
    expect(closed).toEqual(['closed']);
  });

  it('turns an open the platform refuses (ELOOP on a symlink) into a message, never a throw', async () => {
    const refusal = Object.assign(new Error('ELOOP: too many symbolic links'), { code: 'ELOOP' });
    const read = await readDocument('index.md', () => Promise.reject(refusal), noFollowHost);
    expect(read).toEqual({
      ok: false,
      error:
        'cannot read the document (ELOOP) — a symlink or an unreadable file is never a profile document',
    });
  });
});
