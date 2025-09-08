import { describe, it, expect } from 'vitest';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRootEnv } from '../src/repo-root.js';

describe('loadRootEnv', () => {
  it('does not throw and returns structure', () => {
    const startDir = dirname(fileURLToPath(import.meta.url));
    const result = loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir, env: {} });
    expect(typeof result.repoRoot).toBe('string');
    expect(typeof result.loaded).toBe('boolean');
  });
});
