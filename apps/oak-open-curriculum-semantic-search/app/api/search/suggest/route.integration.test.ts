import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SuggestQuery } from '../../../../src/lib/suggestions/types';
import {
  SearchSuggestionResponseSchema,
  type SearchSuggestionResponse,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import { LESSONS_SCOPE } from '../../../../src/lib/search-scopes';

const runSuggestions = vi.hoisted(() =>
  vi.fn<(query: SuggestQuery) => Promise<SearchSuggestionResponse>>(),
);

vi.mock('next/cache', () => ({
  unstable_cache: <TFn extends (...args: unknown[]) => Promise<unknown>>(fn: TFn) => fn,
}));

vi.mock('../../../../src/lib/suggestions', () => ({
  runSuggestions,
}));

import { POST } from './route';

describe('POST /api/search/suggest', () => {
  beforeEach(() => {
    runSuggestions.mockReset();
    process.env.SEARCH_INDEX_VERSION = 'v-test-index';
  });

  it('returns suggestions for valid payloads and normalises filters', async () => {
    runSuggestions.mockResolvedValueOnce({
      suggestions: [
        {
          label: 'Mountains and glaciation',
          scope: LESSONS_SCOPE,
          subject: 'geography',
          keyStage: 'ks4',
          url: 'https://example.com/mount',
          contexts: {},
        },
      ],
      cache: { version: 'v-test-index', ttlSeconds: 60 },
    });

    const request = new NextRequest('http://localhost/api/search/suggest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prefix: 'mount',
        scope: LESSONS_SCOPE,
        subject: 'geography',
        keyStage: 'ks4',
        limit: 8,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = SearchSuggestionResponseSchema.parse(await response.json());
    expect(payload.suggestions).toHaveLength(1);
    expect(runSuggestions).toHaveBeenCalledWith({
      prefix: 'mount',
      scope: LESSONS_SCOPE,
      subject: 'geography',
      keyStage: 'ks4',
      limit: 8,
    });
  });

  it('rejects invalid payloads with 400', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefix: '', scope: 'unknown' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(runSuggestions).not.toHaveBeenCalled();
  });

  it('returns fixture suggestions when fixtures query parameter is set', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest?fixtures=on', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefix: 'math', scope: LESSONS_SCOPE, limit: 5 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = SearchSuggestionResponseSchema.parse(await response.json());
    expect(payload.suggestions.length).toBeGreaterThan(0);
    for (const suggestion of payload.suggestions) {
      expect(suggestion.scope).toBe(LESSONS_SCOPE);
    }
    expect(runSuggestions).not.toHaveBeenCalled();
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=on');
  });

  it('returns fixture suggestions when the fixtures cookie is set', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'semantic-search-fixtures=on',
      },
      body: JSON.stringify({ prefix: 'math', scope: LESSONS_SCOPE, limit: 5 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = SearchSuggestionResponseSchema.parse(await response.json());
    expect(payload.suggestions.length).toBeGreaterThan(0);
    expect(runSuggestions).not.toHaveBeenCalled();
  });

  it('returns empty suggestions when fixtures query parameter requests empty mode', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest?fixtures=empty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefix: 'math', scope: LESSONS_SCOPE, limit: 5 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = SearchSuggestionResponseSchema.parse(await response.json());
    expect(payload.suggestions).toHaveLength(0);
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=empty');
    expect(runSuggestions).not.toHaveBeenCalled();
  });

  it('returns an error payload when fixtures query parameter requests error mode', async () => {
    const request = new NextRequest('http://localhost/api/search/suggest?fixtures=error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prefix: 'math', scope: LESSONS_SCOPE, limit: 5 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const payloadJson: unknown = await response.json();
    const errorPayload = ensureObject(
      payloadJson,
      'Suggestion fixture error payload must be an object',
    );
    const errorCode = readOwnProperty(errorPayload, 'error');
    if (typeof errorCode !== 'string') {
      throw new Error('Suggestion fixture error response is missing error code');
    }
    expect(errorCode).toBe('FIXTURE_ERROR');
    const cookieHeader = response.headers.get('set-cookie') ?? '';
    expect(cookieHeader).toContain('semantic-search-fixtures=error');
    expect(runSuggestions).not.toHaveBeenCalled();
  });
});

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
