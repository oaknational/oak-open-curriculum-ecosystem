import { NextRequest } from 'next/server';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { z } from 'zod';
import type { HybridSearchResult, StructuredQuery } from '../../../src/lib/run-hybrid-search';

const runHybridSearch = vi.hoisted(() =>
  vi.fn<(query: StructuredQuery) => Promise<HybridSearchResult>>(),
);

vi.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) => fn,
}));

vi.mock('../../../src/lib/run-hybrid-search', () => ({
  runHybridSearch,
}));

import { POST } from './route';

const HybridResponse = z
  .object({
    scope: z.enum(['lessons', 'units', 'sequences']),
    results: z.array(z.unknown()),
    total: z.number(),
    took: z.number(),
    timedOut: z.boolean(),
    aggregations: z.record(z.string(), z.unknown()).optional(),
  })
  .loose();

describe('POST /api/search', () => {
  beforeEach(() => {
    runHybridSearch.mockReset();
    process.env.SEARCH_INDEX_VERSION = 'test-v1';
  });

  it('allows the sequences scope and calls the hybrid search with phase filters', async () => {
    runHybridSearch.mockResolvedValueOnce({
      scope: 'sequences',
      results: [],
      total: 0,
      took: 7,
      timedOut: false,
    });

    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: 'sequences',
        text: 'fractions',
        subject: 'maths',
        phaseSlug: 'primary',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = HybridResponse.parse(await response.json());
    expect(payload).toMatchObject({
      scope: 'sequences',
      results: [],
      total: 0,
      took: 7,
      timedOut: false,
    });
    expect(runHybridSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'sequences',
        text: 'fractions',
        phaseSlug: 'primary',
      }),
    );
  });

  it('passes includeFacets through to the hybrid search payload', async () => {
    runHybridSearch.mockResolvedValueOnce({
      scope: 'lessons',
      results: [],
      total: 0,
      took: 5,
      timedOut: false,
      aggregations: { subjects: { buckets: [] } },
    });

    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: 'lessons',
        text: 'fractions',
        includeFacets: true,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = HybridResponse.parse(await response.json());
    expect(payload).toMatchObject({
      scope: 'lessons',
      total: 0,
      took: 5,
      timedOut: false,
      aggregations: { subjects: { buckets: [] } },
    });
    expect(runHybridSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'lessons',
        includeFacets: true,
      }),
    );
  });
});
