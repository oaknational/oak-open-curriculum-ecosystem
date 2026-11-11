import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { readRegularFileTextNoFollow } from '../../src/skills-adapter-generate/read-regular-file';

import {
  cleanupSandboxes,
  makeRepoDir,
  sandboxRepo,
  symlinkRepoPath,
  writeRepoFile,
} from './test-helpers/skills-repo-sandbox';

afterEach(() => {
  cleanupSandboxes();
});

describe('readRegularFileTextNoFollow (fd-anchored, no check→use race)', () => {
  it('reads a regular file as UTF-8 text', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, 'skills/oak-x/SKILL.md', 'stub body\n');

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    expect(read).toStrictEqual({ kind: 'ok', value: 'stub body\n' });
  });

  it('returns undefined for a symlinked leaf without reading through it — a link is never our stub', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, 'target/real-stub.md', 'a genuine stub a link could otherwise borrow\n');
    symlinkRepoPath(root, 'skills/oak-x/SKILL.md', join(root, 'target/real-stub.md'), 'file');

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    expect(read).toStrictEqual({ kind: 'ok', value: undefined });
  });

  it('returns undefined for an absent path — ENOENT is the one absence', async () => {
    const root = sandboxRepo();

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    expect(read).toStrictEqual({ kind: 'ok', value: undefined });
  });

  it('returns undefined for a directory at the name — fstat rejects a non-regular file', async () => {
    const root = sandboxRepo();
    makeRepoDir(root, 'skills/oak-x/SKILL.md');

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    expect(read).toStrictEqual({ kind: 'ok', value: undefined });
  });

  it('classifies a regular file squatting a path component as absence — nothing can exist below a file', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, 'skills/oak-x', 'a regular file where a directory was expected\n');

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    // POSIX reports this state as ENOTDIR, Windows as ENOENT; both name the
    // same truth — no entry can exist below a regular file — so the reader
    // classifies both as absence rather than leaking the host's errno
    // vocabulary to its callers.
    expect(read).toStrictEqual({ kind: 'ok', value: undefined });
  });
});
