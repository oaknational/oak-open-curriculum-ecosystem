/**
 * Two-way RRF query builders for hybrid search.
 *
 * Combines two retrieval methods using Reciprocal Rank Fusion:
 * 1. BM25 lexical search (multi_match)
 * 2. ELSER sparse embeddings (semantic)
 *
 * For three-way hybrid search (with dense vectors), see rrf-query-builders-three-way.ts.
 *
 * @module rrf-query-builders
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonFacets,
  createUnitFilters,
  createUnitHighlight,
} from './rrf-query-helpers';

// Re-export three-way RRF functions for backwards compatibility
export {
  buildThreeWayLessonRrfRequest,
  buildThreeWayUnitRrfRequest,
  type LessonRrfParams,
  type UnitRrfParams,
} from './rrf-query-builders-three-way';

type QueryContainer = estypes.QueryDslQueryContainer;

interface RrfRank {
  rrf: { window_size: number; rank_constant: number };
  queries: QueryContainer[];
}

/** Parameters for sequence RRF search. */
export interface SequenceRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  phaseSlug?: string;
}

/** Builds a two-way RRF request for lessons (BM25 + ELSER). */
export function buildLessonRrfRequest(params: {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    includeHighlights = false,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters(subject, keyStage);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    rank: createLessonRank(text),
    query: { bool: { filter: filters } },
  };

  if (includeHighlights) {
    request.highlight = createLessonHighlight();
  }
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }

  return request;
}

/** Builds a two-way RRF request for units (BM25 + ELSER). */
export function buildUnitRrfRequest(params: {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
}): EsSearchRequest {
  const { text, size, subject, keyStage, minLessons, includeHighlights = false } = params;
  const filters = createUnitFilters(subject, keyStage, minLessons);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    rank: createUnitRank(text),
    query: { bool: { filter: filters } },
  };

  if (includeHighlights) {
    request.highlight = createUnitHighlight();
  }

  return request;
}

/** Builds a two-way RRF request for sequences (BM25 + ELSER). */
export function buildSequenceRrfRequest(params: SequenceRrfParams): EsSearchRequest {
  const { text, size, subject, phaseSlug } = params;
  const filters = createSequenceFilters(subject, phaseSlug);
  return {
    index: resolveCurrentSearchIndexName('sequences'),
    size,
    rank: createSequenceRank(text),
    query: { bool: { filter: filters } },
  };
}

function createLessonRank(text: string): RrfRank {
  return {
    rrf: { window_size: 60, rank_constant: 60 },
    queries: [
      {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fields: [
            'lesson_title^3',
            'lesson_keywords^2',
            'key_learning_points^2',
            'misconceptions_and_common_mistakes',
            'teacher_tips',
            'content_guidance',
            'transcript_text',
          ],
        },
      },
      { semantic: { field: 'lesson_semantic', query: text } },
    ],
  } satisfies RrfRank;
}

function createUnitRank(text: string): RrfRank {
  return {
    rrf: { window_size: 60, rank_constant: 60 },
    queries: [
      {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fields: ['unit_title^3', 'rollup_text', 'unit_topics^1.5'],
        },
      },
      { semantic: { field: 'unit_semantic', query: text } },
    ],
  } satisfies RrfRank;
}

function createSequenceRank(text: string): RrfRank {
  return {
    rrf: { window_size: 40, rank_constant: 40 },
    queries: [
      {
        multi_match: {
          query: text,
          type: 'best_fields',
          fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
        },
      },
      { semantic: { field: 'sequence_semantic', query: text } },
    ],
  } satisfies RrfRank;
}

function createSequenceFilters(subject?: SearchSubjectSlug, phaseSlug?: string): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (phaseSlug) {
    filters.push({ term: { phase_slug: phaseSlug } });
  }
  return filters;
}
