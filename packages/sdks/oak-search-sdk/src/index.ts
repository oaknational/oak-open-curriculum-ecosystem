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
 *   query: 'expanding brackets',
 *   subject: 'maths',
 *   keyStage: 'ks3',
 * });
 * ```
 */

// ---------------------------------------------------------------------------
// SDK factory
// ---------------------------------------------------------------------------

export { createSearchSdk } from './create-search-sdk.js';
export { createSearchRetrieval } from './create-search-retrieval.js';
export type { SearchRetrievalFactories, EsClientConfig } from './create-search-retrieval.js';

// ---------------------------------------------------------------------------
// Index lifecycle service (ADR-130) — blue/green index management
// ---------------------------------------------------------------------------

export {
  createIndexLifecycleService,
  buildLifecycleDeps,
  createVersionedIndexResolver,
} from './admin/index.js';

// ---------------------------------------------------------------------------
// Index resolution — constants and pure functions for Elasticsearch index naming
// ---------------------------------------------------------------------------

export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveSearchIndexName,
  resolveZeroHitIndexName,
} from './internal/index.js';

export type { SearchIndexTarget, SearchIndexKind, IndexResolverFn } from './internal/index.js';

// ---------------------------------------------------------------------------
// Retriever builders — canonical shapes for all search scopes
// ---------------------------------------------------------------------------

export {
  buildSequenceRetriever,
  buildThreadRetriever,
} from './retrieval/retrieval-search-helpers.js';

export {
  buildFourWayRetriever,
  buildLessonRetriever,
  buildUnitRetriever,
  buildBm25Retriever,
  LESSON_BM25_CONTENT,
  LESSON_BM25_STRUCTURE,
  UNIT_BM25_CONTENT,
  UNIT_BM25_STRUCTURE,
} from './retrieval/rrf-query-builders.js';

export { removeNoisePhrases, detectCurriculumPhrases } from './retrieval/query-processing/index.js';

export {
  normaliseTranscriptScores,
  filterByMinScore,
  DEFAULT_MIN_SCORE,
  clampSize,
  clampFrom,
} from './retrieval/rrf-score-processing.js';

export {
  buildLessonFilters,
  buildUnitFilters,
  buildSequenceFilters,
  buildLessonHighlight,
  buildUnitHighlight,
} from './retrieval/rrf-query-helpers.js';

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
  // Admin service interface and types
  AdminService,
  AdminError,
  IndexSetupResult,
  SetupResult,
  ConnectionStatus,
  IndexInfo,
  IndexDocCount,
  SynonymsResult,
  IngestOptions,
  IngestResult,
  // Index lifecycle service types (ADR-130)
  IndexLifecycleDeps,
  IndexLifecycleService,
  VersionedIngestOptions,
  VersionedIngestResult,
  StageResult,
  PromoteResult,
  RollbackResult,
  AliasValidationResult,
  AliasHealthEntry,
  // Observability service interface and types
  ObservabilityService,
  ObservabilityError,
  ZeroHitPayload,
  TelemetryFetchOptions,
} from './types/index.js';
