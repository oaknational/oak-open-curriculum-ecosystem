import { describe, expect, it, beforeEach, vi } from 'vitest';
import { handleZeroHitSummary, handleZeroHitWebhook } from './zero-hit-api';
import { recordZeroHitEvent, resetZeroHitStore, getZeroHitSummary } from '../zero-hit-store';
import type { ZeroHitTelemetry } from '../zero-hit-persistence';

const TEST_CONFIG = {
  SEARCH_API_KEY: 'test-key',
} as const;

const persistenceMocks = vi.hoisted(() => ({
  zeroHitPersistenceEnabled: vi.fn(() => false),
  fetchZeroHitTelemetry: vi.fn<() => Promise<ZeroHitTelemetry>>(async () => ({
    summary: {
      total: 0,
      byScope: { lessons: 0, units: 0, sequences: 0 },
      latestIndexVersion: null,
    },
    recent: [],
  })),
  persistZeroHitEvent: vi.fn(async () => undefined),
}));

vi.mock('../zero-hit-persistence', () => persistenceMocks);

interface SummaryScopeBreakdown {
  lessons: number;
  units: number;
  sequences: number;
}

interface SummarySnapshot {
  total: number;
  byScope: SummaryScopeBreakdown;
  latestIndexVersion: string | null;
}

interface EventFilters {
  [key: string]: string;
}

interface DashboardEvent {
  timestamp: number;
  scope: 'lessons' | 'units' | 'sequences';
  query: string;
  filters: EventFilters;
  indexVersion: string;
}

interface SummaryResponse {
  summary: SummarySnapshot;
  recent: DashboardEvent[];
}

function isScope(value: unknown): value is 'lessons' | 'units' | 'sequences' {
  return value === 'lessons' || value === 'units' || value === 'sequences';
}

function isJsonObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null;
}

function isStringMap(value: unknown): value is EventFilters {
  if (!isJsonObject(value)) {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Object.values(value).every((entry) => typeof entry === 'string');
}

function isSummarySnapshot(value: unknown): value is SummarySnapshot {
  if (!isJsonObject(value)) {
    return false;
  }
  return (
    isNumber(value.total) &&
    isScopeBreakdown(value.byScope) &&
    isNullableString(value.latestIndexVersion)
  );
}

function isDashboardEvent(value: unknown): value is DashboardEvent {
  if (!isJsonObject(value)) {
    return false;
  }
  return (
    isNumber(value.timestamp) &&
    isScope(value.scope) &&
    typeof value.query === 'string' &&
    typeof value.indexVersion === 'string' &&
    isStringMap(value.filters)
  );
}

function isScopeBreakdown(value: unknown): value is SummaryScopeBreakdown {
  if (!isJsonObject(value)) {
    return false;
  }
  return isNumber(value.lessons) && isNumber(value.units) && isNumber(value.sequences);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function assertSummaryResponse(value: unknown): asserts value is SummaryResponse {
  if (!isJsonObject(value)) {
    throw new Error('Invalid response payload');
  }
  const summary = value.summary;
  const recent = value.recent;

  if (!isSummarySnapshot(summary)) {
    throw new Error('Invalid summary payload');
  }
  if (!Array.isArray(recent)) {
    throw new Error('Invalid recent events payload');
  }

  for (const event of recent) {
    if (!isDashboardEvent(event)) {
      throw new Error('Invalid event entry');
    }
  }
}

function makeRequest(
  method: 'GET' | 'POST',
  body?: unknown,
  headers: Record<string, string> = {},
): Request {
  const requestInit: RequestInit = {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  };
  return new Request('http://localhost/api/observability/zero-hit', requestInit);
}

describe('zero-hit API handlers', () => {
  beforeEach(() => {
    resetZeroHitStore();
    persistenceMocks.zeroHitPersistenceEnabled.mockReturnValue(false);
    persistenceMocks.fetchZeroHitTelemetry.mockClear();
    persistenceMocks.persistZeroHitEvent.mockClear();
  });

  it('rejects unauthorised summary access', async () => {
    const response = await handleZeroHitSummary(makeRequest('GET'), TEST_CONFIG);
    expect(response.status).toBe(401);
  });

  it('returns summary data when authorised', async () => {
    recordZeroHitEvent({
      scope: 'lessons',
      query: 'fractions',
      filters: { subject: 'maths' },
      indexVersion: 'v1',
      timestamp: 100,
    });

    const response = await handleZeroHitSummary(
      makeRequest('GET', undefined, { 'x-search-api-key': 'test-key' }),
      TEST_CONFIG,
    );
    expect(response.status).toBe(200);
    const payload: unknown = await response.json();
    assertSummaryResponse(payload);
    expect(payload.summary.total).toBe(1);
    expect(payload.recent).toHaveLength(1);
    expect(persistenceMocks.fetchZeroHitTelemetry).not.toHaveBeenCalled();
  });

  it('returns persisted telemetry when enabled', async () => {
    const telemetry = {
      summary: {
        total: 5,
        byScope: { lessons: 3, units: 2, sequences: 0 },
        latestIndexVersion: 'v9',
      },
      recent: [
        {
          timestamp: 123,
          scope: 'units' as const,
          query: 'angles',
          filters: { keyStage: 'ks3' },
          indexVersion: 'v9',
        },
      ],
    };
    persistenceMocks.zeroHitPersistenceEnabled.mockReturnValue(true);
    persistenceMocks.fetchZeroHitTelemetry.mockResolvedValueOnce(telemetry);

    const response = await handleZeroHitSummary(
      makeRequest('GET', undefined, { 'x-search-api-key': 'test-key' }),
      TEST_CONFIG,
    );
    expect(response.status).toBe(200);
    const payload: unknown = await response.json();
    assertSummaryResponse(payload);
    expect(payload.summary.total).toBe(5);
    expect(payload.recent).toEqual(telemetry.recent);
    expect(persistenceMocks.fetchZeroHitTelemetry).toHaveBeenCalledWith({ limit: 50 }, TEST_CONFIG);
  });

  it('accepts webhook events when authorised', async () => {
    persistenceMocks.zeroHitPersistenceEnabled.mockReturnValue(true);
    persistenceMocks.persistZeroHitEvent.mockResolvedValueOnce(undefined);

    const response = await handleZeroHitWebhook(
      makeRequest(
        'POST',
        {
          scope: 'units',
          query: 'angles',
          indexVersion: 'v2',
          filters: { keyStage: 'ks3' },
          timestamp: 200,
        },
        { 'x-search-api-key': 'test-key' },
      ),
      TEST_CONFIG,
    );
    expect(response.status).toBe(202);
    expect(getZeroHitSummary().total).toBe(1);
    expect(persistenceMocks.persistZeroHitEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'units',
        query: 'angles',
        indexVersion: 'v2',
      }),
      TEST_CONFIG,
    );
  });

  it('rejects invalid webhook payloads', async () => {
    const response = await handleZeroHitWebhook(
      makeRequest('POST', { query: 'invalid' }, { 'x-search-api-key': 'test-key' }),
      TEST_CONFIG,
    );
    expect(response.status).toBe(400);
    expect(getZeroHitSummary().total).toBe(0);
  });
});
