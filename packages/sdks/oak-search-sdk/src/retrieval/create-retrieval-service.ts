/**
 * Retrieval service factory.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import { ok, err, type Result } from '@oaknational/result';
import type {
  SearchLessonsIndexDoc,
  SearchSequenceIndexDoc,
  SearchUnitRollupDoc,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { RetrievalService } from '../types/retrieval.js';
import type {
  RetrievalError,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  LessonResult,
  UnitResult,
} from '../types/retrieval-results.js';
import type {
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
} from '../types/retrieval-params.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { EsSearchFn, EsSearchRequest } from '../internal/types.js';
import { createEsSearchFn } from '../internal/es-search.js';
import { createIndexResolver } from '../internal/index-resolver.js';
import { extractStatusCode } from '../admin/es-error-guards.js';
import { removeNoisePhrases } from './query-processing/remove-noise-phrases.js';
import { detectCurriculumPhrases } from './query-processing/detect-curriculum-phrases.js';
import { buildFourWayRetriever } from './rrf-query-builders.js';
import {
  buildLessonFilters,
  buildUnitFilters,
  buildLessonHighlight,
  buildUnitHighlight,
  normaliseTranscriptScores,
  clampSize,
  clampFrom,
} from './rrf-query-helpers.js';
import { suggest } from './suggestions.js';
import { fetchSequenceFacets } from './sequence-facets.js';
import { buildSequenceRetriever, deriveUnitDoc } from './retrieval-search-helpers.js';

/**
 * Convert an unknown caught error into a `RetrievalError`.
 *
 * @param error - The caught error value
 * @returns A typed `RetrievalError` discriminated union member
 */
function toRetrievalError(error: unknown): RetrievalError {
  const message = error instanceof Error ? error.message : String(error);
  const statusCode = extractStatusCode(error);
  return { type: 'es_error', message, statusCode };
}

/**
 * Create the retrieval service implementation.
 *
 * @param esClient - Elasticsearch client instance
 * @param config - SDK configuration (index target, etc.)
 * @param logger - Optional logger for debug traces
 * @returns RetrievalService with searchLessons, searchUnits, searchSequences, suggest, fetchSequenceFacets
 *
 * @example
 * ```typescript
 * const sdk = createSearchSdk({ client, indexTarget: 'primary' });
 * const result = await sdk.retrieval.searchLessons({ text: 'photosynthesis' });
 * ```
 */
export function createRetrievalService(
  esClient: Client,
  config: SearchSdkConfig,
  logger?: Logger,
): RetrievalService {
  const search = createEsSearchFn(esClient);
  const resolveIndex = createIndexResolver(config.indexTarget);

  return {
    searchLessons: (params) => searchLessons(params, search, resolveIndex, logger),
    searchUnits: (params) => searchUnits(params, search, resolveIndex, logger),
    searchSequences: (params) => searchSequences(params, search, resolveIndex, logger),
    suggest: (params) => suggest(params, esClient, resolveIndex, config),
    fetchSequenceFacets: (params) => fetchSequenceFacets(params, search, resolveIndex),
  };
}

/**
 * Execute lesson search with four-way RRF, filters, and transcript scoring.
 *
 * @param params - Search lessons parameters
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with lessons or retrieval error
 */
async function searchLessons(
  params: SearchLessonsParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'lessons') => string,
  logger?: Logger,
): Promise<Result<LessonsSearchResult, RetrievalError>> {
  try {
    const size = clampSize(params.size);
    const from = clampFrom(params.from);
    const cleanedText = removeNoisePhrases(params.text);
    const phrases = detectCurriculumPhrases(cleanedText);
    const filters = buildLessonFilters(params);

    const request: EsSearchRequest = {
      index: resolveIndex('lessons'),
      size,
      retriever: buildFourWayRetriever(cleanedText, filters, phrases, 'lesson'),
      highlight: params.highlight !== false ? buildLessonHighlight() : undefined,
      from: from > 0 ? from : undefined,
    };

    logger?.debug('searchLessons', { text: params.text, size, from });
    const res = await search<SearchLessonsIndexDoc>(request);
    const normalisedHits = normaliseTranscriptScores(res.hits.hits);
    const results: readonly LessonResult[] = normalisedHits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score,
      lesson: hit._source,
      highlights: hit._highlight?.lesson_content ?? [],
    }));

    return ok({
      scope: 'lessons',
      results,
      total: res.hits.total.value,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}

/**
 * Execute unit search with four-way RRF and filters.
 *
 * @param params - Search units parameters
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with units or retrieval error
 */
async function searchUnits(
  params: SearchUnitsParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'unit_rollup') => string,
  logger?: Logger,
): Promise<Result<UnitsSearchResult, RetrievalError>> {
  try {
    const size = clampSize(params.size);
    const from = clampFrom(params.from);
    const cleanedText = removeNoisePhrases(params.text);
    const phrases = detectCurriculumPhrases(cleanedText);
    const filters = buildUnitFilters(params);

    const request: EsSearchRequest = {
      index: resolveIndex('unit_rollup'),
      size,
      retriever: buildFourWayRetriever(cleanedText, filters, phrases, 'unit'),
      highlight: params.highlight !== false ? buildUnitHighlight() : undefined,
      from: from > 0 ? from : undefined,
    };

    logger?.debug('searchUnits', { text: params.text, size, from });
    const res = await search<SearchUnitRollupDoc>(request);
    const results: readonly UnitResult[] = res.hits.hits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score ?? 0,
      unit: deriveUnitDoc(hit),
      highlights: hit.highlight?.unit_content ?? [],
    }));

    return ok({
      scope: 'units',
      results,
      total: res.hits.total.value,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}

/**
 * Execute sequence search with two-way RRF (BM25+semantic).
 *
 * @param params - Search sequences parameters
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with sequences or retrieval error
 */
async function searchSequences(
  params: SearchSequencesParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'sequences') => string,
  logger?: Logger,
): Promise<Result<SequencesSearchResult, RetrievalError>> {
  try {
    const size = clampSize(params.size);
    const from = clampFrom(params.from);
    const filters: estypes.QueryDslQueryContainer[] = [];
    if (params.subject) {
      filters.push({ term: { subject_slug: params.subject } });
    }
    if (params.phaseSlug) {
      filters.push({ term: { phase_slug: params.phaseSlug } });
    }

    const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
    const request: EsSearchRequest = {
      index: resolveIndex('sequences'),
      size,
      retriever: buildSequenceRetriever(params.text, filterClause),
      from: from > 0 ? from : undefined,
    };

    logger?.debug('searchSequences', { text: params.text, size, from });
    const res = await search<SearchSequenceIndexDoc>(request);
    const results = res.hits.hits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score ?? 0,
      sequence: hit._source,
    }));
    return ok({
      scope: 'sequences',
      results,
      total: res.hits.total.value,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}
