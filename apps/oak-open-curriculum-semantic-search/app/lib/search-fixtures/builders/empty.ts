import {
  buildSingleScopeFixture,
  type SingleScopeDatasetKey,
  type SingleScopeFixture,
} from './single-scope';
import { buildSequenceFixture, buildUnitFixture, buildMultiScopeFixture } from './multi-scope';
import {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  type SearchUnitsResponse,
  type SearchSequencesResponse,
  type SearchMultiScopeResponse,
  type SearchMultiScopeBucket,
} from '@oaknational/oak-curriculum-sdk';

export type FixtureScope = 'lessons' | 'units' | 'sequences';

export interface BuildEmptyFixtureOptions {
  readonly scope: FixtureScope;
  readonly dataset?: SingleScopeDatasetKey;
}

const DEFAULT_DATASET: Record<FixtureScope, SingleScopeDatasetKey> = {
  lessons: 'ks2-maths',
  units: 'ks4-maths',
  sequences: 'ks3-history',
};

export function buildEmptyFixture({
  scope,
  dataset,
}: BuildEmptyFixtureOptions): SingleScopeFixture | SearchUnitsResponse | SearchSequencesResponse {
  const resolvedDataset = dataset ?? DEFAULT_DATASET[scope];

  if (scope === 'lessons') {
    const base = buildSingleScopeFixture({ dataset: resolvedDataset });
    return {
      ...base,
      results: [],
      total: 0,
      timedOut: false,
    };
  }

  if (scope === 'units') {
    const base = buildUnitFixture(resolvedDataset);
    return {
      ...base,
      results: [],
      total: 0,
      timedOut: false,
    };
  }

  const base = buildSequenceFixture(resolvedDataset);
  return {
    ...base,
    results: [],
    total: 0,
    timedOut: false,
  };
}

export function buildEmptyMultiScopeFixture(): SearchMultiScopeResponse {
  const base = buildMultiScopeFixture();
  const buckets = base.buckets.map(clearBucketResults);
  return {
    ...base,
    buckets,
  } satisfies SearchMultiScopeResponse;
}

function clearBucketResults(bucket: SearchMultiScopeBucket): SearchMultiScopeBucket {
  const { result } = bucket;
  if (bucket.scope === 'lessons') {
    return {
      ...bucket,
      result: createSearchLessonsResponse({
        results: [],
        total: 0,
        took: result.took,
        timedOut: false,
        aggregations: result.aggregations,
        facets: result.facets,
        suggestions: result.suggestions ?? [],
        suggestionCache: result.suggestionCache,
      }),
    } satisfies SearchMultiScopeBucket;
  }

  if (bucket.scope === 'units') {
    return {
      ...bucket,
      result: createSearchUnitsResponse({
        results: [],
        total: 0,
        took: result.took,
        timedOut: false,
        aggregations: result.aggregations,
        facets: result.facets,
        suggestions: result.suggestions,
        suggestionCache: result.suggestionCache,
      }),
    } satisfies SearchMultiScopeBucket;
  }

  return {
    ...bucket,
    result: createSearchSequencesResponse({
      results: [],
      total: 0,
      took: result.took,
      timedOut: false,
      aggregations: result.aggregations,
      facets: result.facets,
      suggestions: result.suggestions,
      suggestionCache: result.suggestionCache,
    }),
  } satisfies SearchMultiScopeBucket;
}
