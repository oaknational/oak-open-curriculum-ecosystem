import { describe, expect, it } from 'vitest';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/sdk-codegen/search';

import type { EsSearchResponse } from '../internal/types.js';
import { fetchSequenceFacets } from './sequence-facets.js';

const resolveIndex = () => 'oak_sequence_facets_test';

function baseResponse(
  doc: SearchSequenceFacetsIndexDoc,
): EsSearchResponse<SearchSequenceFacetsIndexDoc> {
  return {
    hits: {
      total: { value: 1, relation: 'eq' },
      max_score: null,
      hits: [{ _index: 'oak_sequence_facets_test', _id: 'seq-1', _score: null, _source: doc }],
    },
    took: 1,
    timed_out: false,
  };
}

function createFacetDoc(
  overrides?: Partial<SearchSequenceFacetsIndexDoc>,
): SearchSequenceFacetsIndexDoc {
  return {
    sequence_slug: 'maths-secondary',
    subject_slug: 'maths',
    phase_slug: 'secondary',
    phase_title: 'Secondary',
    key_stages: ['ks4'],
    key_stage_title: 'Key Stage 4',
    years: ['10', '11'],
    unit_slugs: ['forces-1', 'forces-2'],
    unit_titles: ['Forces 1', 'Forces 2'],
    unit_count: 2,
    lesson_count: 20,
    has_ks4_options: true,
    sequence_canonical_url: 'https://example.com/sequences/maths-secondary',
    ...overrides,
  };
}

describe('fetchSequenceFacets', () => {
  it('returns mapped sequence facets on success', async () => {
    const response = baseResponse(createFacetDoc());
    const search = () => Promise.resolve(response);

    const result = await fetchSequenceFacets(undefined, search, resolveIndex);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sequences).toHaveLength(1);
      expect(result.value.sequences[0]?.subjectSlug).toBe('maths');
      expect(result.value.sequences[0]?.sequenceSlug).toBe('maths-secondary');
      expect(result.value.sequences[0]?.keyStage).toBe('ks4');
      expect(result.value.sequences[0]?.units).toEqual([
        { unitSlug: 'forces-1', unitTitle: 'Forces 1' },
        { unitSlug: 'forces-2', unitTitle: 'Forces 2' },
      ]);
    }
  });

  it('returns validation_error when unit title and slug lengths differ', async () => {
    const response = baseResponse(
      createFacetDoc({
        unit_slugs: ['forces-1', 'forces-2'],
        unit_titles: ['Forces 1'],
      }),
    );
    const search = () => Promise.resolve(response);

    const result = await fetchSequenceFacets(undefined, search, resolveIndex);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('unit_titles length (1)');
      expect(result.error.message).toContain('unit_slugs length (2)');
    }
  });

  it('returns validation_error when key_stages is empty', async () => {
    const response = baseResponse(
      createFacetDoc({
        key_stages: [],
      }),
    );
    const search = () => Promise.resolve(response);

    const result = await fetchSequenceFacets(undefined, search, resolveIndex);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('Invalid key stage array');
    }
  });

  it('returns timeout error type when search throws timeout', async () => {
    const search = () => {
      const timeoutError = new Error('request timed out');
      timeoutError.name = 'TimeoutError';
      return Promise.reject(timeoutError);
    };

    const result = await fetchSequenceFacets(undefined, search, resolveIndex);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('timeout');
    }
  });
});
