/**
 * Retrieval service factory.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '@oaknational/sdk-codegen/search';

import type { RetrievalService } from '../types/retrieval.js';
import type {
  RetrievalError,
  LessonsSearchResult,
  UnitsSearchResult,
  LessonResult,
  UnitResult,
} from '../types/retrieval-results.js';
import type { SearchLessonsParams, SearchUnitsParams } from '../types/retrieval-params.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { EsSearchFn, EsSearchRequest } from '../internal/types.js';
import { createEsSearchFn } from '../internal/es-search.js';
import { createIndexResolver } from '../internal/index-resolver.js';
import { removeNoisePhrases } from './query-processing/remove-noise-phrases.js';
import { detectCurriculumPhrases } from './query-processing/detect-curriculum-phrases.js';
import { buildFourWayRetriever } from './rrf-query-builders.js';
import {
  buildLessonFilters,
  buildUnitFilters,
  buildLessonHighlight,
  buildUnitHighlight,
} from './rrf-query-helpers.js';
import {
  normaliseTranscriptScores,
  filterByMinScore,
  DEFAULT_MIN_SCORE,
  clampSize,
  clampFrom,
} from './rrf-score-processing.js';
import { suggest } from './suggestions.js';
import { fetchSequenceFacets } from './sequence-facets.js';
import { deriveUnitDoc } from './unit-doc-mapper.js';
import { searchSequences } from './search-sequences.js';
import { searchThreads } from './search-threads.js';
import { toRetrievalError } from './retrieval-error.js';
import { LESSON_SOURCE_EXCLUDES, UNIT_SOURCE_EXCLUDES } from './source-excludes.js';

/**
 * Create the retrieval service implementation.
 *
 * @param esClient - Elasticsearch client instance
 * @param config - SDK configuration (index target, etc.)
 * @param logger - Optional logger for debug traces
 * @returns RetrievalService with searchLessons, searchUnits, searchSequences, searchThreads, suggest, fetchSequenceFacets
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
    searchThreads: (params) => searchThreads(params, search, resolveIndex, logger),
    suggest: (params) => suggest(params, esClient, search, resolveIndex, config),
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
      _source: LESSON_SOURCE_EXCLUDES,
    };

    logger?.debug('searchLessons', { text: params.text, size, from });
    const res = await search<SearchLessonsIndexDoc>(request);
    const normalisedHits = normaliseTranscriptScores(res.hits.hits);
    const filteredHits = filterByMinScore(normalisedHits, DEFAULT_MIN_SCORE);
    const results: readonly LessonResult[] = filteredHits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score,
      lesson: hit._source,
      highlights: hit._highlight?.lesson_content ?? [],
    }));

    return ok({
      scope: 'lessons',
      results,
      total: filteredHits.length,
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
      _source: UNIT_SOURCE_EXCLUDES,
    };

    logger?.debug('searchUnits', { text: params.text, size, from });
    const res = await search<SearchUnitRollupDoc>(request);
    const scored = res.hits.hits.map((h) => ({ _score: h._score ?? 0, _hit: h }));
    const kept = filterByMinScore(scored, DEFAULT_MIN_SCORE);
    const results: readonly UnitResult[] = kept.map((s) => ({
      id: s._hit._id,
      rankScore: s._score,
      unit: deriveUnitDoc(s._hit),
      highlights: s._hit.highlight?.unit_content ?? [],
    }));

    return ok({
      scope: 'units',
      results,
      total: kept.length,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}
