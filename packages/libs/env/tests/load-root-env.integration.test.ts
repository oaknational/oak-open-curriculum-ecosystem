import { describe, it, expect } from 'vitest';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRootEnv } from '../src/repo-root.js';

const startDir = dirname(fileURLToPath(import.meta.url));

describe('loadRootEnv', () => {
  it('does not throw and returns structure', () => {
    const result = loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir, env: {} });
    expect(typeof result.repoRoot).toBe('string');
    expect(typeof result.loaded).toBe('boolean');
  });

  describe('keyStatus', () => {
    it('reports each required key as present or missing', () => {
      const result = loadRootEnv({
        requiredKeys: ['PRESENT_KEY', 'MISSING_KEY'],
        startDir,
        env: { PRESENT_KEY: 'value' },
      });

      expect(result.keyStatus).toEqual([
        { key: 'PRESENT_KEY', present: true },
        { key: 'MISSING_KEY', present: false },
      ]);
    });

    it('treats empty string values as missing', () => {
      const result = loadRootEnv({
        requiredKeys: ['EMPTY_KEY'],
        startDir,
        env: { EMPTY_KEY: '' },
      });

      expect(result.keyStatus).toEqual([{ key: 'EMPTY_KEY', present: false }]);
    });

    it('returns missingKeys as a filtered list', () => {
      const result = loadRootEnv({
        requiredKeys: ['A', 'B', 'C'],
        startDir,
        env: { B: 'yes' },
      });

      expect(result.missingKeys).toEqual(['A', 'C']);
    });

    it('returns empty missingKeys when all are present', () => {
      const result = loadRootEnv({
        requiredKeys: ['X', 'Y'],
        startDir,
        env: { X: 'a', Y: 'b' },
      });

      expect(result.missingKeys).toEqual([]);
    });

    it('returns empty arrays when no requiredKeys specified', () => {
      const result = loadRootEnv({ startDir, env: {} });

      expect(result.keyStatus).toEqual([]);
      expect(result.missingKeys).toEqual([]);
    });
  });
});
