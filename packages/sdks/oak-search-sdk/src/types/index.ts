/**
 * Search SDK types — barrel export for all public types.
 */

// SDK factory and top-level types
export type {
  SearchSdkDeps,
  SearchSdkConfig,
  SearchSdkZeroHitConfig,
  SearchSdk,
  CreateSearchSdkOptions,
  CreateSearchSdkFn,
} from './sdk.js';

// Retrieval service interface and types
export type {
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
} from './retrieval.js';

// Admin service interface and types
export type {
  AdminService,
  AdminError,
  IndexSetupResult,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IngestOptions,
  IngestResult,
} from './admin.js';

// Observability service interface and types
export type {
  ObservabilityService,
  ObservabilityError,
  ZeroHitPayload,
  TelemetryFetchOptions,
} from './observability.js';
