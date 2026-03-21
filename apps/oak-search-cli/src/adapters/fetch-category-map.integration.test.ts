/**
 * Integration tests for fetchCategoryMapForSequences.
 *
 * @remarks
 * Tests the orchestration function that fetches category data from the API
 * for all sequences and merges into a single CategoryMap. Part of the F2 fix.
 *
 * Uses the narrow `CategoryFetchDeps` interface rather than the full
 * `OakClient`, keeping mocks minimal per ADR-078.
 */
import { describe, expect, it } from 'vitest';
import { unwrap, ok, type Ok } from '@oaknational/result';
import type { SequenceUnitsResponse } from '../types/oak';
import { fetchCategoryMapForSequences, type CategoryFetchDeps } from './category-supplementation';

/**
 * Creates a minimal success-only `CategoryFetchDeps` from a map of slug → response.
 * Only stubs the `getSequenceUnits` method that the function actually calls.
 * Error-path tests construct `CategoryFetchDeps` directly to inject error responses.
 */
function createCategoryFetchDeps(
  responses: Record<string, Ok<SequenceUnitsResponse>>,
): CategoryFetchDeps {
  return {
    getSequenceUnits: (slug: string) => {
      const response = responses[slug];
      if (response) {
        return Promise.resolve(response);
      }
      const empty: SequenceUnitsResponse = [];
      return Promise.resolve(ok(empty));
    },
  };
}

describe('fetchCategoryMapForSequences', () => {
  it('builds merged CategoryMap from multiple sequences', async () => {
    const deps = createCategoryFetchDeps({
      'maths-primary': ok([
        {
          year: 3,
          units: [
            {
              unitSlug: 'fractions-year-3',
              unitTitle: 'Fractions Year 3',
              unitOrder: 1,
              categories: [{ categoryTitle: 'Number', categorySlug: 'number' }],
            },
          ],
        },
      ]),
      'english-primary': ok([
        {
          year: 3,
          units: [
            {
              unitSlug: 'grammar-year-3',
              unitTitle: 'Grammar Year 3',
              unitOrder: 1,
              categories: [{ categoryTitle: 'Grammar', categorySlug: 'grammar' }],
            },
          ],
        },
      ]),
    });

    const result = await fetchCategoryMapForSequences(deps, ['maths-primary', 'english-primary']);
    const categoryMap = unwrap(result);

    expect(categoryMap.get('fractions-year-3')).toEqual([{ title: 'Number', slug: 'number' }]);
    expect(categoryMap.get('grammar-year-3')).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
  });

  it('returns Result.err when API call returns an error', async () => {
    const deps: CategoryFetchDeps = {
      getSequenceUnits: () =>
        Promise.resolve({
          ok: false as const,
          error: {
            kind: 'network_error',
            resource: 'maths-primary',
            cause: new Error('Connection refused'),
          },
        }),
    };

    const result = await fetchCategoryMapForSequences(deps, ['maths-primary']);

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.message).toContain('maths-primary');
  });

  it('returns empty map when no sequences are provided', async () => {
    const deps = createCategoryFetchDeps({});

    const result = await fetchCategoryMapForSequences(deps, []);
    const categoryMap = unwrap(result);

    expect(categoryMap.size).toBe(0);
  });
});
