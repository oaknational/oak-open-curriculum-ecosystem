/**
 * Unit tests for ingestion harness bulk operations.
 * Tests progress logging and error handling during ES bulk uploads.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { BulkOperations, BulkIndexAction } from './bulk-operation-types';
import type { SearchThreadIndexDoc } from '../../types/oak';
import {
  dispatchBulk,
  summariseOperations,
  resolveOperationIndexes,
  createNdjson,
  type EsTransport,
} from './ingest-harness-ops.js';
import { createIndexResolver } from '../search-index-target';

/**
 * Build a BulkOperations array from action/document pairs.
 * Uses minimal valid SearchThreadIndexDoc stubs for the document bodies,
 * since these tests exercise infrastructure (chunking, dispatch, index resolution)
 * rather than document content.
 */
function buildOps(
  ...pairs: readonly (readonly [BulkIndexAction, Partial<SearchThreadIndexDoc>])[]
): BulkOperations {
  const ops: BulkOperations = [];
  for (const [action, docOverrides] of pairs) {
    ops.push(action);
    const doc: SearchThreadIndexDoc = {
      thread_slug: 'stub',
      thread_title: 'stub',
      unit_count: 0,
      ...docOverrides,
    };
    ops.push(doc);
  }
  return ops;
}

/** Convenience: build a BulkIndexAction from index name and optional id. */
function action(index: string, id?: string): BulkIndexAction {
  if (id !== undefined) {
    return { index: { _index: index, _id: id } } as const;
  }
  return { index: { _index: index } } as const;
}

/**
 * Create a mock EsTransport for testing.
 * Returns both the transport and the request function for assertions.
 */
function createMockEsTransport(): {
  transport: EsTransport;
  requestFn: ReturnType<typeof vi.fn>;
} {
  const requestFn = vi.fn();
  const transport: EsTransport = {
    transport: {
      request: requestFn,
    },
  };
  return { transport, requestFn };
}

/**
 * Create a mock logger for testing.
 */
function createMockLogger(): Logger {
  return {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  };
}

