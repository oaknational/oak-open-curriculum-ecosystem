import {
  buildSingleScopeFixture,
  type BuildSingleScopeFixtureOptions,
  type SingleScopeFixture,
} from './single-scope';
import { buildMultiScopeFixture, type BuildMultiScopeFixtureOptions } from './multi-scope';
import {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
  type SearchLessonsResponse,
  type SearchMultiScopeResponse,
  type SearchUnitsResponse,
  type SearchSequencesResponse,
  type SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk';

export type TimedOutSingleScopeFixture = SingleScopeFixture & { readonly timedOut: true };
export type TimedOutMultiScopeFixture = SearchMultiScopeResponse & {
  readonly suggestions: readonly SearchSuggestionItem[];
  readonly suggestionCache?: { version: string; ttlSeconds: number };
};

export function buildTimedOutSingleScopeFixture(
  options: BuildSingleScopeFixtureOptions = {},
): TimedOutSingleScopeFixture {
  const base = buildSingleScopeFixture(options);
  const fixture = createSearchLessonsResponse({
    results: base.results,
    total: base.total,
    took: base.took,
    timedOut: true,
    aggregations: base.aggregations,
    facets: base.facets,
    suggestions: base.suggestions,
    suggestionCache: base.suggestionCache,
  });

  return {
    ...fixture,
    timedOut: true as const,
    suggestions: fixture.suggestions ?? [],
    suggestionCache: fixture.suggestionCache,
  } satisfies TimedOutSingleScopeFixture;
}

export function buildTimedOutMultiScopeFixture(
  options: BuildMultiScopeFixtureOptions = {},
): TimedOutMultiScopeFixture {
  const base = buildMultiScopeFixture(options);
  const buckets = base.buckets.map((bucket) => ({
    scope: bucket.scope,
    result: buildTimedOutBucket(bucket.result),
  }));
  const response = createSearchMultiScopeResponse({
    buckets,
    suggestions: base.suggestions,
    suggestionCache: base.suggestionCache,
  });

  const suggestions = response.suggestions ?? [];

  return {
    ...response,
    suggestions,
    suggestionCache: response.suggestionCache,
  } satisfies TimedOutMultiScopeFixture;
}

function buildTimedOutBucket(
  result: SearchLessonsResponse | SearchUnitsResponse | SearchSequencesResponse,
): SearchLessonsResponse | SearchUnitsResponse | SearchSequencesResponse {
  if (result.scope === 'lessons') {
    return createSearchLessonsResponse({
      results: result.results,
      total: result.total,
      took: result.took,
      timedOut: true,
      aggregations: result.aggregations,
      facets: result.facets,
      suggestions: result.suggestions ?? [],
      suggestionCache: result.suggestionCache,
    });
  }

  if (result.scope === 'units') {
    return createSearchUnitsResponse({
      results: result.results,
      total: result.total,
      took: result.took,
      timedOut: true,
      aggregations: result.aggregations,
      facets: result.facets,
      suggestions: result.suggestions,
      suggestionCache: result.suggestionCache,
    });
  }

  return createSearchSequencesResponse({
    results: result.results,
    total: result.total,
    took: result.took,
    timedOut: true,
    aggregations: result.aggregations,
    facets: result.facets,
    suggestions: result.suggestions,
    suggestionCache: result.suggestionCache,
  });
}
