import {
  DEFAULT_SUGGESTION_CACHE,
  createSearchLessonsResponse,
  type SearchLessonResult,
  type SearchLessonsResponse,
  type SearchFacets,
  type SearchLessonsSuggestionCache,
  type SearchSuggestionItem,
  SearchSuggestionResponseSchema,
} from '@oaknational/oak-curriculum-sdk';
import { isSubject } from '@oaknational/oak-curriculum-sdk';
import {
  ks2MathsLessons,
  ks2MathsMeta,
  ks2MathsSuggestions,
  ks3ArtLessons,
  ks3ArtMeta,
  ks3ArtSuggestions,
  ks3HistoryLessons,
  ks3HistoryMeta,
  ks3HistorySuggestions,
  ks4MathsLessons,
  ks4MathsMeta,
  ks4MathsSuggestions,
  ks4ScienceAggregations,
  ks4ScienceFacets,
  ks4ScienceLessons,
  ks4ScienceMeta,
  ks4ScienceSuggestionCache,
  ks4ScienceSuggestions,
} from '../data';

type LessonRecord =
  | (typeof ks2MathsLessons)[number]
  | (typeof ks4MathsLessons)[number]
  | (typeof ks3HistoryLessons)[number]
  | (typeof ks3ArtLessons)[number]
  | (typeof ks4ScienceLessons)[number];

export type SingleScopeDatasetKey =
  | 'ks2-maths'
  | 'ks4-maths'
  | 'ks3-history'
  | 'ks3-art'
  | 'ks4-science';

interface DatasetRecord {
  readonly lessons: readonly LessonRecord[];
  readonly meta: {
    readonly total: number;
    readonly took: number;
    readonly timedOut: boolean;
  };
  readonly suggestions: readonly SearchSuggestionItem[];
  readonly suggestionCache?: SearchLessonsSuggestionCache;
  readonly facets?: SearchFacets;
  readonly aggregations?: SearchLessonsResponse['aggregations'];
}

type FixtureOverrides = Partial<
  Pick<SearchLessonsResponse, 'total' | 'took' | 'timedOut' | 'aggregations' | 'facets'> & {
    suggestions: SearchSuggestionItem[];
    suggestionCache: SearchLessonsSuggestionCache;
  }
>;

const DATASETS: Record<SingleScopeDatasetKey, DatasetRecord> = {
  'ks2-maths': {
    lessons: ks2MathsLessons,
    meta: ks2MathsMeta,
    suggestions: ks2MathsSuggestions,
    suggestionCache: createFixtureSuggestionCache(),
  },
  'ks4-maths': {
    lessons: ks4MathsLessons,
    meta: ks4MathsMeta,
    suggestions: ks4MathsSuggestions,
    suggestionCache: createFixtureSuggestionCache(),
  },
  'ks3-history': {
    lessons: ks3HistoryLessons,
    meta: ks3HistoryMeta,
    suggestions: ks3HistorySuggestions,
    suggestionCache: createFixtureSuggestionCache(),
  },
  'ks3-art': {
    lessons: ks3ArtLessons,
    meta: ks3ArtMeta,
    suggestions: ks3ArtSuggestions,
    suggestionCache: createFixtureSuggestionCache(),
  },
  'ks4-science': {
    lessons: ks4ScienceLessons,
    meta: ks4ScienceMeta,
    suggestions: ks4ScienceSuggestions,
    suggestionCache: ks4ScienceSuggestionCache,
    facets: ks4ScienceFacets,
    aggregations: ks4ScienceAggregations,
  },
};

function createFixtureSuggestionCache(): SearchLessonsSuggestionCache {
  return {
    version: 'fixture-v1',
    ttlSeconds: DEFAULT_SUGGESTION_CACHE.ttlSeconds,
  };
}

function cloneSuggestionCache(cache?: SearchLessonsSuggestionCache): SearchLessonsSuggestionCache {
  const source = normaliseSuggestionCache(cache);
  return {
    version: source.version,
    ttlSeconds: source.ttlSeconds,
  };
}

export interface BuildSingleScopeFixtureOptions {
  readonly dataset?: SingleScopeDatasetKey;
  readonly overrides?: FixtureOverrides;
}

export type SingleScopeFixture = SearchLessonsResponse & {
  readonly suggestions: readonly SearchSuggestionItem[];
  readonly suggestionCache: SearchLessonsSuggestionCache;
};

