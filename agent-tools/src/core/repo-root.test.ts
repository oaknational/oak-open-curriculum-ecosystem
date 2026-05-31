import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { DEFAULT_REPO_ROOT_SENTINEL, resolveRepoRoot } from './repo-root.js';

// This test file lives at agent-tools/src/core/, so the repository root is three
// levels up. The fake `exists` reports the sentinel present only at that root,
// keeping the test off real IO while exercising the walk-up logic.
const expectedRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sentinelPath = resolve(expectedRoot, DEFAULT_REPO_ROOT_SENTINEL);
const existsAtRoot = (path: string): boolean => path === sentinelPath;

describe('resolveRepoRoot', () => {
  it('returns the injected projectDir when it contains the sentinel', () => {
    expect(
      resolveRepoRoot(import.meta.url, { projectDir: expectedRoot, exists: existsAtRoot }),
    ).toBe(expectedRoot);
  });

  it('walks up to the sentinel-bearing root when projectDir is absent', () => {
    expect(resolveRepoRoot(import.meta.url, { projectDir: undefined, exists: existsAtRoot })).toBe(
      expectedRoot,
    );
  });

  it('falls through to walk-up when projectDir lacks the sentinel', () => {
    expect(resolveRepoRoot(import.meta.url, { projectDir: '/nowhere', exists: existsAtRoot })).toBe(
      expectedRoot,
    );
  });

  it('throws when the sentinel is never found in any ancestor', () => {
    expect(() =>
      resolveRepoRoot(import.meta.url, { projectDir: undefined, exists: () => false }),
    ).toThrow(/Unable to resolve repository root/u);
  });
});
