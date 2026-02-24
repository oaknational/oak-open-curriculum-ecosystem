import { describe, expect, it } from 'vitest';
import {
  validateSearchResponse,
  validateSearchSuggestionResponse,
} from './search-response-validators';
import {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
  SearchSuggestionResponseSchema,
} from '@oaknational/curriculum-sdk-generation/search';

describe('validateSearchResponse', () => {
  it('validates lesson responses', () => {
    expect(validateSearchResponse('lessons', createSearchLessonsResponse()).ok).toBe(true);
  });

  it('validates unit responses', () => {
    expect(validateSearchResponse('units', createSearchUnitsResponse()).ok).toBe(true);
  });

  it('validates sequence responses', () => {
    expect(validateSearchResponse('sequences', createSearchSequencesResponse()).ok).toBe(true);
  });

  it('validates multi-scope responses', () => {
    expect(validateSearchResponse('all', createSearchMultiScopeResponse()).ok).toBe(true);
  });

  it('returns validation errors for invalid payloads', () => {
    expect(validateSearchResponse('lessons', { invalid: true }).ok).toBe(false);
  });
});

describe('validateSearchSuggestionResponse', () => {
  it('validates suggestion responses', () => {
    expect(
      validateSearchSuggestionResponse(
        SearchSuggestionResponseSchema.parse({
          suggestions: [],
          cache: { version: 'test-cache', ttlSeconds: 60 },
        }),
      ).ok,
    ).toBe(true);
  });

  it('returns validation errors for invalid suggestion payloads', () => {
    expect(validateSearchSuggestionResponse({ suggestions: {} }).ok).toBe(false);
  });
});
