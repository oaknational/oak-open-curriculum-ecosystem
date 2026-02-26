import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { findRepoRoot } from '../src/repo-root.js';

describe('findRepoRoot', () => {
  it('returns a directory path (non-empty) for current repo', () => {
    const startDir = dirname(fileURLToPath(import.meta.url));
    const root = findRepoRoot(startDir);
    if (root === undefined) {
      throw new Error('Expected findRepoRoot to return a path when run inside the monorepo');
    }
    expect(root.length).toBeGreaterThan(1);
  });

  describe('when no repo markers exist', () => {
    let tempDir: string;

    afterEach(() => {
      rmSync(tempDir, { recursive: true, force: true });
    });

    it('returns undefined instead of throwing', () => {
      tempDir = mkdtempSync(join(tmpdir(), 'no-repo-root-'));
      const result = findRepoRoot(tempDir);
      expect(result).toBeUndefined();
    });
  });
});
