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
  LESSON_CONTENT_SEMANTIC,
  LESSON_STRUCTURE_SEMANTIC,
  UNIT_CONTENT_SEMANTIC,
  UNIT_STRUCTURE_SEMANTIC,
  LESSON_BM25_CONFIG,
  UNIT_BM25_CONFIG,
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
export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveAliasName,
  resolveSearchIndexName,
  resolveVersionedIndexName,
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