describe('dispatchBulk', () => {
  let mockEs: EsTransport;
  let mockRequestFn: ReturnType<typeof vi.fn>;
  let mockLogger: Logger;

  beforeEach(() => {
    const mockTransport = createMockEsTransport();
    mockEs = mockTransport.transport;
    mockRequestFn = mockTransport.requestFn;
    mockLogger = createMockLogger();
  });

  it('logs progress before and after successful bulk upload', async () => {
    const operations = buildOps(
      [action('oak_lessons', '1'), { thread_title: 'Lesson 1' }],
      [action('oak_lessons', '2'), { thread_title: 'Lesson 2' }],
    );

    // Return proper bulk response with success items
    mockRequestFn.mockResolvedValue({
      errors: false,
      items: [
        { index: { _index: 'oak_lessons', status: 201 } },
        { index: { _index: 'oak_lessons', status: 201 } },
      ],
    });

    await dispatchBulk(mockEs, operations, mockLogger);

    expect(mockLogger.info).toHaveBeenNthCalledWith(
      1,
      'Starting bulk upload to Elasticsearch',
      expect.objectContaining({
        documents: 2,
        operations: 4,
      }),
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      2,
      'Bulk upload chunked',
      expect.objectContaining({
        chunks: 1,
      }),
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      3,
      'Chunk uploaded',
      expect.objectContaining({
        chunk: 1,
        totalChunks: 1,
        totalUploaded: 2,
        of: 2,
      }),
    );
    expect(mockLogger.info).toHaveBeenNthCalledWith(
      4,
      'Bulk upload completed successfully',
      expect.objectContaining({
        documents: 2,
      }),
    );
  });

  it('logs errors when bulk upload has failures', async () => {
    const operations = buildOps([action('oak_lessons', '1'), { thread_title: 'Lesson 1' }]);

    mockRequestFn.mockResolvedValue({
      errors: true,
      items: [
        {
          index: {
            _index: 'oak_lessons',
            status: 400,
            error: { type: 'mapper_parsing_exception', reason: 'Field missing' },
          },
        },
      ],
    });

    await dispatchBulk(mockEs, operations, mockLogger);

    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('returns per-index counts distinguishing indexed vs failed', async () => {
    const operations = buildOps(
      [action('oak_lessons', '1'), { thread_title: 'Lesson 1' }],
      [action('oak_lessons', '2'), { thread_title: 'Lesson 2' }],
      [action('oak_units', '3'), { thread_title: 'Unit 1' }],
    );

    mockRequestFn.mockResolvedValue({
      errors: true,
      items: [
        { index: { _index: 'oak_lessons', status: 201 } },
        {
          index: {
            _index: 'oak_lessons',
            status: 400,
            error: { type: 'mapper_parsing_exception', reason: 'bad field' },
          },
        },
        { index: { _index: 'oak_units', status: 201 } },
      ],
    });

    const result = await dispatchBulk(mockEs, operations, mockLogger);

    expect(result.indexCounts).toBeDefined();
    expect(result.indexCounts).toEqual({
      oak_lessons: { indexed: 1, failed: 1 },
      oak_units: { indexed: 1, failed: 0 },
    });
  });

  it('returns empty indexCounts when no operations are dispatched', async () => {
    const operations: BulkOperations = [];

    mockRequestFn.mockResolvedValue({
      errors: false,
      items: [],
    });

    const result = await dispatchBulk(mockEs, operations, mockLogger);

    expect(result.indexCounts).toBeDefined();
    expect(result.indexCounts).toEqual({});
  });

  it('calculates document count correctly from operations', async () => {
    const operations = buildOps(
      [action('oak_lessons', '1'), { thread_title: 'Doc 1' }],
      [action('oak_units', '2'), { thread_title: 'Doc 2' }],
      [action('oak_lessons', '3'), { thread_title: 'Doc 3' }],
    );

    // Return proper bulk response with success items
    mockRequestFn.mockResolvedValue({
      errors: false,
      items: [
        { index: { _index: 'oak_lessons', status: 201 } },
        { index: { _index: 'oak_units', status: 201 } },
        { index: { _index: 'oak_lessons', status: 201 } },
      ],
    });

    await dispatchBulk(mockEs, operations, mockLogger);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Starting bulk upload to Elasticsearch',
      expect.objectContaining({
        documents: 3,
        operations: 6,
      }),
    );
  });
});

describe('summariseOperations', () => {
  it('counts documents by index kind', () => {
    const operations = buildOps(
      [action('oak_lessons'), {}],
      [action('oak_units'), {}],
      [action('oak_lessons'), {}],
    );

    const summary = summariseOperations(operations, 'primary');

    expect(summary.totalDocs).toBe(3);
    expect(summary.counts.lessons).toBe(2);
    expect(summary.counts.units).toBe(1);
  });

  it('returns zero counts for empty operations', () => {
    const summary = summariseOperations([], 'primary');

    expect(summary.totalDocs).toBe(0);
    expect(summary.counts.lessons).toBe(0);
    expect(summary.counts.units).toBe(0);
  });
});

describe('resolveOperationIndexes', () => {
  it('rewrites primary index names to sandbox when given a sandbox resolver', () => {
    const operations = buildOps(
      [action('oak_lessons', 'lesson-1'), {}],
      [action('oak_unit_rollup', 'unit-1'), {}],
    );

    const resolve = createIndexResolver('sandbox');
    const resolved = resolveOperationIndexes(operations, resolve);

    expect(resolved[0]).toEqual({ index: { _index: 'oak_lessons_sandbox', _id: 'lesson-1' } });
    expect(resolved[1]).toMatchObject({ thread_slug: 'stub' });
    expect(resolved[2]).toEqual({
      index: { _index: 'oak_unit_rollup_sandbox', _id: 'unit-1' },
    });
    expect(resolved[3]).toMatchObject({ thread_slug: 'stub' });
  });

  it('passes operations through unchanged when given a primary resolver', () => {
    const operations = buildOps([action('oak_lessons', 'lesson-1'), {}]);

    const resolve = createIndexResolver('primary');
    const resolved = resolveOperationIndexes(operations, resolve);

    expect(resolved[0]).toEqual({ index: { _index: 'oak_lessons', _id: 'lesson-1' } });
    expect(resolved[1]).toMatchObject({ thread_slug: 'stub' });
  });

  it('leaves unrecognised index names unchanged', () => {
    const operations = buildOps([action('other_index', '123'), {}]);

    const resolve = createIndexResolver('sandbox');
    const resolved = resolveOperationIndexes(operations, resolve);

    expect(resolved[0]).toEqual({ index: { _index: 'other_index', _id: '123' } });
    expect(resolved[1]).toMatchObject({ thread_slug: 'stub' });
  });
});

describe('createNdjson', () => {
  it('converts operations array to NDJSON format', () => {
    const operations = buildOps([action('test'), { thread_title: 'value' }]);

    const ndjson = createNdjson(operations);

    const lines = ndjson.split('\n');
    expect(JSON.parse(lines[0])).toEqual({ index: { _index: 'test' } });
    expect(JSON.parse(lines[1])).toMatchObject({ thread_title: 'value' });
    expect(lines[2]).toBe('');
  });

  it('handles empty array', () => {
    const ndjson = createNdjson([]);

    expect(ndjson).toBe('\n');
  });
});
