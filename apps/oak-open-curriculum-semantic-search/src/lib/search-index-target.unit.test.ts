import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BulkOperations, BulkIndexAction } from './indexing/bulk-operation-types';
import type { SearchLessonsIndexDoc } from '../types/oak';

const REQUIRED_ENV = {
  ELASTICSEARCH_URL: 'https://example.com',
  ELASTICSEARCH_API_KEY: 'elastic-key-12345',
  OAK_API_KEY: 'oak-key-12345',
  SEARCH_API_KEY: 'search-key-12345',
  SEARCH_INDEX_VERSION: 'v2025-03-18',
};

type RequiredEnvKey = keyof typeof REQUIRED_ENV;
type TestEnvKey = RequiredEnvKey | 'SEARCH_INDEX_TARGET';

let originalEnv: Map<TestEnvKey, string | undefined>;

beforeEach(() => {
  // Save original environment
  const keys: TestEnvKey[] = [
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    ...(Object.keys(REQUIRED_ENV) as RequiredEnvKey[]),
    'SEARCH_INDEX_TARGET',
  ];
  originalEnv = new Map(keys.map((key) => [key, process.env[key]]));
});

afterEach(() => {
  // Restore original environment BEFORE resetting modules
  for (const [key, value] of originalEnv.entries()) {
    if (value === undefined) {
      // Using type assertion to work around readonly constraint in test
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- Cleanup only
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  vi.resetModules();
});

function setEnv(overrides: Partial<Record<TestEnvKey, string>> = {}): void {
  // Set all required env vars
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  for (const [key, value] of Object.entries(REQUIRED_ENV)) {
    process.env[key] = value;
  }

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

    // Minimal valid document fixture for testing document body passthrough
    const lessonDoc: SearchLessonsIndexDoc = {
      lesson_id: 'lesson-1',
      lesson_slug: 'lesson-one',
      lesson_title: 'Test Lesson',
      subject_slug: 'maths',
      subject_parent: 'maths',
      key_stage: 'ks3',
      unit_ids: ['unit-1'],
      unit_titles: ['Test Unit'],
      has_transcript: true,
      lesson_content: 'Test content',
      lesson_url: 'https://example.com/lesson-one',
      unit_urls: ['https://example.com/unit-1'],
      doc_type: 'lesson',
    };

    const oakLessonAction: BulkIndexAction = { index: { _index: 'oak_lessons', _id: 'lesson-1' } };
    const oakRollupAction: BulkIndexAction = {
      index: { _index: 'oak_unit_rollup', _id: 'unit-1' },
    };
    const nonOakAction: BulkIndexAction = { index: { _index: 'other_index', _id: '123' } };

    const operations: BulkOperations = [oakLessonAction, lessonDoc, oakRollupAction, nonOakAction];

    const rewritten = rewriteBulkOperations(operations, 'sandbox');

    // Oak index actions should be rewritten to sandbox
    expect(rewritten[0]).toEqual({ index: { _index: 'oak_lessons_sandbox', _id: 'lesson-1' } });
    // Document bodies should be passed through unchanged (same reference)
    expect(rewritten[1]).toBe(lessonDoc);
    // Oak rollup action should be rewritten
    expect(rewritten[2]).toEqual({ index: { _index: 'oak_unit_rollup_sandbox', _id: 'unit-1' } });
    // Non-Oak index actions should be passed through unchanged (same reference)
    expect(rewritten[3]).toBe(nonOakAction);
  });
});
