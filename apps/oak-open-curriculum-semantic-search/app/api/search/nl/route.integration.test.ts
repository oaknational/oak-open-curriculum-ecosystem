import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSearchLessonsResponse,
  SearchLessonsResponseSchema,
  SearchStructuredRequestSchema,
  type SearchLessonsResponse,
  type SearchStructuredRequest,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
const LESSONS_SCOPE = 'lessons';

type ParsedIntent = typeof LESSONS_SCOPE;

type ParsedQuery = {
  intent: ParsedIntent;
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
};

const parseQuery = vi.hoisted(() => vi.fn<(input: string) => Promise<ParsedQuery>>());
const llmEnabled = vi.hoisted(() => vi.fn(() => true));
const suggestionCache = { version: 'fixture', ttlSeconds: 3600 } as const;
const naturalFixtures = {
  fixture: createSearchLessonsResponse({
    results: [
      {
        id: 'fixture-lesson-1',
        rankScore: 1,
        lesson: null,
        highlights: [],
      },
    ],
    total: 1,
    took: 0,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestions: [],
    suggestionCache,
  }),
  empty: createSearchLessonsResponse({
    results: [],
    total: 0,
    took: 0,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestions: [],
    suggestionCache,
  }),
};

vi.mock('../../../../src/lib/query-parser', () => ({
  parseQuery,
}));

vi.mock('../../../../src/lib/env', () => ({
  llmEnabled,
  optionalEnv: () => ({
    SEARCH_INDEX_VERSION: 'v-test-index',
  }),
}));

vi.mock('../../../lib/search-fixtures/builders', () => {
  return {
    buildSingleScopeFixture: () => naturalFixtures.fixture,
    buildEmptyFixture: () => naturalFixtures.empty,
  };
});

vi.mock('../../../../src/lib/search-scopes', () => ({
  LESSONS_SCOPE: 'lessons',
  UNITS_SCOPE: 'units',
}));

import { POST } from './route';

describe('POST /api/search/nl', () => {
  beforeEach(() => {
    parseQuery.mockResolvedValue({ intent: LESSONS_SCOPE, text: 'fractions' });
    llmEnabled.mockReturnValue(true);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns fixture results with a derived summary when fixtures query parameter is provided', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions about ks2 maths' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = parseNaturalResponse(payloadJson);

    expect(payload.summary.prompt).toBe('fractions about ks2 maths');
    expect(payload.summary.structured.scope).toBe(LESSONS_SCOPE);
    expect(payload.result.results.length).toBeGreaterThan(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an empty fixture with a derived summary when fixtures query parameter requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=empty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions for ks3' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payloadJson: unknown = await response.json();
    const payload = parseNaturalResponse(payloadJson);
    expect(payload.result.results).toHaveLength(0);
    expect(payload.summary.prompt).toBe('fractions for ks3');
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=empty');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns an error fixture when fixtures query parameter requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payloadJson: unknown = await response.json();
    const errorPayload = ensureObject(
      payloadJson,
      'Natural fixture error payload must be an object',
    );
    const errorCode = readOwnProperty(errorPayload, 'error');
    if (typeof errorCode !== 'string') {
      throw new Error('Natural search fixture error response is missing error code');
    }
    expect(errorCode).toBe('FIXTURE_ERROR');
    const messageValue = readOwnProperty(errorPayload, 'message');
    expect(typeof messageValue === 'string' ? messageValue : undefined).toBe(
      'Fixture mode requested an error response for natural-language search.',
    );
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=error');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns a fixture response when the LLM is disabled but fixture mode is requested', async () => {
    llmEnabled.mockReturnValue(false);
    const request = new NextRequest('http://localhost/api/search/nl?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'fractions about ks2 maths' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = parseNaturalResponse(await response.json());
    expect(payload.result.results.length).toBeGreaterThan(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
    expect(fetch).not.toHaveBeenCalled();
    expect(llmEnabled).toHaveBeenCalled();
  });

  it('forwards live requests, returning the derived summary alongside the structured response', async () => {
    const request = new NextRequest('http://localhost/api/search/nl', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: 'Plan primary fractions lessons with manipulatives' }),
    });

    const structuredResponse = createSearchLessonsResponse({
      results: [
        {
          id: 'lesson-1',
          rankScore: 1,
          lesson: null,
          highlights: [],
        },
      ],
      total: 1,
      took: 12,
      timedOut: false,
      aggregations: {},
      facets: null,
      suggestions: [],
      suggestionCache: { version: 'live', ttlSeconds: 3600 },
    });

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(structuredResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = parseNaturalResponse(await response.json());

    expect(payload.result).toMatchObject(structuredResponse);
    expect(payload.summary.prompt).toBe('Plan primary fractions lessons with manipulatives');
    expect(payload.summary.structured.text).toBe('fractions');
  });
});

function parseNaturalResponse(value: unknown): {
  result: SearchLessonsResponse;
  summary: { prompt: string; structured: SearchStructuredRequest };
} {
  const responseObject = ensureObject(value, 'Natural response payload must be an object');
  const result = SearchLessonsResponseSchema.parse(readOwnProperty(responseObject, 'result'));
  const summaryValue = readOwnProperty(responseObject, 'summary');
  const summaryObject = ensureObject(summaryValue, 'Natural response summary must be an object');
  const promptValue = readOwnProperty(summaryObject, 'prompt');
  if (typeof promptValue !== 'string' || promptValue.length === 0) {
    throw new Error('Natural response summary is missing prompt');
  }
  const structured = SearchStructuredRequestSchema.parse(
    readOwnProperty(summaryObject, 'structured'),
  );
  return { result, summary: { prompt: promptValue, structured } };
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
