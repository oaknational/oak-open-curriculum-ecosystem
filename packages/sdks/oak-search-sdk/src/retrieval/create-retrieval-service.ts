/**
 * Retrieval service factory.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type {
  SearchLessonsIndexDoc,
  SearchSequenceIndexDoc,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { RetrievalService } from '../types/retrieval.js';
import type {
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
} from '../types/retrieval-params.js';
import type {
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  LessonResult,
  UnitResult,
} from '../types/retrieval-results.js';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { EsSearchFn, EsSearchRequest, EsHit } from '../internal/types.js';
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
  normaliseTranscriptScores,
  clampSize,
  clampFrom,
} from './rrf-query-helpers.js';
import { suggest } from './suggestions.js';
import { fetchSequenceFacets } from './sequence-facets.js';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Create the retrieval service implementation. */
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

async function searchLessons(
  params: SearchLessonsParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'lessons') => string,
  logger?: Logger,
): Promise<LessonsSearchResult> {
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

  return {
    scope: 'lessons',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
  };
}

async function searchUnits(
  params: SearchUnitsParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'unit_rollup') => string,
  logger?: Logger,
): Promise<UnitsSearchResult> {
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

  return {
    scope: 'units',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
  };
}

async function searchSequences(
  params: SearchSequencesParams,
  search: EsSearchFn,
  resolveIndex: (kind: 'sequences') => string,
  logger?: Logger,
): Promise<SequencesSearchResult> {
  const size = clampSize(params.size);
  const from = clampFrom(params.from);
  const filters: QueryContainer[] = [];
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
  return {
    scope: 'sequences',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
  };
}

function buildSequenceRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query: text,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
              },
            },
            filter,
          },
        },
        { standard: { query: { semantic: { field: 'sequence_semantic', query: text } }, filter } },
      ],
      rank_window_size: 40,
      rank_constant: 40,
    },
  };
}

function deriveUnitDoc(hit: EsHit<SearchUnitRollupDoc>): SearchUnitsIndexDoc {
  const s = hit._source;
  return {
    unit_id: s.unit_id,
    unit_slug: s.unit_slug,
    unit_title: s.unit_title,
    subject_slug: s.subject_slug,
    subject_parent: s.subject_parent,
    key_stage: s.key_stage,
    years: s.years,
    lesson_ids: s.lesson_ids,
    lesson_count: s.lesson_count,
    unit_topics: s.unit_topics,
    unit_url: s.unit_url,
    subject_programmes_url: s.subject_programmes_url,
    sequence_ids: s.sequence_ids,
    thread_slugs: s.thread_slugs,
    thread_titles: s.thread_titles,
    thread_orders: s.thread_orders,
    title_suggest: s.title_suggest,
    doc_type: s.doc_type,
  };
}
