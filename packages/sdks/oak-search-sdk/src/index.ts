/**
 * Default root export surface for `@oaknational/oak-search-sdk`.
 *
 * The root surface is intentionally non-admin. Privileged capabilities
 * are exposed via explicit subpaths.
 *
 * Note: observability exports can persist events when configured; "non-admin"
 * here means "not lifecycle/index-management".
 *
 * Subpaths:
 * - `@oaknational/oak-search-sdk/read`
 * - `@oaknational/oak-search-sdk/admin`
 */

export { createSearchRetrieval } from './create-search-retrieval.js';
export { createRetrievalService } from './retrieval/index.js';
export { createObservabilityService } from './observability/index.js';
export type { SearchRetrievalFactories, EsClientConfig } from './create-search-retrieval.js';
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
