import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk';

vi.mock('../../lib/search-fixtures/builders', () => ({
  buildFixtureForScope: vi.fn((scope: unknown) => ({ scope, kind: 'fixture' })),
  buildEmptyFixture: vi.fn(({ scope }: { scope: unknown }) => ({ scope, empty: true })),
  buildEmptyMultiScopeFixture: vi.fn(() => ({ scope: 'multiscope', empty: true })),
}));

vi.mock('../../../src/lib/observability/zero-hit', () => ({
  logZeroHit: vi.fn().mockResolvedValue(undefined),
}));

describe('search-service helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../ui/search/structured/structured-search.shared');
    vi.unstubAllGlobals();
  });

  it('parses search requests when the UI alias module is unavailable', async () => {
    vi.doMock('../../ui/search/structured/structured-search.shared', () => ({
      SearchRequest: {
        safeParse: () => {
          throw new Error('structured alias invoked');
        },
      },
      SuggestionResponseSchema: {
        safeParse: vi.fn(),
      },
    }));

    const { parseSearchRequest } = await import('./search-service');

    expect(() =>
      parseSearchRequest({ scope: 'lessons', text: 'fractions', includeFacets: true }),
    ).not.toThrow();
  });

  it('parses suggestion responses without relying on the UI alias schema', async () => {
    const originalFetch = globalThis.fetch;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          suggestions: [
            {
              label: 'Fractions',
              scope: 'lessons',
              subject: 'maths',
              keyStage: 'ks2',
              url: '/fixtures/fractions',
            },
          ],
          cache: { version: 'v1', ttlSeconds: 30 },
        }),
      })) as unknown as typeof fetch,
    );

    vi.doMock('../../ui/search/structured/structured-search.shared', () => ({
      SearchRequest: {
        safeParse: vi.fn((payload: unknown) => ({ success: true, data: payload })),
      },
      SuggestionResponseSchema: {
        safeParse: () => {
          throw new Error('suggestion alias invoked');
        },
      },
    }));

    const { fetchAllScopeSuggestions } = await import('./search-service');

    const suggestions = await fetchAllScopeSuggestions(
      { url: 'http://localhost/api/search' } as never,
      { text: 'fr', scope: 'lessons', includeFacets: true } as never,
      {
        scope: 'lessons',
        text: 'fr',
        includeFacets: true,
      } as never,
    );

    expect(suggestions).toEqual([
      {
        label: 'Fractions',
        scope: 'lessons',
        subject: 'maths',
        keyStage: 'ks2',
        url: '/fixtures/fractions',
        contexts: {},
      },
    ]);

    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      delete (globalThis as { fetch?: typeof fetch }).fetch;
    }
  });

  it('normalises structured query fields', async () => {
    const { buildStructuredQuery } = await import('./search-service');
    const query = buildStructuredQuery({
      scope: 'lessons',
      text: 'fractions',
      subject: 'maths',
      keyStage: 'ks2',
      minLessons: 5,
      size: 20,
      includeFacets: true,
    } as SearchStructuredRequest);

    expect(query.scope).toBe('lessons');
    expect(query.text).toBe('fractions');
    expect(query.includeFacets).toBe(true);
  });

  it('builds fixture payloads for fixture modes', async () => {
    const { buildFixtureResponse } = await import('./fixture-responses');
    const fixture = buildFixtureResponse(
      { scope: 'lessons', text: '', includeFacets: true } as SearchStructuredRequest,
      'fixtures',
    );
    const emptyFixture = buildFixtureResponse(
      { scope: 'units', text: '', includeFacets: true } as SearchStructuredRequest,
      'fixtures-empty',
    );

    expect(fixture).toMatchObject({ scope: 'lessons', kind: 'fixture' });
    expect(emptyFixture).toMatchObject({ scope: 'units', empty: true });
  });

  it('builds empty fixtures for multiscope requests', async () => {
    const { buildEmptyFixtureForScope } = await import('./fixture-responses');
    const fixture = buildEmptyFixtureForScope('all');

    expect(fixture).toMatchObject({ scope: 'multiscope', empty: true });
  });

  it('derives multiscope input without scope', async () => {
    const { buildMultiScopeInput } = await import('./search-service');
    const input = buildMultiScopeInput({
      scope: 'lessons',
      text: 'query',
      includeFacets: true,
    });

    expect(input).toEqual({ text: 'query', includeFacets: true });
  });

  it('identifies multi-scope payloads via scope', async () => {
    const { isMultiScopePayload } = await import('./fixture-responses');
    expect(
      isMultiScopePayload({
        scope: 'all',
        buckets: [],
        suggestionCache: { version: 'v1' },
      } as never),
    ).toBe(true);
    expect(isMultiScopePayload({ scope: 'lessons', total: 0 } as never)).toBe(false);
  });
});
