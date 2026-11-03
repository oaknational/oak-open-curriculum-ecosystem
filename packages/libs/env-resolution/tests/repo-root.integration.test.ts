import { join, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findRepoRoot } from '../src/repo-root.js';
import { createInMemoryFileSystem } from './test-helpers/in-memory-file-system.js';

const REPO_ROOT = join(sep, 'work', 'repo');
const PACKAGE_DIR = join(REPO_ROOT, 'packages', 'libs', 'env-resolution');
const START_DIR = join(PACKAGE_DIR, 'tests');

describe('findRepoRoot', () => {
  it('finds the directory holding pnpm-workspace.yaml above a nested start', () => {
    const fileSystem = createInMemoryFileSystem({
      [join(REPO_ROOT, 'pnpm-workspace.yaml')]: 'packages: []',
    });

    expect(findRepoRoot(START_DIR, fileSystem.exists)).toBe(REPO_ROOT);
  });

  it('falls back to the directory holding .git when no workspace manifest exists', () => {
    const fileSystem = createInMemoryFileSystem({ [join(REPO_ROOT, '.git')]: '' });

    expect(findRepoRoot(START_DIR, fileSystem.exists)).toBe(REPO_ROOT);
  });

  it('prefers the workspace manifest over a .git nearer the start', () => {
    // A nested checkout with its own .git must not shadow the monorepo root.
    const fileSystem = createInMemoryFileSystem({
      [join(REPO_ROOT, 'pnpm-workspace.yaml')]: 'packages: []',
      [join(PACKAGE_DIR, '.git')]: '',
    });

    expect(findRepoRoot(START_DIR, fileSystem.exists)).toBe(REPO_ROOT);
  });

  it('returns undefined instead of throwing when no repo markers exist', () => {
    const fileSystem = createInMemoryFileSystem({});

    expect(findRepoRoot(START_DIR, fileSystem.exists)).toBeUndefined();
  });
});
