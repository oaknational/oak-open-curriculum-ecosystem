import type { HybridResponse } from '../../structured-search.shared';
import { buildSingleScopeFixture, type SingleScopeDatasetKey } from './single-scope';
import { buildSequenceFixture, buildUnitFixture } from './multi-scope';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- deliberately creating a fixture with no suggestions
    const { suggestions: _ignored, ...base } = buildSingleScopeFixture({
      dataset: resolvedDataset,
    });
    return {
      ...base,
      results: [],
      total: 0,
      took: base.took,
      timedOut: false,
    };
  }

  if (scope === 'units') {
    const base = buildUnitFixture(resolvedDataset);
    return {
      ...base,
      results: [],
      total: 0,
      took: base.took,
      timedOut: false,
    };
  }

  const base = buildSequenceFixture(resolvedDataset);
  return {
    ...base,
    results: [],
    total: 0,
    took: base.took,
    timedOut: false,
  };
}
