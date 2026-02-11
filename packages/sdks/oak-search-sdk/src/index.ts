/**
 * `@oaknational/oak-search-sdk`
 *
 * TypeScript SDK for Oak semantic search — retrieval, admin, and
 * observability services backed by Elasticsearch.
 *
 * The SDK is created via the {@link createSearchSdk} factory which
 * accepts injected dependencies and configuration. The consuming
 * application provides the Elasticsearch client, optional logger,
 * and configuration — the SDK never reads `process.env`.
 *
 * @example
 * ```typescript
 * import { createSearchSdk } from '@oaknational/oak-search-sdk';
 * import { Client } from '@elastic/elasticsearch';
 *
 * const sdk = createSearchSdk({
 *   deps: {
 *     esClient: new Client({ node: esUrl, auth: { apiKey } }),
 *   },
 *   config: { indexTarget: 'primary' },
 * });
 *
 * const results = await sdk.retrieval.searchLessons({
 *   text: 'expanding brackets',
 *   subject: 'maths',
 *   keyStage: 'ks3',
 * });
 * ```
 */

// ---------------------------------------------------------------------------
// SDK factory
// ---------------------------------------------------------------------------

export { createSearchSdk } from './create-search-sdk.js';

// ---------------------------------------------------------------------------
// All public types
// ---------------------------------------------------------------------------

export type {
  // SDK factory and top-level types
  SearchSdkDeps,
  SearchSdkConfig,
  SearchSdkZeroHitConfig,
  SearchSdk,
  CreateSearchSdkOptions,
  CreateSearchSdkFn,
  // Retrieval service interface and types
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
  // Admin service interface and types
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
  // Observability service interface and types
  ObservabilityService,
  ZeroHitPayload,
  TelemetryFetchOptions,
} from './types/index.js';
