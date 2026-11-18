import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { appendOwnerOnly } from './owner-only-append.js';
import type { OwnerOnlyAppendFs } from './owner-only-append-fs.js';
import { FAKE_OWNER_UID, type FakeEntry } from './test-helpers/in-memory-fs-state.js';
import { inMemoryFileSystem } from './test-helpers/in-memory-owner-only-append-fs.js';

/**
 * The owner-only append, proven against an in-memory file system whose
 * resulting state each test reads: the directory's mode, the file's bytes
 * and mode, and the descriptors left open. No IO, and no assertion on the
 * calls the fake received (ADR-078). The fake honours the open flags, so the
 * flag set is proven by what it does; a call the fake cannot fail on its own
 * is overridden with a constant failing fake.
 */

const STRANGER_UID = 0;

const DIRECTORY = '/srv/estate/logs';
const FILE = `${DIRECTORY}/observations.jsonl`;
const ELSEWHERE = '/srv/elsewhere';

function file(mode: number, text: string, uid: number = FAKE_OWNER_UID): FakeEntry {
  return { kind: 'file', mode, uid, bytes: Buffer.from(text, 'utf8') };
}

function directory(mode: number, uid: number = FAKE_OWNER_UID): FakeEntry {
  return { kind: 'directory', mode, uid };
}

function fifo(hasReader: boolean): FakeEntry {
  return { kind: 'fifo', mode: 0o644, uid: FAKE_OWNER_UID, hasReader, bytes: Buffer.alloc(0) };
}

describe('appendOwnerOnly: directories and appending', () => {
  it('creates an absent directory at 0o700 and the file at 0o600 holding exactly the text', () => {
    const world = inMemoryFileSystem();
    const result = appendOwnerOnly(FILE, '{"a":1}\n', world.fs);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get(DIRECTORY)).toEqual(directory(0o700));
    expect(world.entries.get(FILE)).toEqual(file(0o600, '{"a":1}\n'));
  });

  it('leaves an existing directory at the mode it had, and tightens a file left at 0o644, keeping the earlier bytes', () => {
    const world = inMemoryFileSystem({
      [DIRECTORY]: directory(0o755),
      [FILE]: file(0o644, 'earlier\n'),
    });
    const result = appendOwnerOnly(FILE, 'next\n', world.fs);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get(DIRECTORY)).toEqual(directory(0o755));
    expect(world.entries.get(FILE)).toEqual(file(0o600, 'earlier\nnext\n'));
  });

  it('adds a second append after the first; nothing is truncated or overwritten', () => {
    const world = inMemoryFileSystem();
    appendOwnerOnly(FILE, 'one\n', world.fs);
    appendOwnerOnly(FILE, 'two\n', world.fs);
    expect(world.entries.get(FILE)).toEqual(file(0o600, 'one\ntwo\n'));
  });

  it('appends into a shared sticky directory another user owns, leaving it as it was', () => {
    // The shape of /tmp on Linux: a user-named log there must keep working.
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o1777, STRANGER_UID) });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get(DIRECTORY)).toEqual(directory(0o1777, STRANGER_UID));
    expect(world.entries.get(FILE)).toEqual(file(0o600, 'line\n'));
  });

  it('appends through a symlinked directory, leaving the directory it names as it was', () => {
    // The shape of /tmp on macOS; only the file name itself must not be a link.
    const world = inMemoryFileSystem({
      [DIRECTORY]: { kind: 'symlink', target: ELSEWHERE },
      [ELSEWHERE]: directory(0o755),
    });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get(ELSEWHERE)).toEqual(directory(0o755));
    expect(world.entries.get(`${ELSEWHERE}/observations.jsonl`)).toEqual(file(0o600, 'line\n'));
  });

  it('creates a missing directory under the target of a symlinked ancestor, and appends there', () => {
    const world = inMemoryFileSystem({
      '/srv/estate': { kind: 'symlink', target: '/data' },
      '/data': directory(0o755),
    });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get('/data/logs')).toEqual(directory(0o700));
    expect(world.entries.get('/data/logs/observations.jsonl')).toEqual(file(0o600, 'line\n'));
    expect(world.entries.has(DIRECTORY)).toBe(false);
  });

  it('writes the whole text through short writes', () => {
    const world = inMemoryFileSystem();
    const threeBytesAtATime: OwnerOnlyAppendFs = {
      ...world.fs,
      write: (fd, data, offset, length) => world.fs.write(fd, data, offset, Math.min(3, length)),
    };
    const result = appendOwnerOnly(FILE, '{"a":1}\n', threeBytesAtATime);
    expect(result).toEqual(ok(undefined));
    expect(world.entries.get(FILE)).toEqual(file(0o600, '{"a":1}\n'));
  });
});

