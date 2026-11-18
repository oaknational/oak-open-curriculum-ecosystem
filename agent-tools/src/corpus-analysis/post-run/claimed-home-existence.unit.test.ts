import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { existingClaimedHomePaths } from './claimed-home-existence.js';

// A pure `realpath` stand-in mirroring the safe-path test seam: maps each input to its
// canonical form and throws in the ENOENT style for anything unknown, exactly as
// `realpathSync` does for a path that does not exist. Keeps the suite off real IO.
// The product resolves claims into HOST absolute form (drive-prefixed on Windows),
// so both the POSIX-keyed table and each lookup normalise through `resolve`.
const canonical = (entries: Record<string, string>) => {
  const table = new Map(Object.entries(entries).map(([key, value]) => [resolve(key), value]));
  return (path: string): string => {
    const resolved = table.get(resolve(path));
    if (resolved === undefined) {
      throw new Error(`ENOENT: no such file or directory, realpath '${path}'`);
    }
    return resolved;
  };
};

describe('existingClaimedHomePaths', () => {
  it('excludes a claimed home outside the two corroboration roots (patterns and rules) even when it exists on disk', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.git/HEAD': '/repo/.git/HEAD',
      '/repo/.agent/memory/active/patterns/x.md': '/repo/.agent/memory/active/patterns/x.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [
          {
            candidateId: 'C01',
            claimedHomePaths: ['.git/HEAD', '.agent/memory/active/patterns/x.md'],
          },
        ],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual(['.agent/memory/active/patterns/x.md']);
  });

  it('excludes a claimed home that leaves its root through a parent segment after the root prefix', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.git/HEAD': '/repo/.git/HEAD',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C01', claimedHomePaths: ['.agent/rules/../../.git/HEAD'] }],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual([]);
  });

  it('excludes a claimed home under a root whose canonical path leaves that root through a symlink, containment being asserted against the matched root', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.agent/rules/linked.md': '/repo/.git/HEAD',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C01', claimedHomePaths: ['.agent/rules/linked.md'] }],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual([]);
  });

  it('excludes a claimed home under a corroboration root that is itself a symlink out of the repo root', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/outside/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.agent/rules/secret.md': '/outside/rules/secret.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C01', claimedHomePaths: ['.agent/rules/secret.md'] }],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual([]);
  });

  it('excludes a claimed home under a corroboration root that is a directory, not a regular file', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.agent/rules/nested': '/repo/.agent/rules/nested',
      '/repo/.agent/rules/a.md': '/repo/.agent/rules/a.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [
          { candidateId: 'C01', claimedHomePaths: ['.agent/rules/nested', '.agent/rules/a.md'] },
        ],
        repoRoot: '/repo',
      },
      // Stands in for `lstat().isFile()` over this fixture: only the `.md` entry is a file.
      { realpath, isRegularFile: (path) => path.endsWith('.md') },
    );
    expect([...existing]).toEqual(['.agent/rules/a.md']);
  });

  it('resolves a repo-relative claimed home against the provided repo root, not the process cwd', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.agent/rules/stage-by-explicit-pathspec.md':
        '/repo/.agent/rules/stage-by-explicit-pathspec.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [
          {
            candidateId: 'C01',
            claimedHomePaths: ['.agent/rules/stage-by-explicit-pathspec.md'],
          },
        ],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect(existing.has('.agent/rules/stage-by-explicit-pathspec.md')).toBe(true);
  });

  it('corroborates a claimed home given in absolute form, as the meta stage emits it, and still excludes an absolute one outside the corroboration roots', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.git/HEAD': '/repo/.git/HEAD',
      '/repo/.agent/rules/stage-by-explicit-pathspec.md':
        '/repo/.agent/rules/stage-by-explicit-pathspec.md',
    });
    const absoluteHome = resolve('/repo', '.agent/rules/stage-by-explicit-pathspec.md');
    const existing = existingClaimedHomePaths(
      {
        claims: [
          { candidateId: 'C01', claimedHomePaths: [absoluteHome, resolve('/repo', '.git/HEAD')] },
        ],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual([absoluteHome]);
  });

  it('excludes a claimed home that is absent from disk', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C02', claimedHomePaths: ['.agent/rules/ghost.md'] }],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect(existing.size).toBe(0);
  });

  it('excludes a claimed home that resolves outside the repo root', () => {
    const realpath = canonical({ '/repo': '/repo', '/secrets/creds.md': '/secrets/creds.md' });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C03', claimedHomePaths: ['../secrets/creds.md'] }],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect(existing.size).toBe(0);
  });

  it('returns the original claimed strings, deduplicated across claims, mixing existing and missing homes', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/repo/.agent/rules': '/repo/.agent/rules',
      '/repo/.agent/memory/active/patterns': '/repo/.agent/memory/active/patterns',
      '/repo/.agent/memory/active/patterns/fluency-is-a-failure-vector.md':
        '/repo/.agent/memory/active/patterns/fluency-is-a-failure-vector.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [
          {
            candidateId: 'C04',
            claimedHomePaths: [
              '.agent/memory/active/patterns/fluency-is-a-failure-vector.md',
              '.agent/rules/ghost.md',
            ],
          },
          {
            candidateId: 'C05',
            claimedHomePaths: ['.agent/memory/active/patterns/fluency-is-a-failure-vector.md'],
          },
        ],
        repoRoot: '/repo',
      },
      { realpath, isRegularFile: () => true },
    );
    expect([...existing]).toEqual(['.agent/memory/active/patterns/fluency-is-a-failure-vector.md']);
  });
});
