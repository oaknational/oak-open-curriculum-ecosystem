import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  type ZeroHitTelemetry,
  ZeroHitTelemetrySchema,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

const handleZeroHitSummary = vi.hoisted(() =>
  vi.fn(async () =>
    NextResponse.json<ZeroHitTelemetry>({
      summary: {
        total: 1,
        byScope: { lessons: 1, units: 0, sequences: 0 },
        latestIndexVersion: 'v-test',
      },
      recent: [],
    }),
  ),
);

const handleZeroHitWebhook = vi.hoisted(() => vi.fn());

vi.mock('../../../../src/lib/observability/api/zero-hit-api', () => ({
  handleZeroHitSummary,
  handleZeroHitWebhook,
}));

import { GET } from './route';

function createRequest(url: string): NextRequest {
  return new NextRequest(url);
}

async function readTelemetry(response: Response): Promise<ZeroHitTelemetry> {
  const payload: unknown = await response.json();
  const parsed = ZeroHitTelemetrySchema.parse(payload);
  return parsed;
}

const zeroHitErrorSchema = z.object({
  error: z.literal('FIXTURE_ERROR'),
  message: z.string(),
});

async function readError(response: Response): Promise<z.infer<typeof zeroHitErrorSchema>> {
  const payload: unknown = await response.json();
  const parsed = zeroHitErrorSchema.parse(payload);
  return parsed;
}

describe('GET /api/observability/zero-hit (fixtures)', () => {
  beforeEach(() => {
    handleZeroHitSummary.mockClear();
  });

  it('returns deterministic telemetry for fixture mode', async () => {
    const request = createRequest('http://localhost/api/observability/zero-hit?fixtures=on');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await readTelemetry(response);
    expect(data.summary.total).toBeGreaterThan(0);
    expect(Array.isArray(data.recent)).toBe(true);
    expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=on');
    expect(handleZeroHitSummary).not.toHaveBeenCalled();
  });

  it('returns an empty payload for fixtures-empty mode', async () => {
    const request = createRequest('http://localhost/api/observability/zero-hit?fixtures=empty');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await readTelemetry(response);
    expect(data.summary.total).toBe(0);
    expect(data.summary.byScope).toEqual({ lessons: 0, units: 0, sequences: 0 });
    expect(Array.isArray(data.recent)).toBe(true);
    expect(data.recent.length).toBe(0);
    expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=empty');
    expect(handleZeroHitSummary).not.toHaveBeenCalled();
  });

  it('returns an error payload for fixtures-error mode', async () => {
    const request = createRequest('http://localhost/api/observability/zero-hit?fixtures=error');
    const response = await GET(request);

    expect(response.status).toBe(503);
    const data = await readError(response);
    expect(data).toEqual({
      error: 'FIXTURE_ERROR',
      message: 'Fixture mode requested an error response for zero-hit telemetry.',
    });
    expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=error');
    expect(handleZeroHitSummary).not.toHaveBeenCalled();
  });

  it('delegates to the live handler when fixtures are disabled', async () => {
    const request = createRequest('http://localhost/api/observability/zero-hit?fixtures=off');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await readTelemetry(response);
    expect(body.summary).toEqual({
      total: 1,
      byScope: { lessons: 1, units: 0, sequences: 0 },
      latestIndexVersion: 'v-test',
    });
    expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=off');
    expect(handleZeroHitSummary).toHaveBeenCalledOnce();
  });
});
