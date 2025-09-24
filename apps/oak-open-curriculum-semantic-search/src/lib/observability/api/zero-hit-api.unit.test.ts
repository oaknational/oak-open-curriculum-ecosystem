import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { handleZeroHitSummary, handleZeroHitWebhook } from './zero-hit-api';
import { recordZeroHitEvent, resetZeroHitStore, getZeroHitSummary } from '../zero-hit-store';

const envMock = vi.hoisted(() => ({
  env: vi.fn(() => ({
    SEARCH_API_KEY: 'test-key',
  })),
}));

vi.mock('../../env', () => envMock);

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
  text: string;
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
    typeof value.text === 'string' &&
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
): NextRequest {
  const requestInit = {
    method,
    headers: new Headers(headers),
    body: body ? JSON.stringify(body) : undefined,
  };
  return new NextRequest('http://localhost/api/observability/zero-hit', requestInit);
}

describe('zero-hit API handlers', () => {
  beforeEach(() => {
    envMock.env.mockClear();
    resetZeroHitStore();
  });

  it('rejects unauthorised summary access', async () => {
    const response = await handleZeroHitSummary(makeRequest('GET'));
    expect(response.status).toBe(401);
  });

  it('returns summary data when authorised', async () => {
    recordZeroHitEvent({
      scope: 'lessons',
      text: 'fractions',
      filters: { subject: 'maths' },
      indexVersion: 'v1',
      timestamp: 100,
    });

    const response = await handleZeroHitSummary(
      makeRequest('GET', undefined, { 'x-search-api-key': 'test-key' }),
    );
    expect(response.status).toBe(200);
    const payload: unknown = await response.json();
    assertSummaryResponse(payload);
    expect(payload.summary.total).toBe(1);
    expect(payload.recent).toHaveLength(1);
  });

  it('accepts webhook events when authorised', async () => {
    const response = await handleZeroHitWebhook(
      makeRequest(
        'POST',
        {
          scope: 'units',
          text: 'angles',
          indexVersion: 'v2',
          filters: { keyStage: 'ks3' },
          timestamp: 200,
        },
        { 'x-search-api-key': 'test-key' },
      ),
    );
    expect(response.status).toBe(202);
    expect(getZeroHitSummary().total).toBe(1);
  });

  it('rejects invalid webhook payloads', async () => {
    const response = await handleZeroHitWebhook(
      makeRequest('POST', { text: 'invalid' }, { 'x-search-api-key': 'test-key' }),
    );
    expect(response.status).toBe(400);
    expect(getZeroHitSummary().total).toBe(0);
  });
});
