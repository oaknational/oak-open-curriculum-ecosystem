/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Search fixture helpers derived from the Open Curriculum schema.
 */

import type { SearchSuggestionItem, SearchSuggestionResponse } from './suggestions.js';
import {
  DEFAULT_SUGGESTION_CACHE,
  SearchSuggestionItemSchema,
  SearchSuggestionResponseSchema,
} from './suggestions.js';
import {
  SearchLessonsResponseSchema,
  type SearchLessonResult,
  type SearchLessonsResponse,
} from './responses.lessons.js';
import { SearchUnitsResponseSchema, type SearchUnitResult, type SearchUnitsResponse } from './responses.units.js';
import {
  SearchSequencesResponseSchema,
  type SearchSequenceResult,
  type SearchSequencesResponse,
} from './responses.sequences.js';
import {
  SearchMultiScopeResponseSchema,
  type SearchMultiScopeBucket,
  type SearchMultiScopeResponse,
} from './responses.multi.js';

function assertValid<T>(schema: { parse: (value: unknown) => T }, value: unknown, label: string): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new Error('Invalid search fixture: ' + label, { cause: error });
  }
}

function normaliseSuggestions(value: SearchSuggestionItem[] | undefined): SearchSuggestionItem[] | undefined {
  if (!value) {
    return undefined;
  }
  return value.map((item) => assertValid(SearchSuggestionItemSchema, item, 'SearchSuggestionItem'));
}

function normaliseSuggestionCache(value: SearchSuggestionResponse['cache'] | undefined): SearchSuggestionResponse['cache'] {
  return assertValid(
    SearchSuggestionResponseSchema.shape.cache,
    value ?? DEFAULT_SUGGESTION_CACHE,
    'SearchSuggestionCache',
  );
}

/** Create a structured lessons response fixture with defaults and validation. */
export function createSearchLessonsResponse(
  overrides: Partial<Omit<SearchLessonsResponse, 'scope'>> = {},
): SearchLessonsResponse {
  const base: SearchLessonsResponse = {
    scope: 'lessons',
    results: [],
    total: 0,
    took: 0,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
    suggestions: undefined,
  };
  const candidate = {
    ...base,
    ...overrides,
    results: overrides.results ?? base.results,
    suggestions: normaliseSuggestions(overrides.suggestions),
    suggestionCache: normaliseSuggestionCache(overrides.suggestionCache),
  } satisfies SearchLessonsResponse;
  return assertValid(SearchLessonsResponseSchema, candidate, 'SearchLessonsResponse');
}

/** Create a structured units response fixture with defaults and validation. */
export function createSearchUnitsResponse(
  overrides: Partial<Omit<SearchUnitsResponse, 'scope'>> = {},
): SearchUnitsResponse {
  const base: SearchUnitsResponse = {
    scope: 'units',
    results: [],
    total: 0,
    took: 0,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
    suggestions: undefined,
  };
  const candidate = {
    ...base,
    ...overrides,
    results: overrides.results ?? base.results,
    suggestions: normaliseSuggestions(overrides.suggestions),
    suggestionCache: normaliseSuggestionCache(overrides.suggestionCache),
  } satisfies SearchUnitsResponse;
  return assertValid(SearchUnitsResponseSchema, candidate, 'SearchUnitsResponse');
}

/** Create a structured sequences response fixture with defaults and validation. */
export function createSearchSequencesResponse(
  overrides: Partial<Omit<SearchSequencesResponse, 'scope'>> = {},
): SearchSequencesResponse {
  const base: SearchSequencesResponse = {
    scope: 'sequences',
    results: [],
    total: 0,
    took: 0,
    timedOut: false,
    aggregations: {},
    facets: null,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
    suggestions: undefined,
  };
  const candidate = {
    ...base,
    ...overrides,
    results: overrides.results ?? base.results,
    suggestions: normaliseSuggestions(overrides.suggestions),
    suggestionCache: normaliseSuggestionCache(overrides.suggestionCache),
  } satisfies SearchSequencesResponse;
  return assertValid(SearchSequencesResponseSchema, candidate, 'SearchSequencesResponse');
}

/** Create a multi-scope response fixture with defaults and validation. */
export function createSearchMultiScopeResponse(
  overrides: Partial<Omit<SearchMultiScopeResponse, 'scope'>> = {},
): SearchMultiScopeResponse {
  const base: SearchMultiScopeResponse = {
    scope: 'all',
    buckets: [],
    suggestions: undefined,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  };
  const candidate = {
    ...base,
    ...overrides,
    buckets: overrides.buckets ?? base.buckets,
    suggestions: normaliseSuggestions(overrides.suggestions),
    suggestionCache: normaliseSuggestionCache(overrides.suggestionCache),
  } satisfies SearchMultiScopeResponse;
  return assertValid(SearchMultiScopeResponseSchema, candidate, 'SearchMultiScopeResponse');
}

export type {
  SearchLessonResult,
  SearchLessonsResponse,
  SearchUnitResult,
  SearchUnitsResponse,
  SearchSequenceResult,
  SearchSequencesResponse,
  SearchMultiScopeBucket,
  SearchMultiScopeResponse,
};
