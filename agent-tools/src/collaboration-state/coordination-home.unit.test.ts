import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { COLLABORATION_HOME_SENTINEL, resolveCoordinationHome } from './coordination-home.js';

// The coordination home is the directory that CONTAINS
// `.agent/state/collaboration`. The fake `exists` reports the sentinel present
// only beneath `/repo`, exercising the walk-up without touching real IO.
const repoRoot = '/repo';
const sentinelPath = resolve(repoRoot, COLLABORATION_HOME_SENTINEL);
const existsAtRepoRoot = (path: string): boolean => path === sentinelPath;

describe('resolveCoordinationHome', () => {
  it('returns the directory that contains the collaboration sentinel', () => {
    expect(resolveCoordinationHome(repoRoot, { exists: existsAtRepoRoot })).toBe(repoRoot);
  });

  it('walks up from a nested cwd to the sentinel-bearing home', () => {
    expect(
      resolveCoordinationHome('/repo/agent-tools/src/collaboration-state', {
        exists: existsAtRepoRoot,
      }),
    ).toBe(repoRoot);
  });

  it('throws loudly when no ancestor contains the collaboration sentinel (F-41 stale/worktree cwd)', () => {
    // The regression guard for F-41: a stale or worktree cwd with no
    // `.agent/state/collaboration` ancestor must NOT silently resolve to the
    // cwd (which would create a fresh, wrong registry behind a green write
    // token) — it must refuse loudly.
    expect(() => resolveCoordinationHome('/tmp/worktree', { exists: () => false })).toThrow(
      /Unable to resolve the collaboration home/u,
    );
  });

  it('names the offending cwd and the sentinel in the refusal', () => {
    expect(() => resolveCoordinationHome('/tmp/worktree', { exists: () => false })).toThrow(
      /\/tmp\/worktree/u,
    );
    expect(() => resolveCoordinationHome('/tmp/worktree', { exists: () => false })).toThrow(
      new RegExp(COLLABORATION_HOME_SENTINEL.replaceAll('/', '\\/'), 'u'),
    );
  });
});
