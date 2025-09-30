import type { HybridResponse } from '../../structured-search.shared';
import { buildSingleScopeFixture, type SingleScopeDatasetKey } from './single-scope';
import { buildSequenceFixture, buildUnitFixture } from './multi-scope';
import {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
} from '../../../../src/types/oak';

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

export function buildEmptyFixture({ scope, dataset }: BuildEmptyFixtureOptions): HybridResponse {
  const resolvedDataset = dataset ?? DEFAULT_DATASET[scope];

  if (scope === 'lessons') {
    const base = buildSingleScopeFixture({ dataset: resolvedDataset });
    return createSearchLessonsResponse({
      results: [],
      total: 0,
      took: base.took,
      timedOut: false,
      aggregations: base.aggregations,
      facets: base.facets,
      suggestions: base.suggestions,
      suggestionCache: base.suggestionCache,
    });
  }

  if (scope === 'units') {
    const base = buildUnitFixture(resolvedDataset);
    return createSearchUnitsResponse({
      results: [],
      total: 0,
      took: base.took,
      timedOut: false,
      aggregations: base.aggregations,
      facets: base.facets,
      suggestions: base.suggestions,
      suggestionCache: base.suggestionCache,
    });
  }

  const base = buildSequenceFixture(resolvedDataset);
  return createSearchSequencesResponse({
    results: [],
    total: 0,
    took: base.took,
    timedOut: false,
    aggregations: base.aggregations,
    facets: base.facets,
    suggestions: base.suggestions,
    suggestionCache: base.suggestionCache,
  });
}