export function buildSingleScopeFixture(
  options: BuildSingleScopeFixtureOptions = {},
): SingleScopeFixture {
  const { dataset = 'ks2-maths', overrides } = options;
  const selected = DATASETS[dataset];
  const base = createBaseFixture(selected);
  return applyOverrides(base, overrides);
}

function createBaseFixture(selected: DatasetRecord): SingleScopeFixture {
  const results = selected.lessons.map((lesson, index) =>
    mapLessonRecord(lesson, index, selected.lessons.length),
  );
  const response = createSearchLessonsResponse({
    results,
    total: selected.meta.total,
    took: selected.meta.took,
    timedOut: selected.meta.timedOut,
    aggregations: selected.aggregations ?? {},
    facets: selected.facets ?? null,
    suggestions: [...selected.suggestions],
    suggestionCache: cloneSuggestionCache(selected.suggestionCache),
  });

  return toSingleScopeFixture(response);
}

function mapLessonRecord(record: LessonRecord, index: number, total: number): SearchLessonResult {
  const rankScore = Math.max(1, total - index);
  const yearGroup = 'yearGroup' in record.lesson ? record.lesson.yearGroup : undefined;
  return {
    id: record.id,
    rankScore,
    lesson: {
      lesson_title: record.lesson.lessonTitle,
      subject_slug: assertLessonSubjectSlug(record.lesson.subjectSlug),
      key_stage: record.lesson.keyStage,
      ...(yearGroup ? { year_group: yearGroup } : {}),
    },
    highlights: [...record.highlights],
  };
}

/**
 * Ensures fixture lesson subject slugs align with the API schema.
 */
function assertLessonSubjectSlug(
  slug: string,
): NonNullable<SearchLessonResult['lesson']>['subject_slug'] {
  if (isSubject(slug)) {
    return slug;
  }
  throw new Error(`Unrecognised lesson subject slug in fixture data: ${slug}`);
}

function applyOverrides(
  base: SingleScopeFixture,
  overrides?: FixtureOverrides,
): SingleScopeFixture {
  if (!overrides) {
    return base;
  }

  const response = createSearchLessonsResponse(mergeLessonOverrides(base, overrides));

  return toSingleScopeFixture(response);
}

function mergeLessonOverrides(
  base: SingleScopeFixture,
  overrides: FixtureOverrides,
): Parameters<typeof createSearchLessonsResponse>[0] {
  const suggestionCacheSource = overrides.suggestionCache ?? base.suggestionCache;
  return {
    results: base.results,
    total: resolveNumberOverride(base.total, overrides.total),
    took: resolveNumberOverride(base.took, overrides.took),
    timedOut: resolveBooleanOverride(base.timedOut, overrides.timedOut),
    aggregations: resolveFallback(overrides.aggregations, base.aggregations),
    facets: resolveFallback(overrides.facets, base.facets),
    suggestions: resolveSuggestions(base.suggestions, overrides.suggestions),
    suggestionCache: cloneSuggestionCache(suggestionCacheSource),
  };
}

function toSingleScopeFixture(response: SearchLessonsResponse): SingleScopeFixture {
  return {
    ...response,
    suggestions: response.suggestions ?? [],
    suggestionCache: response.suggestionCache,
  } satisfies SingleScopeFixture;
}

function resolveNumberOverride(baseValue: number, overrideValue: number | undefined): number {
  return typeof overrideValue === 'number' ? overrideValue : baseValue;
}

function resolveBooleanOverride(baseValue: boolean, overrideValue: boolean | undefined): boolean {
  return typeof overrideValue === 'boolean' ? overrideValue : baseValue;
}

function resolveFallback<T>(overrideValue: T | undefined, baseValue: T): T {
  return overrideValue ?? baseValue;
}

function resolveSuggestions(
  base: readonly SearchSuggestionItem[],
  override: SearchSuggestionItem[] | undefined,
): SearchSuggestionItem[] {
  return override ? [...override] : [...base];
}

const suggestionCacheSchema = SearchSuggestionResponseSchema.shape.cache;

function normaliseSuggestionCache(
  value: SearchLessonsSuggestionCache | undefined,
): SearchLessonsSuggestionCache {
  return suggestionCacheSchema.parse(value ?? DEFAULT_SUGGESTION_CACHE);
}
