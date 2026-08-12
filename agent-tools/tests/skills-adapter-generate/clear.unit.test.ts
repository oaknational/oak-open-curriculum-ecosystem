import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  clearGeneratedAdapters,
  isMissingSurface,
  readLockedSkillIds,
  type ClearFs,
} from '../../src/skills-adapter-generate/clear';

// The product joins with the HOST separator (correct for real fs access);
// this fake is keyed and asserted in POSIX form for readability, so both the
// lookups and the recorded removals normalise first.
const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');

function makeClearFs(subdirectories: ReadonlyMap<string, readonly string[]>): {
  readonly fs: ClearFs;
  readonly removed: string[];
} {
  const removed: string[] = [];
  return {
    fs: {
      async listSubdirectoryNames(path) {
        return { kind: 'ok', names: subdirectories.get(posixPath(path)) ?? [] };
      },
      async removeDirectory(path) {
        removed.push(posixPath(path));
      },
    },
    removed,
  };
}

describe('clearGeneratedAdapters', () => {
  const repoRoot = '/repo';
  const surfaces = new Map<string, readonly string[]>([
    ['/repo/.claude/skills', ['oak-commit', 'skill-creator']],
    ['/repo/.agents/skills', ['oak-commit', 'clerk', 'skill-creator']],
  ]);

  it('removes generated adapter directories while preserving every lock-pinned id', async () => {
    const { fs, removed } = makeClearFs(surfaces);
    const lockedIds = new Set(['clerk', 'skill-creator']);

    const result = await clearGeneratedAdapters(repoRoot, lockedIds, fs);

    expect(result).toEqual({ kind: 'ok' });
    expect(new Set(removed)).toEqual(
      new Set(['/repo/.claude/skills/oak-commit', '/repo/.agents/skills/oak-commit']),
    );
  });

  it('removes every subdirectory when the lock pins nothing', async () => {
    const { fs, removed } = makeClearFs(surfaces);

    const result = await clearGeneratedAdapters(repoRoot, new Set<string>(), fs);

    expect(result).toEqual({ kind: 'ok' });
    expect(new Set(removed)).toEqual(
      new Set([
        '/repo/.claude/skills/oak-commit',
        '/repo/.claude/skills/skill-creator',
        '/repo/.agents/skills/oak-commit',
        '/repo/.agents/skills/clerk',
        '/repo/.agents/skills/skill-creator',
      ]),
    );
  });

  it('aborts with an error and removes nothing when a surface cannot be listed', async () => {
    const removed: string[] = [];
    const fs: ClearFs = {
      async listSubdirectoryNames() {
        return { kind: 'error', message: 'cannot list /repo/.claude/skills: EACCES' };
      },
      async removeDirectory(path) {
        removed.push(path);
      },
    };

    const result = await clearGeneratedAdapters(repoRoot, new Set<string>(), fs);

    expect(result.kind).toBe('error');
    expect(removed).toEqual([]);
  });
});

describe('isMissingSurface', () => {
  it('classifies an absent surface (ENOENT) as missing — read as empty, not an error', () => {
    expect(isMissingSurface({ code: 'ENOENT', message: 'no such file' })).toBe(true);
  });

  it('classifies every other failure as an error, never an empty surface', () => {
    expect(isMissingSurface({ code: 'EACCES', message: 'permission denied' })).toBe(false);
    expect(isMissingSurface({ code: 'ENOTDIR', message: 'not a directory' })).toBe(false);
    expect(isMissingSurface(new Error('plain error, no code'))).toBe(false);
    expect(isMissingSurface(undefined)).toBe(false);
  });
});

describe('readLockedSkillIds', () => {
  const lockPath = '/repo/skills-lock.json';
  const validLock = JSON.stringify({
    version: 1,
    skills: {
      clerk: { source: 'clerk/skills', sourceType: 'github', computedHash: 'abc' },
      'skill-creator': { source: 'anthropics/skills', sourceType: 'github', computedHash: 'def' },
    },
  });

  it('returns the locked id set for a valid lock file', async () => {
    const result = await readLockedSkillIds(lockPath, async () => validLock);

    expect(result).toEqual({ kind: 'ok', value: new Set(['clerk', 'skill-creator']) });
  });

  it('returns an error when the lock file cannot be read — never an empty set', async () => {
    const result = await readLockedSkillIds(lockPath, () =>
      Promise.reject(new Error('ENOENT: no such file')),
    );

    expect(result.kind).toBe('error');
    expect(result.kind === 'error' && result.message).toContain(lockPath);
  });

  it('returns an error when the lock file is not valid JSON', async () => {
    const result = await readLockedSkillIds(lockPath, async () => '{ not json');

    expect(result.kind).toBe('error');
    expect(result.kind === 'error' && result.message).toContain('invalid skills-lock.json');
  });

  it('returns an error when the lock file fails schema validation', async () => {
    const invalidLock = JSON.stringify({ version: 1, skills: { clerk: { source: 'x' } } });

    const result = await readLockedSkillIds(lockPath, async () => invalidLock);

    expect(result.kind).toBe('error');
    expect(result.kind === 'error' && result.message).toContain('invalid skills-lock.json');
  });
});
