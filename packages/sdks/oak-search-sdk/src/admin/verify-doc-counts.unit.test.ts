/**
 * Unit tests for verifyDocCounts — all-failure reporting.
 *
 * TDD RED phase: these tests define the contract for verifyDocCounts.
 * The function must iterate ALL index kinds and accumulate ALL failures
 * into a single report, rather than early-exiting on the first failure.
 */

import { describe, it, expect, vi } from 'vitest';
import { Client } from '@elastic/elasticsearch';

import type { SearchIndexKind } from '../internal/index-resolver.js';
import { SEARCH_INDEX_KINDS } from '../internal/index-resolver.js';

import { verifyDocCounts } from './verify-doc-counts.js';
import type {
  DocCountExpectations,
  DocCountVerification,
  IndexDocCountStatus,
} from './verify-doc-counts.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** A single index name and doc count pair for building mock responses. */
interface MockIndexEntry {
  readonly index: string;
  readonly count: number;
}

/**
 * Create a mock ES client whose cat.indices returns the provided
 * per-index doc counts. No real network calls are made.
 */
function createMockClient(entries: readonly MockIndexEntry[]): Client {
  const client = new Client({ node: 'http://localhost:19200' });
  vi.spyOn(client.cat, 'indices').mockResolvedValue(
    entries.map((entry) => ({
      index: entry.index,
      health: 'green',
      status: 'open',
      'docs.count': String(entry.count),
    })),
  );
  return client;
}

/** Create a simple index resolver that maps kind to `oak_<kind>`. */
function testResolver(kind: SearchIndexKind): string {
  return `oak_${kind}`;
}

/** All 6 index kinds with specified doc counts. */
const ALL_INDEXES_MIXED: readonly MockIndexEntry[] = [
  { index: 'oak_lessons', count: 100 },
  { index: 'oak_unit_rollup', count: 5 },
  { index: 'oak_units', count: 200 },
  { index: 'oak_sequences', count: 3 },
  { index: 'oak_sequence_facets', count: 50 },
  { index: 'oak_threads', count: 2 },
];

/** All 6 index kinds with counts above 50. */
const ALL_INDEXES_PASSING: readonly MockIndexEntry[] = [
  { index: 'oak_lessons', count: 100 },
  { index: 'oak_unit_rollup', count: 100 },
  { index: 'oak_units', count: 200 },
  { index: 'oak_sequences', count: 150 },
  { index: 'oak_sequence_facets', count: 50 },
  { index: 'oak_threads', count: 80 },
];

/** Standard expectations: 50 docs minimum for each index kind. */
const EXPECT_50_EACH: DocCountExpectations = {
  lessons: 50,
  unit_rollup: 50,
  units: 50,
  sequences: 50,
  sequence_facets: 50,
  threads: 50,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('verifyDocCounts', () => {
  it('reports ALL 3 failing indexes when 3 of 6 have insufficient counts', async () => {
    const client = createMockClient(ALL_INDEXES_MIXED);

    const result = await verifyDocCounts(client, testResolver, EXPECT_50_EACH);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unit_rollup');
      expect(result.error.message).toContain('sequences');
      expect(result.error.message).toContain('threads');
      expect(result.error.type).toBe('validation_error');
      if (result.error.type === 'validation_error') {
        expect(result.error.details).toBeDefined();
      }
    }
  });

  it('returns ok with per-index status when all indexes pass', async () => {
    const client = createMockClient(ALL_INDEXES_PASSING);

    const result = await verifyDocCounts(client, testResolver, EXPECT_50_EACH);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const verification: DocCountVerification = result.value;
      expect(verification.allPassed).toBe(true);
      expect(verification.results).toHaveLength(SEARCH_INDEX_KINDS.length);
      for (const status of verification.results) {
        expect(status.passed).toBe(true);
        expect(status.actual).toBeGreaterThanOrEqual(status.expected);
      }
    }
  });

  it('includes actual and expected counts in per-index status', async () => {
    const client = createMockClient([
      { index: 'oak_lessons', count: 500 },
      { index: 'oak_unit_rollup', count: 10 },
      { index: 'oak_units', count: 200 },
      { index: 'oak_sequences', count: 150 },
      { index: 'oak_sequence_facets', count: 50 },
      { index: 'oak_threads', count: 80 },
    ]);

    const expectations: DocCountExpectations = {
      lessons: 100,
      unit_rollup: 50,
      units: 50,
      sequences: 50,
      sequence_facets: 50,
      threads: 50,
    };

    const result = await verifyDocCounts(client, testResolver, expectations);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unit_rollup');
      expect(result.error.message).toContain('10');
      expect(result.error.message).toContain('50');
    }
  });

  it('treats a missing index (0 docs) as a failure', async () => {
    const client = createMockClient([
      { index: 'oak_lessons', count: 100 },
      { index: 'oak_units', count: 200 },
      { index: 'oak_sequences', count: 150 },
      { index: 'oak_sequence_facets', count: 50 },
      { index: 'oak_threads', count: 80 },
      // oak_unit_rollup is missing
    ]);

    const result = await verifyDocCounts(client, testResolver, EXPECT_50_EACH);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unit_rollup');
    }
  });

  it('returns an ES error result when the client call fails', async () => {
    const client = new Client({ node: 'http://localhost:19200' });
    vi.spyOn(client.cat, 'indices').mockRejectedValue(new Error('Connection refused'));

    const expectations: DocCountExpectations = {
      lessons: 1,
      unit_rollup: 1,
      units: 1,
      sequences: 1,
      sequence_facets: 1,
      threads: 1,
    };

    const result = await verifyDocCounts(client, testResolver, expectations);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('Connection refused');
    }
  });

  it('error details contain per-index status for each index kind', async () => {
    const client = createMockClient(ALL_INDEXES_MIXED);

    const result = await verifyDocCounts(client, testResolver, EXPECT_50_EACH);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      if (result.error.type === 'validation_error') {
        const details = result.error.details;
        expect(details).toBeDefined();
        if (details) {
          expect(details).toContain('lessons');
          expect(details).toContain('units');
          expect(details).toContain('sequence_facets');
          expect(details).toContain('unit_rollup');
          expect(details).toContain('sequences');
          expect(details).toContain('threads');
        }
      }
    }
  });

  it('per-index status includes the index kind', async () => {
    const client = createMockClient(ALL_INDEXES_PASSING);

    const result = await verifyDocCounts(client, testResolver, EXPECT_50_EACH);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const kinds = result.value.results.map((status: IndexDocCountStatus) => status.kind);
      for (const kind of SEARCH_INDEX_KINDS) {
        expect(kinds).toContain(kind);
      }
    }
  });
});
