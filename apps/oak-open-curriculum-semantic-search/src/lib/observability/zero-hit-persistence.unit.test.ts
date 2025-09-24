import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TransportRequestOptions, TransportRequestParams } from '@elastic/elasticsearch';

const envStub = vi.hoisted(() => ({
  env: vi.fn(() => ({
    ZERO_HIT_PERSISTENCE_ENABLED: true,
    ZERO_HIT_INDEX_RETENTION_DAYS: 30,
    SEARCH_INDEX_TARGET: 'primary',
  })),
}));

vi.mock('../../lib/env', () => envStub);

const transportStub = vi.hoisted(() => {
  const request =
    vi.fn<
      (params: TransportRequestParams, options?: TransportRequestOptions) => Promise<unknown>
    >();
  return { request };
});

vi.mock('../../lib/es-client', () => ({
  esClient: () => ({ transport: transportStub }),
}));

const targetStub = vi.hoisted(() => ({
  currentSearchIndexTarget: vi.fn(() => 'primary' as const),
  resolveZeroHitIndexName: vi.fn(() => 'oak_zero_hit_events'),
  ZERO_HIT_INDEX_BASE: 'oak_zero_hit_events',
}));

vi.mock('../../lib/search-index-target', () => targetStub);

import {
  __resetZeroHitPersistenceCachesForTests,
  persistZeroHitEvent,
  fetchZeroHitTelemetry,
  zeroHitPersistenceEnabled,
} from './zero-hit-persistence';

interface TransportCall {
  params: TransportRequestParams;
  options?: TransportRequestOptions;
}

describe('zero-hit persistence', () => {
  beforeEach(() => {
    envStub.env.mockClear();
    transportStub.request.mockReset();
    targetStub.currentSearchIndexTarget.mockReturnValue('primary');
    targetStub.resolveZeroHitIndexName.mockReturnValue('oak_zero_hit_events');
    envStub.env.mockReturnValue({
      ZERO_HIT_PERSISTENCE_ENABLED: true,
      ZERO_HIT_INDEX_RETENTION_DAYS: 30,
      SEARCH_INDEX_TARGET: 'primary',
    });
    __resetZeroHitPersistenceCachesForTests();
  });

  it('reports persistence toggle from the environment', () => {
    envStub.env.mockReturnValueOnce({
      ZERO_HIT_PERSISTENCE_ENABLED: false,
      ZERO_HIT_INDEX_RETENTION_DAYS: 30,
      SEARCH_INDEX_TARGET: 'sandbox',
    });

    expect(zeroHitPersistenceEnabled()).toBe(false);
  });

  it('creates the ILM policy and index before persisting documents', async () => {
    transportStub.request
      .mockResolvedValueOnce({ acknowledged: true })
      .mockResolvedValueOnce({ acknowledged: true })
      .mockResolvedValueOnce({ result: 'created' });

    await persistZeroHitEvent({
      timestamp: 1_700_000_000_000,
      scope: 'lessons',
      text: 'fractions',
      filters: { subject: 'maths' },
      indexVersion: 'v1',
      tookMs: 123,
      timedOut: false,
    });

    const calls: TransportCall[] = transportStub.request.mock.calls.map(([params, options]) => ({
      params,
      options,
    }));
    expect(calls[0]?.params).toMatchObject({
      method: 'PUT',
      path: '/_ilm/policy/oak_zero_hit_events_retention_30d',
    });
    expect(calls[1]?.params).toMatchObject({ method: 'PUT', path: '/oak_zero_hit_events' });
    expect(calls[2]?.params).toMatchObject({ method: 'POST', path: '/oak_zero_hit_events/_doc' });
    expect(calls[2]?.params.body).toContain('"search_scope":"lessons"');
  });

  it('fetches recent telemetry with aggregations', async () => {
    transportStub.request.mockResolvedValueOnce({
      hits: {
        total: { value: 2 },
        hits: [
          {
            _source: {
              '@timestamp': '2025-09-25T12:00:00Z',
              search_scope: 'units',
              query: 'angles',
              filters: { keyStage: 'ks3' },
              index_version: 'v5',
            },
          },
        ],
      },
      aggregations: {
        by_scope: {
          buckets: [{ key: 'units', doc_count: 2 }],
        },
        latest_version: {
          hits: {
            hits: [
              {
                _source: { index_version: 'v5' },
              },
            ],
          },
        },
      },
    });

    const telemetry = await fetchZeroHitTelemetry({ limit: 10 });

    expect(transportStub.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        path: '/oak_zero_hit_events/_search',
      }),
      expect.anything(),
    );
    expect(telemetry.summary.total).toBe(2);
    expect(telemetry.summary.byScope.units).toBe(2);
    expect(telemetry.summary.latestIndexVersion).toBe('v5');
    expect(telemetry.recent[0]).toMatchObject({
      scope: 'units',
      text: 'angles',
      indexVersion: 'v5',
    });
  });

  it('returns empty telemetry when the index is missing', async () => {
    const error = {
      meta: {
        statusCode: 404,
        body: {
          error: { type: 'index_not_found_exception' },
        },
      },
    } as unknown;
    transportStub.request.mockRejectedValueOnce(error);

    const telemetry = await fetchZeroHitTelemetry({ limit: 10 });

    expect(telemetry.summary.total).toBe(0);
    expect(telemetry.recent).toHaveLength(0);
  });
});
