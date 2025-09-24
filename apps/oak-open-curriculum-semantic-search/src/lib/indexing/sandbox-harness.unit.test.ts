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
    const es = createMockEsTransport();
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es,
    });

    const { operations, summary } = await harness.prepareBulkOperations();

    expect(summary.target).toBe('sandbox');
    expect(summary.totalDocs).toBeGreaterThan(0);
    expect(summary.counts).toMatchObject({
      lessons: 2,
      units: 1,
      unit_rollup: 1,
      sequence_facets: 1,
    });

    const actionIndexes = collectActionIndexes(operations);
    expect(actionIndexes).toContain(resolveSearchIndexName('lessons', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('units', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('unit_rollup', 'sandbox'));
    expect(actionIndexes).toContain(resolveSearchIndexName('sequence_facets', 'sandbox'));
  });

  it('performs ingestion when dry-run is disabled and logs summary metadata', async () => {
    const es = createMockEsTransport();
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es,
    });

    const result = await harness.ingest({ dryRun: false, verbose: true });

    expect(result.summary.totalDocs).toBeGreaterThan(0);
    expect(es.requestMock).toHaveBeenCalledTimes(1);
    const paramsCandidate = es.requests[0];
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
    const es = createMockEsTransport();
    const harness = await createSandboxHarness({
      fixtureRoot: FIXTURE_ROOT,
      target: 'sandbox',
      es,
    });

    const result = await harness.ingest({ dryRun: true, verbose: true });

    expect(result.summary.totalDocs).toBeGreaterThan(0);
    expect(es.requestMock).not.toHaveBeenCalled();
    expect(es.requests).toHaveLength(0);
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
  const requestMock = vi.fn(async (...args: unknown[]) => {
    requests.push(args[0]);
    return {};
  });
  const transport = {
    request: requestMock as unknown as Transport['request'],
  } as unknown as Transport;
  return { transport, requestMock, requests };
}

function isUnknownObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null;
}
