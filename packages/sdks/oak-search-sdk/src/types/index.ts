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
  SearchParamsBase,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
  LessonResult,
  UnitResult,
  SequenceResult,
  SearchResultMeta,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from './retrieval.js';

// Admin service interface and types
export type {
  AdminService,
  IndexSetupResult,
  SetupResult,
  SetupOptions,
  ConnectionStatus,
  IndexInfo,
  SynonymsResult,
  IngestOptions,
  IngestResult,
  IndexMetaError,
} from './admin.js';

// Observability service interface and types
export type {
  ObservabilityService,
  ZeroHitPayload,
  TelemetryFetchOptions,
} from './observability.js';
