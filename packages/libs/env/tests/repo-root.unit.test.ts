import { describe, it, expect } from 'vitest';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRepoRoot } from '../src/repo-root.js';

describe('findRepoRoot', () => {
  it('returns a directory path (non-empty) for current repo', () => {
    const startDir = dirname(fileURLToPath(import.meta.url));
    const root = findRepoRoot(startDir);
    expect(typeof root).toBe('string');
    expect(root.length).toBeGreaterThan(1);
  });
});
