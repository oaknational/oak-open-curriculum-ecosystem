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
  it('resolves a repo-relative claimed home against the provided repo root, not the process cwd', () => {
    const realpath = canonical({
      '/repo': '/repo',
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
      { realpath },
    );
    expect(existing.has('.agent/rules/stage-by-explicit-pathspec.md')).toBe(true);
  });

  it('excludes a claimed home that is absent from disk', () => {
    const realpath = canonical({ '/repo': '/repo' });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C02', claimedHomePaths: ['.agent/rules/ghost.md'] }],
        repoRoot: '/repo',
      },
      { realpath },
    );
    expect(existing.size).toBe(0);
  });

  it('excludes a claimed home that resolves outside the repo root', () => {
    const realpath = canonical({
      '/repo': '/repo',
      '/secrets/creds.md': '/secrets/creds.md',
    });
    const existing = existingClaimedHomePaths(
      {
        claims: [{ candidateId: 'C03', claimedHomePaths: ['../secrets/creds.md'] }],
        repoRoot: '/repo',
      },
      { realpath },
    );
    expect(existing.size).toBe(0);
  });

  it('returns the original claimed strings, deduplicated across claims, mixing existing and missing homes', () => {
    const realpath = canonical({
      '/repo': '/repo',
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
      { realpath },
    );
    expect([...existing]).toEqual(['.agent/memory/active/patterns/fluency-is-a-failure-vector.md']);
  });
});
