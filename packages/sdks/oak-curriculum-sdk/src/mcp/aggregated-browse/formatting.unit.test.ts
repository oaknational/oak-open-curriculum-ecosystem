/**
 * Unit tests for browse-curriculum result formatting.
 *
 * Tests that buildBrowseSummary produces appropriate human-readable
 * summaries for facet data with various filter combinations.
 */

import { describe, it, expect } from 'vitest';
import { buildBrowseSummary } from './formatting.js';
import type { SearchFacets, SequenceFacet } from '../../types/generated/search/facets.js';

/**
 * Creates a minimal valid SequenceFacet for testing.
 * Only the fields used by buildBrowseSummary matter for these tests,
 * but we provide all required fields to satisfy the generated type.
 */
function createFacet(overrides: Partial<SequenceFacet> = {}): SequenceFacet {
  return {
    subjectSlug: 'maths',
    sequenceSlug: 'maths-primary-ks1',
    keyStage: 'ks1',
    phaseSlug: 'primary',
    phaseTitle: 'Primary',
    years: ['1'],
    units: [],
    unitCount: 0,
    lessonCount: 0,
    hasKs4Options: false,
    ...overrides,
  };
}

/** Creates a SearchFacets with the given number of sequences. */
function createFacets(count: number, overrides: Partial<SequenceFacet> = {}): SearchFacets {
  return {
    sequences: Array.from({ length: count }, () => createFacet(overrides)),
  };
}

describe('buildBrowseSummary', () => {
  it('summarises multiple sequences with no filters', () => {
    const facets = createFacets(3);

    const result = buildBrowseSummary(facets, {});

    expect(result).toBe('Found 3 curriculum programmes');
  });

  it('includes subject filter in summary', () => {
    const facets = createFacets(2, { subjectSlug: 'maths' });

    const result = buildBrowseSummary(facets, { subject: 'maths' });

    expect(result).toBe('Found 2 curriculum programmes for maths');
  });

  it('includes keyStage filter in summary (uppercased)', () => {
    const facets = createFacets(1, { subjectSlug: 'science', keyStage: 'ks3' });

    const result = buildBrowseSummary(facets, { keyStage: 'ks3' });

    expect(result).toBe('Found 1 curriculum programme for KS3');
  });

  it('includes both subject and keyStage filters in summary', () => {
    const facets = createFacets(5, { subjectSlug: 'maths', keyStage: 'ks2' });

    const result = buildBrowseSummary(facets, { subject: 'maths', keyStage: 'ks2' });

    expect(result).toBe('Found 5 curriculum programmes for maths KS2');
  });

  it('returns empty-result message with no filters', () => {
    const facets: SearchFacets = { sequences: [] };

    const result = buildBrowseSummary(facets, {});

    expect(result).toBe(
      'No curriculum programmes found. Try broader filters or no filters to see everything.',
    );
  });

  it('returns empty-result message with filters', () => {
    const facets: SearchFacets = { sequences: [] };

    const result = buildBrowseSummary(facets, { subject: 'science' });

    expect(result).toBe(
      'No curriculum programmes found for science. Try broader filters or no filters to see everything.',
    );
  });

  it('uses singular "programme" for exactly 1 sequence', () => {
    const facets = createFacets(1, { subjectSlug: 'history' });

    const result = buildBrowseSummary(facets, {});

    expect(result).toBe('Found 1 curriculum programme');
  });
});
