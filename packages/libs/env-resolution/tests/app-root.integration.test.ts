import { join, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findAppRoot } from '../src/repo-root.js';
import { createInMemoryFileSystem } from './test-helpers/in-memory-file-system.js';

const REPO_ROOT = join(sep, 'work', 'repo');
const APP_ROOT = join(REPO_ROOT, 'apps', 'my-app');

describe('findAppRoot', () => {
  it('finds the nearest directory containing package.json', () => {
    const fileSystem = createInMemoryFileSystem({ [join(APP_ROOT, 'package.json')]: '{}' });

    expect(findAppRoot(join(APP_ROOT, 'src', 'deep'), fileSystem.exists)).toBe(APP_ROOT);
  });

  it('returns undefined when no package.json is found', () => {
    // The walk terminates at the filesystem root and reports undefined.
    const fileSystem = createInMemoryFileSystem({});

    expect(findAppRoot(join(REPO_ROOT, 'no-pkg-anywhere'), fileSystem.exists)).toBeUndefined();
  });

  it('finds the closest package.json, not a parent one', () => {
    const fileSystem = createInMemoryFileSystem({
      [join(REPO_ROOT, 'package.json')]: '{"name":"root"}',
      [join(APP_ROOT, 'package.json')]: '{"name":"my-app"}',
    });

    expect(findAppRoot(join(APP_ROOT, 'src'), fileSystem.exists)).toBe(APP_ROOT);
  });
});
