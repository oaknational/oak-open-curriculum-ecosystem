/**
 * @fileoverview Unit tests for search-service helpers.
 *
 * Tests focus on pure function behaviour. Tests that previously used vi.doMock
 * or vi.stubGlobal were removed as they violate the testing strategy:
 * - No vi.doMock (manipulates module cache, causes race conditions)
 * - No vi.stubGlobal (mutates global objects)
 *
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';

import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';

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
