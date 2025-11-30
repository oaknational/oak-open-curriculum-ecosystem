import { NextRequest } from 'next/server';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { HybridSearchResult, StructuredQuery } from '../../../src/lib/run-hybrid-search';
import { SEQUENCES_SCOPE, LESSONS_SCOPE } from '../../../src/lib/search-scopes';
import {
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  SearchMultiScopeResponseSchema,
  type SearchLessonsResponse,
  type SearchUnitsResponse,
  type SearchSequencesResponse,
  type SearchMultiScopeResponse,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

const runHybridSearch = vi.hoisted(() =>
  vi.fn<(query: StructuredQuery) => Promise<HybridSearchResult>>(),
);

const logZeroHit = vi.hoisted(() => vi.fn<(payload: unknown) => Promise<void>>());

vi.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) => fn,
}));

vi.mock('../../../src/lib/run-hybrid-search', () => ({
  runHybridSearch,
}));

vi.mock('../../../src/lib/observability/zero-hit', () => ({
  logZeroHit,
}));

import { POST } from './route';

describe('POST /api/search', () => {
  beforeEach(() => {
    runHybridSearch.mockReset();
    logZeroHit.mockReset();
    process.env.SEARCH_INDEX_VERSION = 'test-v1';
  });

  it('allows the sequences scope and calls the hybrid search with phase filters', async () => {
    runHybridSearch.mockResolvedValueOnce({
      scope: SEQUENCES_SCOPE,
      results: [],
      total: 0,
      took: 7,
      timedOut: false,
    });
    logZeroHit.mockResolvedValueOnce();

    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: SEQUENCES_SCOPE,
        text: 'fractions',
        subject: 'maths',
        phaseSlug: 'primary',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = parseHybridPayload(await response.json());
    expect(payload).toMatchObject({
      scope: SEQUENCES_SCOPE,
      results: [],
      total: 0,
      took: 7,
      timedOut: false,
    });
    expect(runHybridSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: SEQUENCES_SCOPE,
        text: 'fractions',
        phaseSlug: 'primary',
      }),
    );
    expect(logZeroHit).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'sequences',
        text: 'fractions',
        phaseSlug: 'primary',
        indexVersion: 'test-v1',
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
    logZeroHit.mockResolvedValueOnce();

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
    const payload = parseHybridPayload(await response.json());
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
    expect(logZeroHit).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 0,
        scope: 'lessons',
        text: 'fractions',
        indexVersion: 'test-v1',
      }),
    );
  });

  it('returns fixture payload when the fixtures query parameter is set', async () => {
    const request = new NextRequest('http://localhost/api/search?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: 'lessons',
        text: 'fractions',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = expectLessonsPayload(parseHybridPayload(await response.json()));
    expect(payload.results.length).toBeGreaterThan(0);
    expect(runHybridSearch).not.toHaveBeenCalled();
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
  });

  it('returns fixture payload when the fixtures cookie is set', async () => {
    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'semantic-search-fixtures=on',
      },
      body: JSON.stringify({
        scope: LESSONS_SCOPE,
        text: 'fractions',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expectLessonsPayload(parseHybridPayload(await response.json()));
    expect(runHybridSearch).not.toHaveBeenCalled();
  });

  it('returns an empty-state fixture payload when the fixtures query requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search?fixtures=empty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: LESSONS_SCOPE,
        text: 'fractions',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = expectLessonsPayload(parseHybridPayload(await response.json()));
    expect(payload.total).toBe(0);
    expect(payload.results).toHaveLength(0);
    expect(runHybridSearch).not.toHaveBeenCalled();
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=empty');
  });

  it('returns an empty-state fixture payload when the fixtures cookie requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'semantic-search-fixtures=empty',
      },
      body: JSON.stringify({ scope: LESSONS_SCOPE, text: 'fractions' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = expectLessonsPayload(parseHybridPayload(await response.json()));
    expect(payload.total).toBe(0);
    expect(payload.results).toHaveLength(0);
    expect(runHybridSearch).not.toHaveBeenCalled();
  });

  it('returns an error payload when the fixtures query requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search?fixtures=error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        scope: LESSONS_SCOPE,
        text: 'fractions',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payloadJson: unknown = await response.json();
    const errorPayload = ensureObject(
      payloadJson,
      'Structured fixture error payload must be an object',
    );
    const errorCode = readOwnProperty(errorPayload, 'error');
    if (typeof errorCode !== 'string') {
      throw new Error('Structured search fixture error response is missing error code');
    }
    expect(errorCode).toBe('FIXTURE_ERROR');
    expect(runHybridSearch).not.toHaveBeenCalled();
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=error');
  });

  it('returns an error payload when the fixtures cookie requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'semantic-search-fixtures=error',
      },
      body: JSON.stringify({ scope: LESSONS_SCOPE, text: 'fractions' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payloadJson: unknown = await response.json();
    const errorPayload = ensureObject(
      payloadJson,
      'Structured fixture error payload must be an object',
    );
    const errorCode = readOwnProperty(errorPayload, 'error');
    if (typeof errorCode !== 'string') {
      throw new Error('Structured search fixture error response is missing error code');
    }
    expect(errorCode).toBe('FIXTURE_ERROR');
    expect(runHybridSearch).not.toHaveBeenCalled();
  });
});

type HybridResponsePayload =
  | SearchLessonsResponse
  | SearchUnitsResponse
  | SearchSequencesResponse
  | SearchMultiScopeResponse;

function expectLessonsPayload(payload: HybridResponsePayload): SearchLessonsResponse {
  if (payload.scope !== 'lessons') {
    throw new Error('Structured search payload did not resolve to lessons scope');
  }
  return payload;
}

function parseHybridPayload(value: unknown): HybridResponsePayload {
  const payloadObject = ensureObject(value, 'Hybrid response payload must be an object');
  const scope = readOwnProperty(payloadObject, 'scope');
  if (scope === 'all') {
    return SearchMultiScopeResponseSchema.parse(value);
  }
  if (scope === 'lessons') {
    return SearchLessonsResponseSchema.parse(value);
  }
  if (scope === 'units') {
    return SearchUnitsResponseSchema.parse(value);
  }
  if (scope === 'sequences') {
    return SearchSequencesResponseSchema.parse(value);
  }
  throw new Error('Received search payload with unsupported scope');
}

function ensureObject(value: unknown, errorMessage: string): object {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

function readOwnProperty(source: object, key: PropertyKey): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return descriptor?.value;
}
