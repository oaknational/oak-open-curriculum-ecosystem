/**
 * These are fixtures for search results. As such, they should be generated in the SDK at compile time, not here at runtime.
 * There is also significant redundancy in the types, we can do this a lot more efficiently.
 *
 * The Cardinal Rule of the repository needs to be applied here: ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST flow from the Open Curriculum OpenAPI schema in the SDK, and be generated at build/compile time, i.e. when `pnpm type-gen` is run. If the upstream OpenAPI schema changes, then running `pnpm type-gen` MUST be sufficient to bring all workspaces into alignment with the new schema.
 *
 * See <REPO_ROOT>/.agent/directives-and-memory/rules.md
 */

export {
  ks2MathsLessons,
  ks2MathsMeta,
  ks2MathsSequences,
  ks2MathsSuggestions,
  ks2MathsUnits,
} from './ks2-maths';

export {
  ks4MathsLessons,
  ks4MathsMeta,
  ks4MathsSequences,
  ks4MathsSuggestions,
  ks4MathsUnits,
} from './ks4-maths';

export {
  ks3HistoryLessons,
  ks3HistoryMeta,
  ks3HistorySequences,
  ks3HistorySuggestions,
  ks3HistoryUnits,
} from './ks3-history';

export {
  ks3ArtLessons,
  ks3ArtMeta,
  ks3ArtSequences,
  ks3ArtSuggestions,
  ks3ArtUnits,
} from './ks3-art';

export {
  ks4ScienceLessons,
  ks4ScienceMeta,
  ks4ScienceSequences,
  ks4ScienceSuggestions,
  ks4ScienceUnits,
  ks4ScienceFacets,
  ks4ScienceAggregations,
  ks4ScienceSuggestionCache,
} from './ks4-science';
