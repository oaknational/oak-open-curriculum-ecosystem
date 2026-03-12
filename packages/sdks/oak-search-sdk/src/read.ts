/**
 * Non-admin capability surface for `@oaknational/oak-search-sdk`.
 *
 * This surface excludes admin lifecycle/index-management exports.
 * It may still include observability services that can persist events.
 */

export { createSearchRetrieval } from './create-search-retrieval.js';
export { createRetrievalService } from './retrieval/index.js';
export { createObservabilityService } from './observability/index.js';
export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveSearchIndexName,
  resolveZeroHitIndexName,
} from './internal/index.js';
export type { SearchRetrievalFactories, EsClientConfig } from './create-search-retrieval.js';
export type { SearchIndexTarget, SearchIndexKind, IndexResolverFn } from './internal/index.js';

export type {
  SearchSdkConfig,
  SearchSdkZeroHitConfig,
  RetrievalService,
  RetrievalError,
  SearchParamsBase,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
  LessonResult,
  UnitResult,
  SequenceResult,
  ThreadResult,
  SearchResultMeta,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  ThreadsSearchResult,
  SuggestionResponse,
  ObservabilityService,
  ObservabilityError,
  ZeroHitPayload,
  TelemetryFetchOptions,
} from './types/index.js';
