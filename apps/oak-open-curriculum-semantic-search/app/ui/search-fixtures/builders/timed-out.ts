import type { MultiScopeHybridResponse, SuggestionItem } from '../../structured-search.shared';
import {
  buildSingleScopeFixture,
  type BuildSingleScopeFixtureOptions,
  type SingleScopeFixture,
} from './single-scope';
import { buildMultiScopeFixture, type BuildMultiScopeFixtureOptions } from './multi-scope';

export type TimedOutSingleScopeFixture = SingleScopeFixture & { readonly timedOut: true };
export type TimedOutMultiScopeFixture = MultiScopeHybridResponse & {
  readonly suggestions: ReadonlyArray<SuggestionItem>;
};

export function buildTimedOutSingleScopeFixture(
  options: BuildSingleScopeFixtureOptions = {},
): TimedOutSingleScopeFixture {
  const base = buildSingleScopeFixture(options);
  return {
    ...base,
    timedOut: true,
  };
}

export function buildTimedOutMultiScopeFixture(
  options: BuildMultiScopeFixtureOptions = {},
): TimedOutMultiScopeFixture {
  const base = buildMultiScopeFixture(options);
  return {
    ...base,
    buckets: base.buckets.map((bucket) => ({
      ...bucket,
      result: {
        ...bucket.result,
        timedOut: true,
      },
    })),
  };
}