describe('appendOwnerOnly: mkdir failures', () => {
  it('returns the mkdir step and EEXIST when a file stands where the directory should be, leaving the file as it was', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: file(0o644, 'not a directory\n') });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'mkdir', code: 'EEXIST' }));
    expect(world.entries.get(DIRECTORY)).toEqual(file(0o644, 'not a directory\n'));
    expect(world.entries.has(FILE)).toBe(false);
  });

  it('returns the mkdir step and ENOTDIR when a file stands where an ancestor directory should be, creating nothing', () => {
    const world = inMemoryFileSystem({ '/srv': file(0o644, 'not a directory\n') });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'mkdir', code: 'ENOTDIR' }));
    expect([...world.entries.keys()]).toEqual(['/srv']);
    expect(world.entries.get('/srv')).toEqual(file(0o644, 'not a directory\n'));
  });

  it('returns the mkdir step and ENOENT when the directory is a dangling symlink, creating nothing', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: { kind: 'symlink', target: ELSEWHERE } });
    const before = [...world.entries.keys()];
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'mkdir', code: 'ENOENT' }));
    expect([...world.entries.keys()]).toEqual(before);
  });
});

describe('appendOwnerOnly: open and descriptor refusals', () => {
  it('refuses a symlink at the file name at the open step with ELOOP; its target is untouched', () => {
    const target = `${ELSEWHERE}/target.log`;
    const world = inMemoryFileSystem({
      [DIRECTORY]: directory(0o700),
      [FILE]: { kind: 'symlink', target },
      [target]: file(0o644, 'theirs\n'),
    });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'open', code: 'ELOOP' }));
    expect(world.entries.get(target)).toEqual(file(0o644, 'theirs\n'));
  });

  it('refuses a FIFO with no reader at the open step with ENXIO, rather than waiting on it', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: fifo(false) });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'open', code: 'ENXIO' }));
    expect(world.entries.get(FILE)).toEqual(fifo(false));
  });

  it('refuses a file that is not a regular file at the fstat step; nothing reaches it, and its descriptor is closed', () => {
    // A FIFO with a live reader opens even without blocking; the descriptor
    // check is what refuses it.
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: fifo(true) });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'fstat', code: 'NOT_REGULAR_FILE' }));
    expect(world.entries.get(FILE)).toEqual(fifo(true));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('refuses a file another user owns at the fstat step; nothing is written and its mode is left as it was', () => {
    const theirs: FakeEntry = file(0o644, 'theirs\n', STRANGER_UID);
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: theirs });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'fstat', code: 'NOT_OWNER' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'theirs\n', STRANGER_UID));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('refuses a file with a second hard link at the fstat step; nothing is written through either name', () => {
    const elsewhereName = `${ELSEWHERE}/theirs.log`;
    const linked = file(0o644, 'theirs\n');
    const world = inMemoryFileSystem({
      [DIRECTORY]: directory(0o700),
      [FILE]: linked,
      [elsewhereName]: linked,
    });
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'fstat', code: 'HARD_LINKED' }));
    expect(world.entries.get(elsewhereName)).toEqual(file(0o644, 'theirs\n'));
    expect(world.openDescriptors.size).toBe(0);
  });
});

