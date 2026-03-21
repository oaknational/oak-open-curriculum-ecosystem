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
import { fetchCategoryMapForSequences, type CategoryFetchDeps } from './category-supplementation';

/**
 * Creates a minimal `CategoryFetchDeps` from a map of slug → response.
 * Only stubs the `getSequenceUnits` method that the function actually calls.
 */
function createCategoryFetchDeps(
  responses: Record<string, { readonly ok: true; readonly value: unknown }>,
): CategoryFetchDeps {
  return {
    getSequenceUnits: (slug: string) => {
      const response = responses[slug];
      if (response) {
        return Promise.resolve(response);
      }
      return Promise.resolve({ ok: true as const, value: [] });
    },
  };
}

describe('fetchCategoryMapForSequences', () => {
  it('builds merged CategoryMap from multiple sequences', async () => {
    const deps = createCategoryFetchDeps({
      'maths-primary': {
        ok: true,
        value: [
          {
            year: 3,
            units: [
              {
                unitSlug: 'fractions-year-3',
                unitTitle: 'Fractions Year 3',
                categories: [{ categoryTitle: 'Number', categorySlug: 'number' }],
              },
            ],
          },
        ],
      },
      'english-primary': {
        ok: true,
        value: [
          {
            year: 3,
            units: [
              {
                unitSlug: 'grammar-year-3',
                unitTitle: 'Grammar Year 3',
                categories: [{ categoryTitle: 'Grammar', categorySlug: 'grammar' }],
              },
            ],
          },
        ],
      },
    });

    const categoryMap = await fetchCategoryMapForSequences(deps, [
      'maths-primary',
      'english-primary',
    ]);

    expect(categoryMap.get('fractions-year-3')).toEqual([{ title: 'Number', slug: 'number' }]);
    expect(categoryMap.get('grammar-year-3')).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
  });

  it('fails fast when API call returns an error', async () => {
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

    await expect(fetchCategoryMapForSequences(deps, ['maths-primary'])).rejects.toThrow(
      'maths-primary',
    );
  });

  it('returns empty map when no sequences are provided', async () => {
    const deps = createCategoryFetchDeps({});

    const categoryMap = await fetchCategoryMapForSequences(deps, []);

    expect(categoryMap.size).toBe(0);
  });
});
