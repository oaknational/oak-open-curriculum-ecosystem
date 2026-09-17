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
    symlinkRepoPath(root, 'skills/oak-x/SKILL.md', join(root, 'target/real-stub.md'));

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

  it('surfaces a non-ENOENT failure instead of swallowing it as absence (a file in the path → ENOTDIR)', async () => {
    const root = sandboxRepo();
    writeRepoFile(root, 'skills/oak-x', 'a regular file where a directory was expected\n');

    const read = await readRegularFileTextNoFollow(join(root, 'skills/oak-x/SKILL.md'));

    expect(read.kind).toBe('failure');
  });
});