describe('appendOwnerOnly: a platform without POSIX ownership', () => {
  // Node gives a process no uid on Windows and Android: the owner check cannot
  // run, and on Windows the modes this append sets cannot make a file
  // owner-only.
  it('returns the uid step and NO_POSIX_OWNERSHIP, creating no directory or file', () => {
    const world = inMemoryFileSystem();
    const before = [...world.entries.keys()];
    const result = appendOwnerOnly(FILE, 'line\n', { ...world.fs, uid: undefined });
    expect(result).toEqual(err({ step: 'uid', code: 'NO_POSIX_OWNERSHIP' }));
    expect([...world.entries.keys()]).toEqual(before);
  });

  it("leaves an existing file's bytes and mode as they were, with no descriptor left open", () => {
    const world = inMemoryFileSystem({
      [DIRECTORY]: directory(0o700),
      [FILE]: file(0o644, 'earlier\n'),
    });
    const result = appendOwnerOnly(FILE, 'next\n', { ...world.fs, uid: undefined });
    expect(result).toEqual(err({ step: 'uid', code: 'NO_POSIX_OWNERSHIP' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'earlier\n'));
    expect(world.openDescriptors.size).toBe(0);
  });
});

describe('appendOwnerOnly: the name still holds the opened file', () => {
  it('on a platform without no-follow, refuses a symlink at the file name at the lstat step; its target is untouched', () => {
    // Where the open has no no-follow flag, it follows the link, and only the
    // identity check between the name and the descriptor catches it.
    const target = `${ELSEWHERE}/target.log`;
    const world = inMemoryFileSystem(
      {
        [DIRECTORY]: directory(0o700),
        [FILE]: { kind: 'symlink', target },
        [target]: file(0o644, 'theirs\n'),
      },
      { hasNoFollow: false },
    );
    const result = appendOwnerOnly(FILE, 'line\n', world.fs);
    expect(result).toEqual(err({ step: 'lstat', code: 'NOT_SAME_FILE' }));
    expect(world.entries.get(target)).toEqual(file(0o644, 'theirs\n'));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('refuses at the lstat step when the name holds a different inode from the opened file', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: file(0o644, 'x\n') });
    const swapped: OwnerOnlyAppendFs = {
      ...world.fs,
      lstat: (path) => {
        const named = world.fs.lstat(path);
        return named.ok ? ok({ ...named.value, ino: named.value.ino + 1n }) : named;
      },
    };
    const result = appendOwnerOnly(FILE, 'line\n', swapped);
    expect(result).toEqual(err({ step: 'lstat', code: 'NOT_SAME_FILE' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'x\n'));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('refuses at the lstat step when the name is on a different device from the opened file', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: file(0o644, 'x\n') });
    const elsewhere: OwnerOnlyAppendFs = {
      ...world.fs,
      lstat: (path) => {
        const named = world.fs.lstat(path);
        return named.ok ? ok({ ...named.value, dev: named.value.dev + 1n }) : named;
      },
    };
    const result = appendOwnerOnly(FILE, 'line\n', elsewhere);
    expect(result).toEqual(err({ step: 'lstat', code: 'NOT_SAME_FILE' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'x\n'));
  });

  it('refuses at the lstat step when the name is not a regular file, even with the same identity', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: file(0o644, 'x\n') });
    const notRegular: OwnerOnlyAppendFs = {
      ...world.fs,
      lstat: (path) => {
        const named = world.fs.lstat(path);
        return named.ok ? ok({ ...named.value, isFile: false }) : named;
      },
    };
    const result = appendOwnerOnly(FILE, 'line\n', notRegular);
    expect(result).toEqual(err({ step: 'lstat', code: 'NOT_SAME_FILE' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'x\n'));
  });

  it('returns the lstat step and its code when the name cannot be read back, before any fchmod or write', () => {
    const world = inMemoryFileSystem({ [DIRECTORY]: directory(0o700), [FILE]: file(0o644, 'x\n') });
    const vanished: OwnerOnlyAppendFs = { ...world.fs, lstat: () => err({ code: 'ENOENT' }) };
    const result = appendOwnerOnly(FILE, 'line\n', vanished);
    expect(result).toEqual(err({ step: 'lstat', code: 'ENOENT' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'x\n'));
    expect(world.openDescriptors.size).toBe(0);
  });
});

describe('appendOwnerOnly: failures after the checks', () => {
  it('returns the fchmod step and its code when the file cannot be retightened; its bytes are unchanged and its descriptor closed', () => {
    const world = inMemoryFileSystem({
      [DIRECTORY]: directory(0o700),
      [FILE]: file(0o644, 'earlier\n'),
    });
    const cannotRetighten: OwnerOnlyAppendFs = {
      ...world.fs,
      fchmod: () => err({ code: 'EPERM' }),
    };
    const result = appendOwnerOnly(FILE, 'line\n', cannotRetighten);
    expect(result).toEqual(err({ step: 'fchmod', code: 'EPERM' }));
    expect(world.entries.get(FILE)).toEqual(file(0o644, 'earlier\n'));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('returns the write step and its code when the write fails, and closes the descriptor', () => {
    const world = inMemoryFileSystem();
    const diskFull: OwnerOnlyAppendFs = { ...world.fs, write: () => err({ code: 'ENOSPC' }) };
    const result = appendOwnerOnly(FILE, 'line\n', diskFull);
    expect(result).toEqual(err({ step: 'write', code: 'ENOSPC' }));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('returns the write step when a write makes no progress, rather than reporting an append that did not happen', () => {
    const world = inMemoryFileSystem();
    const stalled: OwnerOnlyAppendFs = { ...world.fs, write: () => ok(0) };
    const result = appendOwnerOnly(FILE, 'line\n', stalled);
    expect(result).toEqual(err({ step: 'write', code: 'NO_PROGRESS' }));
    expect(world.openDescriptors.size).toBe(0);
  });

  it('returns the close step and its code when the close fails after a complete write', () => {
    const world = inMemoryFileSystem();
    const closeFails: OwnerOnlyAppendFs = { ...world.fs, close: () => err({ code: 'EIO' }) };
    const result = appendOwnerOnly(FILE, 'line\n', closeFails);
    expect(result).toEqual(err({ step: 'close', code: 'EIO' }));
  });

  it('returns the write failure, not the close failure, when both fail', () => {
    const world = inMemoryFileSystem();
    const bothFail: OwnerOnlyAppendFs = {
      ...world.fs,
      write: () => err({ code: 'ENOSPC' }),
      close: () => err({ code: 'EIO' }),
    };
    const result = appendOwnerOnly(FILE, 'line\n', bothFail);
    expect(result).toEqual(err({ step: 'write', code: 'ENOSPC' }));
  });
});
