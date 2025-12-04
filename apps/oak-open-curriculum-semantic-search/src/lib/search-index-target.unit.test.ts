import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const REQUIRED_ENV = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
};

type RequiredEnvKey = keyof typeof REQUIRED_ENV;
type TestEnvKey = RequiredEnvKey | 'AI_PROVIDER' | 'SEARCH_INDEX_TARGET';

let originalEnv: Map<TestEnvKey, string | undefined>;

beforeEach(() => {
  // Save original environment
  const keys: TestEnvKey[] = [
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    ...(Object.keys(REQUIRED_ENV) as RequiredEnvKey[]),
    'AI_PROVIDER',
    'SEARCH_INDEX_TARGET',
  ];
  originalEnv = new Map(keys.map((key) => [key, process.env[key]]));
});

afterEach(() => {
  vi.resetModules();
  // Restore original environment without mutation
  for (const [key, value] of originalEnv.entries()) {
    if (value === undefined) {
      // Using type assertion to work around readonly constraint in test
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Cleanup only
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function setEnv(overrides: Partial<Record<TestEnvKey, string>> = {}): void {
  // Set all required env vars
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  for (const [key, value] of Object.entries(REQUIRED_ENV)) {
    process.env[key] = value;
  }
  process.env.AI_PROVIDER = 'none';

  // Apply overrides (immutable approach - only set defined values)
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

describe('search index target helpers', () => {
  it('resolves primary and sandbox index names', async () => {
    setEnv();
    const { resolveSearchIndexName } = await import('./search-index-target');
    expect(resolveSearchIndexName('lessons', 'primary')).toBe('oak_lessons');
    expect(resolveSearchIndexName('lessons', 'sandbox')).toBe('oak_lessons_sandbox');
  });

  it('resolves current search index name from environment', async () => {
    setEnv({ SEARCH_INDEX_TARGET: 'sandbox' });
    const { resolveCurrentSearchIndexName } = await import('./search-index-target');
    expect(resolveCurrentSearchIndexName('sequences')).toBe('oak_sequences_sandbox');
  });

  it('coerces search index target values', async () => {
    setEnv();
    const { coerceSearchIndexTarget } = await import('./search-index-target');
    expect(coerceSearchIndexTarget('primary')).toBe('primary');
    expect(coerceSearchIndexTarget('sandbox')).toBe('sandbox');
    expect(coerceSearchIndexTarget('staging')).toBeNull();
    expect(coerceSearchIndexTarget(undefined)).toBeNull();
  });

  it('rewrites bulk operations for sandbox target while preserving others', async () => {
    setEnv();
    const { rewriteBulkOperations } = await import('./search-index-target');
    const operations: unknown[] = [
      { index: { _index: 'oak_lessons', _id: 'lesson-1' } },
      { foo: 'bar' },
      { index: { _index: 'oak_unit_rollup', _id: 'unit-1' } },
      { index: { _index: 'other_index', _id: '123' } },
    ];
    const rewritten = rewriteBulkOperations(operations, 'sandbox');
    expect(rewritten[0]).toEqual({ index: { _index: 'oak_lessons_sandbox', _id: 'lesson-1' } });
    expect(rewritten[1]).toBe(operations[1]);
    expect(rewritten[2]).toEqual({ index: { _index: 'oak_unit_rollup_sandbox', _id: 'unit-1' } });
    expect(rewritten[3]).toBe(operations[3]);
  });
});
