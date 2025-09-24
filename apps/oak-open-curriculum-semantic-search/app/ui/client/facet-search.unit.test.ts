import { describe, expect, it } from 'vitest';
import type { StructuredBody } from '../structured-search.shared';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import { buildFacetFollowUpInput } from './facet-search';

describe('buildFacetFollowUpInput', () => {
  it('returns rescope input when base request exists', () => {
    const base: StructuredBody = {
      scope: 'units',
      text: 'fractions',
      subject: 'maths',
      keyStage: 'ks2',
      minLessons: 5,
      size: 20,
      includeFacets: true,
    };

    const facet: SequenceFacet = {
      subjectSlug: 'maths',
      sequenceSlug: 'fractions-programme',
      keyStage: 'ks2',
      keyStageTitle: 'Key stage 2',
      phaseSlug: 'maths-primary',
      phaseTitle: 'Mathematics primary',
      years: ['4'],
      units: [{ unitSlug: 'unit-1', unitTitle: 'Unit 1' }],
      unitCount: 12,
      lessonCount: 60,
      hasKs4Options: false,
      sequenceUrl: 'https://oak.example/fractions-programme',
    };

    const out = buildFacetFollowUpInput({ base, facet });

    expect(out).toStrictEqual({
      scope: 'sequences',
      text: 'fractions',
      subject: 'maths',
      keyStage: 'ks2',
      minLessons: 5,
      size: 20,
      includeFacets: true,
      phaseSlug: 'maths-primary',
    });
  });

  it('returns null when base input is missing', () => {
    const facet: SequenceFacet = {
      subjectSlug: 'maths',
      sequenceSlug: 'fractions-programme',
      keyStage: 'ks2',
      phaseSlug: 'maths-primary',
      phaseTitle: 'Mathematics primary',
      years: [],
      units: [],
      unitCount: 0,
      lessonCount: 0,
      hasKs4Options: false,
    };

    expect(buildFacetFollowUpInput({ base: null, facet })).toBeNull();
  });
});
