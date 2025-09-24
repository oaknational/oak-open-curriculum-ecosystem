import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

type QueryContainer = estypes.QueryDslQueryContainer;

type LessonRank = {
  rrf: { window_size: number; rank_constant: number };
  queries: QueryContainer[];
};

type UnitRank = LessonRank;

type SequenceRank = LessonRank;

export interface LessonRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

export function buildLessonRrfRequest(params: LessonRrfParams): EsSearchRequest {
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

export interface UnitRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
}

export function buildUnitRrfRequest(params: UnitRrfParams): EsSearchRequest {
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

export interface SequenceRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  phaseSlug?: string;
}

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

function createLessonRank(text: string): LessonRank {
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
  } satisfies LessonRank;
}

function createLessonFilters(subject?: SearchSubjectSlug, keyStage?: KeyStage): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
  return filters;
}

function createLessonHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    order: 'score',
    boundary_scanner: 'sentence',
    fields: {
      transcript_text: {
        fragment_size: 160,
        number_of_fragments: 2,
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  } satisfies estypes.SearchHighlight;
}

function createLessonFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
  };
}

function createUnitRank(text: string): UnitRank {
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
  } satisfies UnitRank;
}

function createUnitFilters(
  subject?: SearchSubjectSlug,
  keyStage?: KeyStage,
  minLessons?: number,
): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
  if (typeof minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: minLessons } } });
  }
  return filters;
}

function createUnitHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    boundary_scanner: 'sentence',
    fields: {
      rollup_text: {
        fragment_size: 160,
        number_of_fragments: 2,
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  } satisfies estypes.SearchHighlight;
}

function createSequenceRank(text: string): SequenceRank {
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
  } satisfies SequenceRank;
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
