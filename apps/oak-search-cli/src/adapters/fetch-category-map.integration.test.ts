/**
 * Integration tests for fetchCategoryMapForSequences.
 *
 * @remarks
 * Tests the orchestration function that fetches category data from the API
 * for all sequences and merges into a single CategoryMap. Part of the F2 fix.
 */
import { describe, expect, it, vi } from 'vitest';
import type { OakClient } from './oak-adapter';
import { fetchCategoryMapForSequences } from './category-supplementation';

function createMockClient(
  sequenceUnitsResponses: Record<string, { ok: true; value: unknown }>,
): OakClient {
  return {
    getSubjectSequences: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getSequenceUnits: vi.fn().mockImplementation((slug: string) => {
      const response = sequenceUnitsResponses[slug];
      if (response) {
        return Promise.resolve(response);
      }
      return Promise.resolve({ ok: true, value: [] });
    }),
    getUnitsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonTranscript: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getLessonsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getUnitSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getAllThreads: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getThreadUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getSubjectAssets: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    rateLimitTracker: {
      getStatus: () => ({
        limit: 1000,
        remaining: 1000,
        reset: Date.now(),
        resetDate: new Date(),
        lastChecked: new Date(),
      }),
      getRequestCount: () => 0,
      getRequestRate: () => 0,
      reset: vi.fn(),
    },
    getCacheStats: vi.fn().mockReturnValue({ hits: 0, misses: 0, connected: false }),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
}

describe('fetchCategoryMapForSequences', () => {
  it('builds merged CategoryMap from multiple sequences', async () => {
    const client = createMockClient({
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

    const categoryMap = await fetchCategoryMapForSequences(client, [
      'maths-primary',
      'english-primary',
    ]);

    expect(categoryMap.get('fractions-year-3')).toEqual([{ title: 'Number', slug: 'number' }]);
    expect(categoryMap.get('grammar-year-3')).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
  });

  it('fails fast when API call returns an error', async () => {
    const client = createMockClient({});
    vi.mocked(client.getSequenceUnits).mockResolvedValue({
      ok: false,
      error: {
        kind: 'network_error',
        resource: 'maths-primary',
        cause: new Error('Connection refused'),
      },
    });

    await expect(fetchCategoryMapForSequences(client, ['maths-primary'])).rejects.toThrow(
      'maths-primary',
    );
  });

  it('returns empty map when no sequences are provided', async () => {
    const client = createMockClient({});

    const categoryMap = await fetchCategoryMapForSequences(client, []);

    expect(categoryMap.size).toBe(0);
  });
});
