import type {
  HybridResponse,
  SuggestionItem,
  SuggestionCache,
} from '../../structured-search.shared';
import { DEFAULT_SUGGESTION_CACHE } from '../../structured-search.shared';
import type { SearchFacets } from '../../../../src/types/oak';
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

type DatasetRecord = {
  readonly lessons: readonly LessonRecord[];
  readonly meta: {
    readonly total: number;
    readonly took: number;
    readonly timedOut: boolean;
  };
  readonly suggestions: readonly SuggestionItem[];
  readonly suggestionCache?: SuggestionCache;
  readonly facets?: SearchFacets;
  // This needs a better type
  readonly aggregations?: Record<string, unknown>;
};

type FixtureOverrides = Partial<
  Pick<HybridResponse, 'total' | 'took' | 'timedOut' | 'aggregations' | 'facets'> & {
    suggestions: SuggestionItem[];
    suggestionCache: SuggestionCache;
  }
>;

const DATASETS: Record<SingleScopeDatasetKey, DatasetRecord> = {
  'ks2-maths': {
    lessons: ks2MathsLessons,
    meta: ks2MathsMeta,
    suggestions: ks2MathsSuggestions,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  },
  'ks4-maths': {
    lessons: ks4MathsLessons,
    meta: ks4MathsMeta,
    suggestions: ks4MathsSuggestions,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  },
  'ks3-history': {
    lessons: ks3HistoryLessons,
    meta: ks3HistoryMeta,
    suggestions: ks3HistorySuggestions,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
  },
  'ks3-art': {
    lessons: ks3ArtLessons,
    meta: ks3ArtMeta,
    suggestions: ks3ArtSuggestions,
    suggestionCache: DEFAULT_SUGGESTION_CACHE,
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

export interface BuildSingleScopeFixtureOptions {
  readonly dataset?: SingleScopeDatasetKey;
  readonly overrides?: FixtureOverrides;
}

export type SingleScopeFixture = HybridResponse & {
  readonly suggestions: ReadonlyArray<SuggestionItem>;
  readonly suggestionCache: SuggestionCache;
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
  const results = selected.lessons.map(mapLessonRecord);
  return {
    scope: 'lessons',
    results,
    total: selected.meta.total,
    took: selected.meta.took,
    timedOut: selected.meta.timedOut,
    aggregations: selected.aggregations ?? {},
    facets: selected.facets ?? null,
    suggestions: selected.suggestions,
    suggestionCache: selected.suggestionCache ?? DEFAULT_SUGGESTION_CACHE,
  };
}

function mapLessonRecord(record: LessonRecord) {
  return {
    id: record.id,
    lesson: {
      lesson_title: record.lesson.lessonTitle,
      subject_slug: record.lesson.subjectSlug,
      key_stage: record.lesson.keyStage,
      ...(record.lesson.yearGroup ? { year_group: record.lesson.yearGroup } : {}),
    },
    highlights: [...record.highlights],
  } as const;
}

function applyOverrides(
  base: SingleScopeFixture,
  overrides?: FixtureOverrides,
): SingleScopeFixture {
  if (!overrides) {
    return base;
  }

  return {
    ...base,
    total: overrides.total ?? base.total,
    took: overrides.took ?? base.took,
    timedOut: overrides.timedOut ?? base.timedOut,
    aggregations: overrides.aggregations ?? base.aggregations,
    facets: overrides.facets ?? base.facets,
    suggestions: overrides.suggestions ?? base.suggestions,
    suggestionCache: overrides.suggestionCache ?? base.suggestionCache,
  };
}
