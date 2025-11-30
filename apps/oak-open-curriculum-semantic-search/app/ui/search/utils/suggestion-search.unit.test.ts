import { describe, expect, it } from 'vitest';
import type {
  SearchStructuredRequest,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import { buildSuggestionFollowUpInput } from './suggestion-search';

describe('buildSuggestionFollowUpInput', () => {
  const base: SearchStructuredRequest = {
    scope: 'units',
    text: 'fractions',
    subject: 'maths',
    keyStage: 'ks2',
    minLessons: 5,
    size: 10,
    includeFacets: true,
    phaseSlug: 'maths-primary',
  };

  it('resolves suggestion payload with contextual overrides', () => {
    const suggestion: SearchSuggestionItem = {
      label: 'Decimals recap',
      scope: 'lessons',
      subject: 'maths',
      keyStage: 'ks3',
      url: '/lessons/decimals-recap',
      contexts: {},
    };

    const out = buildSuggestionFollowUpInput({ base, suggestion });

    expect(out).toStrictEqual({
      scope: 'lessons',
      text: 'Decimals recap',
      subject: 'maths',
      keyStage: 'ks3',
      minLessons: 5,
      size: 10,
      includeFacets: true,
      phaseSlug: undefined,
    });
  });

  it('preserves phase slug for sequence suggestions when available', () => {
    const suggestion: SearchSuggestionItem = {
      label: 'Fractions mastery',
      scope: 'sequences',
      url: '/sequences/fractions-mastery',
      contexts: { phaseSlug: 'maths-secondary' },
    };

    const out = buildSuggestionFollowUpInput({ base, suggestion });

    expect(out).toStrictEqual({
      scope: 'sequences',
      text: 'Fractions mastery',
      subject: 'maths',
      keyStage: 'ks2',
      minLessons: 5,
      size: 10,
      includeFacets: true,
      phaseSlug: 'maths-secondary',
    });
  });

  it('returns null when there is no base request', () => {
    const suggestion: SearchSuggestionItem = {
      label: 'Decimals recap',
      scope: 'lessons',
      url: '/lessons/decimals-recap',
      contexts: {},
    };

    expect(buildSuggestionFollowUpInput({ base: null, suggestion })).toBeNull();
  });
});
