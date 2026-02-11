/**
 * Unit tests for ingestion harness bulk operations.
 * Tests progress logging and error handling during ES bulk uploads.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from './bulk-operation-types';
import {
  dispatchBulk,
  summariseOperations,
  createNdjson,
  type EsTransport,
} from './ingest-harness-ops.js';

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
    const operations = [
      { index: { _index: 'oak_lessons', _id: '1' } },
      { title: 'Lesson 1' },
      { index: { _index: 'oak_lessons', _id: '2' } },
      { title: 'Lesson 2' },
    ] as BulkOperations;

    // Return proper bulk response with success items
    mockRequestFn.mockResolvedValue({
      errors: false,
      items: [
        { index: { _index: 'oak_lessons', status: 201 } },
        { index: { _index: 'oak_lessons', status: 201 } },
      ],
    });

    await dispatchBulk(mockEs, operations, mockLogger);

    expect(mockLogger.info).toHaveBeenCalledTimes(3);
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
      'Bulk upload completed successfully',
      expect.objectContaining({
        documents: 2,
      }),
    );
  });

  it('logs errors when bulk upload has failures', async () => {
    const operations = [
      { index: { _index: 'oak_lessons', _id: '1' } },
      { title: 'Lesson 1' },
    ] as BulkOperations;

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

  it('calculates document count correctly from operations', async () => {
    const operations = [
      { index: { _index: 'oak_lessons', _id: '1' } },
      { title: 'Doc 1' },
      { index: { _index: 'oak_units', _id: '2' } },
      { title: 'Doc 2' },
      { index: { _index: 'oak_lessons', _id: '3' } },
      { title: 'Doc 3' },
    ] as BulkOperations;

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
    const operations = [
      { index: { _index: 'oak_lessons' } },
      { data: 'lesson1' },
      { index: { _index: 'oak_units' } },
      { data: 'unit1' },
      { index: { _index: 'oak_lessons' } },
      { data: 'lesson2' },
    ] as BulkOperations;

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

describe('createNdjson', () => {
  it('converts operations array to NDJSON format', () => {
    const operations = [{ index: { _index: 'test' } }, { data: 'value' }] as BulkOperations;

    const ndjson = createNdjson(operations);

    expect(ndjson).toBe('{"index":{"_index":"test"}}\n{"data":"value"}\n');
  });

  it('handles empty array', () => {
    const ndjson = createNdjson([]);

    expect(ndjson).toBe('\n');
  });
});
