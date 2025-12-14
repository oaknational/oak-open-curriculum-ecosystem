import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Client } from '@elastic/elasticsearch';
import { createSandboxHarness } from './sandbox-harness';
import { resolveSearchIndexName } from '../search-index-target';

const FIXTURE_ROOT = path.join(process.cwd(), 'fixtures/sandbox');

type TransportClient = Pick<Client, 'transport'>;
type Transport = TransportClient['transport'];

interface MockEsTransport extends TransportClient {
  requestMock: ReturnType<typeof vi.fn>;
  requests: unknown[];
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sandbox harness', () => {
  it('prepares sandbox-targeted bulk operations with per-index counts', async () => {
    const mock = createMockEsTransport();
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
      esClient: mock.esClient as never,
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
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
      esClient: mock.esClient as never,
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
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es: mock,
      esClient: mock.esClient as never,
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

interface MockEsClient {
  inference: {
    inference: ReturnType<typeof vi.fn>;
  };
}

function createMockEsTransport(): MockEsTransport & { esClient: MockEsClient } {
  const requests: unknown[] = [];
  const requestMock = vi.fn(async (...args: unknown[]) => {
    requests.push(args[0]);
    // Return a valid bulk response structure
    return { errors: false, items: [] };
  });
  const transport = {
    request: requestMock as unknown as Transport['request'],
  } as unknown as Transport;
  // Mock ES client for inference calls (dense vector generation)
  const esClient: MockEsClient = {
    inference: {
      inference: vi.fn(async () => ({
        text_embedding: [{ embedding: Array(384).fill(0.1) }],
      })),
    },
  };
  return { transport, requestMock, requests, esClient };
}

function isUnknownObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null;
}
