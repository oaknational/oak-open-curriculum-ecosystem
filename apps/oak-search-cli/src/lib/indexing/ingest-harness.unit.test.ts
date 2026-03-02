import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createIngestHarness } from './ingest-harness';
import { resolveSearchIndexName } from '../search-index-target';
import type { EsTransport } from './ingest-harness-ops';

const FIXTURE_ROOT = path.join(process.cwd(), 'fixtures/sandbox');

interface MockEsTransport extends EsTransport {
  requestMock: ReturnType<typeof vi.fn>;
  requests: unknown[];
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ingest harness', () => {
  it('prepares bulk operations with per-index counts for sandbox target', async () => {
    const mock = createMockEsTransport();
    const harness = await createIngestHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
    });

    const { operations, summary, metrics } = await harness.prepareBulkOperations();

    expect(summary.target).toBe('sandbox');
    expect(summary.totalDocs).toBeGreaterThan(0);
    expect(summary.counts).toMatchObject({
      lessons: 2,
      units: 1,
      unit_rollup: 1,
      sequence_facets: 1,
    });

    expect(metrics?.sequenceFacets.totalSequences).toBeGreaterThan(0);
    expect(metrics?.sequenceFacets.includedSequences).toBe(1);
    expect(metrics?.sequenceFacets.skippedSequences).toBeGreaterThanOrEqual(0);
    expect(metrics?.sequenceFacets.entries[0]?.fetchDurationMs).toBeGreaterThanOrEqual(0);

    const actionIndexes = collectActionIndexes(operations);
    expect(actionIndexes).toContain(resolveSearchIndexName('lessons', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('units', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('unit_rollup', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('sequence_facets', 'sandbox'));
  });

  it('performs ingestion when dry-run is disabled and logs summary metadata', async () => {
    const mock = createMockEsTransport();
    const harness = await createIngestHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
    });

    const result = await harness.ingest({ dryRun: false, verbose: true });

    expect(result.summary.totalDocs).toBeGreaterThan(0);
    expect(result.metrics?.sequenceFacets.totalSequences).toBeGreaterThan(0);
    expect(mock.requestMock).toHaveBeenCalledTimes(1);
    const paramsCandidate = mock.requests[0];
    if (!isUnknownObject(paramsCandidate)) {
      throw new Error('Expected bulk request params');
    }
    const params = paramsCandidate;
    expect(params.method).toBe('POST');
    expect(params.path).toBe('/_bulk');
    expect(typeof params.body).toBe('string');
    const lines = String(params.body).trim().split('\n');
    expect(lines.length).toBe(result.operations.length);
  });

  it('skips network calls when run in dry-run mode', async () => {
    const mock = createMockEsTransport();
    const harness = await createIngestHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
    });

    const result = await harness.ingest({ dryRun: true, verbose: true });

    expect(result.summary.totalDocs).toBeGreaterThan(0);
    expect(result.metrics?.sequenceFacets.totalSequences).toBeGreaterThan(0);
    expect(mock.requestMock).not.toHaveBeenCalled();
    expect(mock.requests).toHaveLength(0);
  });
});

function collectActionIndexes(operations: readonly unknown[]): string[] {
  const indexes: string[] = [];
  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    if (!isUnknownObject(action) || !('index' in action)) {
      continue;
    }
    const indexSection = action.index;
    if (!isUnknownObject(indexSection) || !('_index' in indexSection)) {
      continue;
    }
    const indexName = indexSection._index;
    if (typeof indexName === 'string') {
      indexes.push(indexName);
    }
  }
  return indexes;
}

function createMockEsTransport(): MockEsTransport {
  const requests: unknown[] = [];
  const requestMock = vi.fn(async (params: { method: string; path: string; body: string }) => {
    requests.push(params);
    return { errors: false, items: [] };
  });
  const transport: EsTransport = {
    transport: {
      request: requestMock,
    },
  };
  return { ...transport, requestMock, requests };
}

function isUnknownObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null;
}
