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
  ks2MathsUnits,
  ks2MathsSequences,
  ks3ArtUnits,
  ks3ArtSequences,
  ks3HistoryUnits,
  ks3HistorySequences,
  ks4MathsUnits,
  ks4MathsSequences,
  ks4ScienceUnits,
  ks4ScienceSequences,
} from '../data';

// Type helpers ----------------------------------------------------------------

type UnitRecord =
  | (typeof ks2MathsUnits)[number]
  | (typeof ks4MathsUnits)[number]
  | (typeof ks3HistoryUnits)[number]
  | (typeof ks3ArtUnits)[number];

type SequenceRecord =
  | (typeof ks2MathsSequences)[number]
  | (typeof ks4MathsSequences)[number]
  | (typeof ks3HistorySequences)[number]
  | (typeof ks3ArtSequences)[number]
  | (typeof ks4ScienceSequences)[number];

type BucketOverride = Partial<
  Pick<HybridResponse, 'total' | 'took' | 'timedOut' | 'aggregations' | 'facets'>
>;

type BucketOverrideMap = Partial<Record<'lessons' | 'units' | 'sequences', BucketOverride>>;

type SuggestionCache = {
  readonly version: string;
  readonly ttlSeconds: number;
};

const UNIT_DATASETS: Record<SingleScopeDatasetKey, readonly UnitRecord[]> = {
  'ks2-maths': ks2MathsUnits,
  'ks4-maths': ks4MathsUnits,
  'ks3-history': ks3HistoryUnits,
  'ks3-art': ks3ArtUnits,
  'ks4-science': ks4ScienceUnits,
};
type SequenceDatasetKey = SingleScopeDatasetKey;

const SEQUENCE_DATASETS: Record<SequenceDatasetKey, readonly SequenceRecord[]> = {
  'ks2-maths': ks2MathsSequences,
  'ks4-maths': ks4MathsSequences,
  'ks3-history': ks3HistorySequences,
  'ks3-art': ks3ArtSequences,
  'ks4-science': ks4ScienceSequences,
};

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

export function buildMultiScopeFixture(
  options: BuildMultiScopeFixtureOptions = {},
): MultiScopeHybridResponse & {
  suggestions: SuggestionItem[];
  suggestionCache: SuggestionCache;
} {
  const {
    lessonsDataset = 'ks2-maths',
    unitsDataset = 'ks4-maths',
    sequencesDataset = 'ks3-history',
    overrides,
  } = options;

  const lessonBucket = buildSingleScopeFixture({ dataset: lessonsDataset });
  const buckets = assembleBuckets({
    lessonBucket,
    unitsDataset,
    sequencesDataset,
    overrides: overrides?.buckets,
  });
  const suggestions = collectSuggestions(lessonBucket.suggestions, overrides?.suggestions);
  const suggestionCache = collectSuggestionCache(
    lessonBucket.suggestionCache,
    overrides?.suggestionCache,
  );

  return {
    scope: 'all',
    buckets,
    suggestions,
    suggestionCache,
  };
}

// Helpers ---------------------------------------------------------------------

function assembleBuckets(params: {
  readonly lessonBucket: SingleScopeFixture;
  readonly unitsDataset: SingleScopeDatasetKey;
  readonly sequencesDataset: SingleScopeDatasetKey;
  readonly overrides?: BucketOverrideMap;
}) {
  const unitBucket = buildUnitFixture(params.unitsDataset);
  const sequenceBucket = buildSequenceFixture(params.sequencesDataset);
  return [
    createBucket('lessons', params.lessonBucket, params.overrides),
    createBucket('units', unitBucket, params.overrides),
    createBucket('sequences', sequenceBucket, params.overrides),
  ];
}

function createBucket(
  scope: 'lessons' | 'units' | 'sequences',
  result: HybridResponse,
  overrides?: BucketOverrideMap,
) {
  return {
    scope,
    result: applyBucketOverrides(scope, result, overrides),
  } as const;
}

function applyBucketOverrides(
  key: 'lessons' | 'units' | 'sequences',
  result: HybridResponse,
  overrides?: BucketOverrideMap,
): HybridResponse {
  const override = overrides?.[key];
  if (!override) {
    return result;
  }

  return {
    ...result,
    total: override.total ?? result.total,
    took: override.took ?? result.took,
    timedOut: override.timedOut ?? result.timedOut,
    aggregations: override.aggregations ?? result.aggregations,
    facets: override.facets ?? result.facets,
  };
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

function collectSuggestionCache(
  defaults: SuggestionCache,
  override?: SuggestionCache,
): SuggestionCache {
  if (override) {
    return override;
  }
  return { ...defaults };
}

export function buildUnitFixture(datasetKey: SingleScopeDatasetKey): HybridResponse {
  const units = UNIT_DATASETS[datasetKey];
  const results = units.map((unit) => ({
    id: unit.unitSlug,
    unit: {
      unit_title: unit.unitTitle,
      subject_slug: unit.subjectSlug,
      key_stage: unit.keyStages[0],
    },
    highlights: buildUnitHighlights(unit),
  }));

  return {
    scope: 'units',
    results,
    total: results.length,
    took: 16,
    timedOut: false,
    aggregations: {},
    facets: null,
  };
}

function buildUnitHighlights(unit: UnitRecord): string[] {
  const highlights: string[] = [];
  if (unit.yearGroups.length > 0) {
    highlights.push(`Years ${unit.yearGroups.join(', ')}`);
  }
  if (unit.keyStages.length > 0) {
    highlights.push(`Key stage ${unit.keyStages.join(' / ')}`);
  }
  return highlights;
}

export function buildSequenceFixture(datasetKey: SingleScopeDatasetKey): HybridResponse {
  const sequences = SEQUENCE_DATASETS[datasetKey];
  const results = sequences.map((sequence) => ({
    id: sequence.sequenceSlug,
    highlights: buildSequenceHighlights(sequence),
  }));

  return {
    scope: 'sequences',
    results,
    total: results.length,
    took: 14,
    timedOut: false,
    aggregations: {},
    facets: null,
  };
}

function buildSequenceHighlights(sequence: SequenceRecord): string[] {
  const highlights: string[] = [];
  highlights.push(sequence.phaseTitle);
  if (sequence.keyStages.length > 0) {
    const stages = sequence.keyStages.map((ks) => ks.keyStageSlug.toUpperCase()).join(', ');
    highlights.push(`Key stages ${stages}`);
  }
  if (sequence.years.length > 0) {
    highlights.push(`Years ${sequence.years.join(', ')}`);
  }
  return highlights;
}
