import type {
  HybridResponse,
  MultiScopeHybridResponse,
  SuggestionItem,
  SuggestionCache,
} from '../../structured-search.shared';
import { DEFAULT_SUGGESTION_CACHE } from '../../structured-search.shared';
import {
  buildSingleScopeFixture,
  type SingleScopeDatasetKey,
  type SingleScopeFixture,
} from './single-scope';
import {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
  type SearchMultiScopeResponse,
  type SearchMultiScopeBucket,
  SearchSuggestionResponseSchema,
} from '@oaknational/oak-curriculum-sdk';
import { buildSequenceFixture, buildUnitFixture } from './multi-scope-scopes';

// Type helpers ----------------------------------------------------------------

type BucketScope = 'lessons' | 'units' | 'sequences';
type HybridForScope<S extends BucketScope> = Extract<HybridResponse, { scope: S }>;

type BucketOverride = Partial<
  Pick<HybridResponse, 'total' | 'took' | 'timedOut' | 'aggregations' | 'facets'>
>;

type BucketOverrideMap = Partial<Record<BucketScope, BucketOverride>>;

type SequenceDatasetKey = SingleScopeDatasetKey;

export interface BuildMultiScopeFixtureOptions {
  readonly lessonsDataset?: SingleScopeDatasetKey;
  readonly unitsDataset?: SingleScopeDatasetKey;
  readonly sequencesDataset?: SequenceDatasetKey;
  readonly overrides?: {
    readonly suggestions?: SuggestionItem[];
    readonly buckets?: BucketOverrideMap;
    readonly suggestionCache?: SuggestionCache;
  };
}

export { buildUnitFixture, buildSequenceFixture } from './multi-scope-scopes';

export function buildMultiScopeFixture(
  options: BuildMultiScopeFixtureOptions = {},
): MultiScopeHybridResponse & {
  suggestions: SuggestionItem[];
  suggestionCache: SuggestionCache;
} {
  const response = createSearchMultiScopeResponse(createResponseInput(options));
  return finalizeMultiScopeFixture(response);
}

// Helpers ---------------------------------------------------------------------

function assembleBuckets(params: {
  readonly lessonBucket: SingleScopeFixture;
  readonly unitsDataset: SingleScopeDatasetKey;
  readonly sequencesDataset: SingleScopeDatasetKey;
  readonly overrides?: BucketOverrideMap;
}): SearchMultiScopeBucket[] {
  const unitBucket = buildUnitFixture(params.unitsDataset);
  const sequenceBucket = buildSequenceFixture(params.sequencesDataset);
  return [
    createLessonBucket(params.lessonBucket, params.overrides?.lessons),
    createUnitBucket(unitBucket, params.overrides?.units),
    createSequenceBucket(sequenceBucket, params.overrides?.sequences),
  ];
}

function createLessonBucket(
  result: HybridForScope<'lessons'>,
  override?: BucketOverride,
): SearchMultiScopeBucket {
  return {
    scope: 'lessons',
    result: applyLessonOverrides(result, override),
  } satisfies SearchMultiScopeBucket;
}

function createUnitBucket(
  result: HybridForScope<'units'>,
  override?: BucketOverride,
): SearchMultiScopeBucket {
  return {
    scope: 'units',
    result: applyUnitOverrides(result, override),
  } satisfies SearchMultiScopeBucket;
}

function createSequenceBucket(
  result: HybridForScope<'sequences'>,
  override?: BucketOverride,
): SearchMultiScopeBucket {
  return {
    scope: 'sequences',
    result: applySequenceOverrides(result, override),
  } satisfies SearchMultiScopeBucket;
}

function applyLessonOverrides(
  result: HybridForScope<'lessons'>,
  override?: BucketOverride,
): HybridForScope<'lessons'> {
  if (!override) {
    return result;
  }
  return createSearchLessonsResponse({
    results: result.results,
    total: override.total ?? result.total,
    took: override.took ?? result.took,
    timedOut: override.timedOut ?? result.timedOut,
    aggregations: override.aggregations ?? result.aggregations,
    facets: override.facets ?? result.facets,
    suggestions: result.suggestions ?? [],
    suggestionCache: result.suggestionCache,
  });
}

function applyUnitOverrides(
  result: HybridForScope<'units'>,
  override?: BucketOverride,
): HybridForScope<'units'> {
  if (!override) {
    return result;
  }
  return createSearchUnitsResponse({
    results: result.results,
    total: override.total ?? result.total,
    took: override.took ?? result.took,
    timedOut: override.timedOut ?? result.timedOut,
    aggregations: override.aggregations ?? result.aggregations,
    facets: override.facets ?? result.facets,
    suggestions: result.suggestions,
    suggestionCache: result.suggestionCache,
  });
}

function applySequenceOverrides(
  result: HybridForScope<'sequences'>,
  override?: BucketOverride,
): HybridForScope<'sequences'> {
  if (!override) {
    return result;
  }
  return createSearchSequencesResponse({
    results: result.results,
    total: override.total ?? result.total,
    took: override.took ?? result.took,
    timedOut: override.timedOut ?? result.timedOut,
    aggregations: override.aggregations ?? result.aggregations,
    facets: override.facets ?? result.facets,
    suggestions: result.suggestions,
    suggestionCache: result.suggestionCache,
  });
}

function collectSuggestions(
  defaults: ReadonlyArray<SuggestionItem>,
  overrides?: SuggestionItem[],
): SuggestionItem[] {
  if (overrides) {
    return overrides;
  }
  return [...defaults];
}

function createResponseInput(options: BuildMultiScopeFixtureOptions) {
  const resolved = resolveMultiScopeOptions(options);
  const lessonBucket = buildSingleScopeFixture({ dataset: resolved.lessonsDataset });
  const buckets = assembleBuckets({
    lessonBucket,
    unitsDataset: resolved.unitsDataset,
    sequencesDataset: resolved.sequencesDataset,
    overrides: resolved.bucketOverrides,
  });

  const suggestions = collectSuggestions(lessonBucket.suggestions, resolved.suggestionOverrides);
  const suggestionCache = SearchSuggestionResponseSchema.shape.cache.parse(
    resolveSuggestionCache(lessonBucket.suggestionCache, resolved.suggestionCacheOverride),
  );

  return { buckets, suggestions, suggestionCache };
}

function resolveMultiScopeOptions(options: BuildMultiScopeFixtureOptions) {
  return {
    lessonsDataset: options.lessonsDataset ?? 'ks2-maths',
    unitsDataset: options.unitsDataset ?? 'ks4-maths',
    sequencesDataset: options.sequencesDataset ?? 'ks3-history',
    bucketOverrides: options.overrides?.buckets,
    suggestionOverrides: options.overrides?.suggestions,
    suggestionCacheOverride: options.overrides?.suggestionCache,
  } as const;
}

function resolveSuggestionCache(
  fallback: SuggestionCache,
  override: SuggestionCache | undefined,
): SuggestionCache {
  if (override) {
    return override;
  }
  return fallback ?? DEFAULT_SUGGESTION_CACHE;
}

function finalizeMultiScopeFixture(
  response: SearchMultiScopeResponse,
): MultiScopeHybridResponse & { suggestions: SuggestionItem[]; suggestionCache: SuggestionCache } {
  return {
    ...response,
    suggestions: response.suggestions ?? [],
    suggestionCache: response.suggestionCache,
  };
}
