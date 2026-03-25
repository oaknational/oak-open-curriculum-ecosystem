/**
 * Integration tests for `createRunVersionedIngest` — the CLI-layer closure
 * that bridges the bulk ingestion pipeline to the lifecycle service.
 *
 * @remarks
 * Tests use simple injected fakes (ADR-078). No global module mocking.
 */
import { describe, it, expect, vi } from 'vitest';
import type { OakClient } from '../../adapters/oak-adapter';
import type { EsTransport } from './ingest-harness-ops';
import type { BulkIngestionResult, BulkIngestionOptions } from './bulk-ingestion';
import type { BulkUploadResult } from './bulk-chunk-uploader';
import type { BulkOperationEntry } from './bulk-operation-types';
import { createRunVersionedIngest } from './run-versioned-ingest';

// ---------------------------------------------------------------------------
// Fakes
// ---------------------------------------------------------------------------

/** Structural OakClient fake matching hybrid-data-source integration test pattern. */
function fakeOakClient(): OakClient {
  return {
    getUnitsByKeyStageAndSubject: vi.fn(),
    getLessonTranscript: vi.fn(),
    getLessonSummary: vi.fn(),
    getUnitSummary: vi.fn(),
    getSubjectSequences: vi.fn(),
    getSequenceUnits: vi.fn(),
    getAllThreads: vi.fn(),
    getThreadUnits: vi.fn(),
    getLessonsByKeyStageAndSubject: vi.fn(),
    getSubjectAssets: vi.fn(),
    rateLimitTracker: {
      getStatus: vi.fn().mockReturnValue({ remaining: 1000, total: 1000 }),
      getRequestCount: vi.fn().mockReturnValue(0),
      getRequestRate: vi.fn().mockReturnValue(0),
      reset: vi.fn(),
    },
    getCacheStats: vi.fn().mockReturnValue({
      hits: 0,
      misses: 0,
      sets: 0,
      size: 0,
      hitRate: 0,
      cacheEnabled: false,
      adapters: {},
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
}

/** Minimal EsTransport fake — only identity matters for most tests. */
function fakeEsTransport(): EsTransport {
  return { transport: { request: vi.fn() } };
}

/** Fake bulk operations — only shape matters, not content. */
const FAKE_OPS = [{ index: { _index: 'oak_lessons_v1' } }] satisfies BulkOperationEntry[];

/** A successful BulkIngestionResult fixture. */
function makeBulkIngestionResult(overrides?: Partial<BulkIngestionResult>): BulkIngestionResult {
  return {
    operations: FAKE_OPS,
    stats: {
      filesProcessed: 3,
      lessonsIndexed: 10,
      unitsIndexed: 5,
      rollupsIndexed: 2,
      threadsIndexed: 4,
      sequencesIndexed: 6,
      sequenceFacetsIndexed: 3,
      vocabularyStats: {
        uniqueKeywords: 100,
        totalMisconceptions: 20,
        synonymsExtracted: 15,
      },
    },
    ...overrides,
  };
}

/** A successful BulkUploadResult fixture. */
function makeBulkUploadResult(overrides?: Partial<BulkUploadResult>): BulkUploadResult {
  return {
    successCount: 30,
    permanentlyFailed: [],
    indexCounts: {},
    ...overrides,
  };
}

/** Create a prepare stub returning a canned result. */
function stubPrepare(result: BulkIngestionResult) {
  return vi
    .fn<(options: BulkIngestionOptions) => Promise<BulkIngestionResult>>()
    .mockResolvedValue(result);
}

/** Create a dispatch stub returning a canned upload result. */
function stubDispatch(result: BulkUploadResult) {
  return vi.fn().mockResolvedValue(result);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createRunVersionedIngest', () => {
  it('rejects dryRun: true with a validation_error Result', async () => {
    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
    });

    const result = await run('v2026-03-09-120000', {
      bulkDir: '/tmp/bulk',
      dryRun: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('dryRun');
    }
  });

  it('calls prepareBulkIngestion with versioned resolver and options', async () => {
    const prepare = stubPrepare(makeBulkIngestionResult());
    const dispatch = stubDispatch(makeBulkUploadResult());

    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: prepare,
      dispatchBulk: dispatch,
    });

    await run('v2026-03-09-120000', {
      bulkDir: '/tmp/bulk',
      subjectFilter: ['maths'],
    });

    expect(prepare).toHaveBeenCalledOnce();
    const callArgs = prepare.mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    if (callArgs) {
      expect(callArgs.bulkDir).toBe('/tmp/bulk');
      expect(callArgs.subjectFilter).toEqual(['maths']);
      expect(typeof callArgs.resolveIndex).toBe('function');
    }
  });

  it('dispatches operations via dispatchBulk', async () => {
    const operations = [{ index: { _index: 'oak_lessons_v1' } }] satisfies BulkOperationEntry[];
    const prepare = stubPrepare(makeBulkIngestionResult({ operations }));
    const dispatch = stubDispatch(makeBulkUploadResult());
    const esTransport = fakeEsTransport();

    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport,
      target: 'primary',
      prepareBulkIngestion: prepare,
      dispatchBulk: dispatch,
    });

    await run('v1', { bulkDir: '/tmp/bulk' });

    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch.mock.calls[0]?.[0]).toBe(esTransport);
    expect(dispatch.mock.calls[0]?.[1]).toBe(operations);
  });

  it('converts BulkIngestionStats to IngestResult, dropping vocabularyStats', async () => {
    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: stubPrepare(makeBulkIngestionResult()),
      dispatchBulk: stubDispatch(makeBulkUploadResult()),
    });

    const result = await run('v1', { bulkDir: '/tmp/bulk' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.filesProcessed).toBe(3);
      expect(result.value.lessonsIndexed).toBe(10);
      expect(result.value.unitsIndexed).toBe(5);
      expect(result.value.rollupsIndexed).toBe(2);
      expect(result.value.threadsIndexed).toBe(4);
      expect(result.value.sequencesIndexed).toBe(6);
      expect(result.value.sequenceFacetsIndexed).toBe(3);
      expect('vocabularyStats' in result.value).toBe(false);
    }
  });

  it('returns es_error when dispatchBulk throws', async () => {
    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: stubPrepare(makeBulkIngestionResult()),
      dispatchBulk: vi.fn().mockRejectedValue(new Error('ES transport failure')),
    });

    const result = await run('v1', { bulkDir: '/tmp/bulk' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('ES transport failure');
    }
  });

  it('returns es_error when dispatchBulk reports permanently failed operations', async () => {
    const failedOps = [
      { delete: { _index: 'oak_lessons_v1', _id: 'lesson-1' } },
    ] satisfies BulkOperationEntry[];
    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: stubPrepare(makeBulkIngestionResult()),
      dispatchBulk: stubDispatch(makeBulkUploadResult({ permanentlyFailed: failedOps })),
    });

    const result = await run('v1', { bulkDir: '/tmp/bulk' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('permanently failed');
    }
  });

  it('returns data_source_error when prepareBulkIngestion throws', async () => {
    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: vi.fn().mockRejectedValue(new Error('Oak API returned 503')),
      dispatchBulk: vi.fn(),
    });

    const result = await run('v1', { bulkDir: '/tmp/bulk' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('data_source_error');
      expect(result.error.message).toContain('Oak API returned 503');
    }
  });

  it('passes versioned resolver that generates correct index names', async () => {
    const prepare = stubPrepare(makeBulkIngestionResult());

    const run = createRunVersionedIngest({
      oakClient: fakeOakClient(),
      esTransport: fakeEsTransport(),
      target: 'primary',
      prepareBulkIngestion: prepare,
      dispatchBulk: stubDispatch(makeBulkUploadResult()),
    });

    await run('v2026-03-09-120000', { bulkDir: '/tmp/bulk' });

    expect(prepare).toHaveBeenCalledOnce();
    const callArgs = prepare.mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    if (callArgs) {
      const resolver = callArgs.resolveIndex;
      expect(resolver).toBeDefined();
      if (resolver) {
        const resolvedName = resolver('lessons');
        expect(resolvedName).toContain('oak_lessons');
        expect(resolvedName).toContain('v2026-03-09-120000');
      }
    }
  });
});
