/**
 * RRF query helpers — filter builders, highlight configs, and score normalisation.
 */

import type { estypes } from '@elastic/elasticsearch';
import { isKs4ScienceVariant, SUBJECT_TO_PARENT } from '@oaknational/oak-curriculum-sdk';
import type { SearchLessonsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { SearchLessonsParams, SearchUnitsParams } from '../types/retrieval-params.js';
import type { EsHit } from '../internal/types.js';

type QueryContainer = estypes.QueryDslQueryContainer;

// ---------------------------------------------------------------------------
// Filter builders
// ---------------------------------------------------------------------------

/** Build lesson filters from search params. */
export function buildLessonFilters(params: SearchLessonsParams): QueryContainer[] {
  const filters: QueryContainer[] = [];
  addSubjectFilter(filters, params.subject, params.keyStage);
  addKeyStageFilter(filters, params.keyStage);
  addTermFilter(filters, 'unit_ids', params.unitSlug);
  addTierFilter(filters, params.tier);
  addTermsFilter(filters, 'exam_boards', params.examBoard);
  addTermsFilter(filters, 'exam_subjects', params.examSubject);
  addTermsFilter(filters, 'ks4_options', params.ks4Option);
  addTermsFilter(filters, 'years', params.year);
  addTermsFilter(filters, 'thread_slugs', params.threadSlug);
  return filters;
}

/** Build unit filters from search params. */
export function buildUnitFilters(params: SearchUnitsParams): QueryContainer[] {
  const filters: QueryContainer[] = [];
  addSubjectFilter(filters, params.subject, params.keyStage);
  addKeyStageFilter(filters, params.keyStage);
  if (typeof params.minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: params.minLessons } } });
  }
  return filters;
}

function addSubjectFilter(
  filters: QueryContainer[],
  subject: string | undefined,
  keyStage: string | undefined,
): void {
  if (!subject) {
    return;
  }
  const sf = buildSubjectFilter(subject, keyStage);
  filters.push({ term: { [sf.field]: sf.value } });
}

function addKeyStageFilter(filters: QueryContainer[], keyStage: string | undefined): void {
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
}

function addTermFilter(filters: QueryContainer[], field: string, value: string | undefined): void {
  if (value) {
    filters.push({ term: { [field]: value } });
  }
}

function addTermsFilter(filters: QueryContainer[], field: string, value: string | undefined): void {
  if (value) {
    filters.push({ terms: { [field]: [value] } });
  }
}

function addTierFilter(filters: QueryContainer[], tier: string | undefined): void {
  if (!tier) {
    return;
  }
  filters.push({
    bool: {
      should: [{ term: { tier } }, { terms: { tiers: [tier] } }],
      minimum_should_match: 1,
    },
  });
}

/** Smart subject filtering per ADR-101. */
function buildSubjectFilter(
  subject: string,
  keyStage: string | undefined,
): { field: string; value: string } {
  if (isKs4ScienceVariant(subject) && keyStage === 'ks4') {
    return { field: 'subject_slug', value: subject };
  }
  const parentSlug = lookupSubjectParent(subject);
  if (parentSlug) {
    return { field: 'subject_parent', value: parentSlug };
  }
  return { field: 'subject_slug', value: subject };
}

/** Safely look up the parent subject slug. */
function lookupSubjectParent(subject: string): string | undefined {
  if (!isKnownSubject(subject)) {
    return undefined;
  }
  return SUBJECT_TO_PARENT[subject];
}

function isKnownSubject(value: string): value is keyof typeof SUBJECT_TO_PARENT {
  return value in SUBJECT_TO_PARENT;
}

// ---------------------------------------------------------------------------
// Highlights
// ---------------------------------------------------------------------------

/** Lesson highlight configuration. */
export function buildLessonHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    order: 'score',
    boundary_scanner: 'sentence',
    fields: {
      lesson_content: {
        fragment_size: 160,
        number_of_fragments: 2,
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  };
}

/** Unit highlight configuration. */
export function buildUnitHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    boundary_scanner: 'sentence',
    fields: {
      unit_content: {
        fragment_size: 160,
        number_of_fragments: 2,
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Score normalisation
// ---------------------------------------------------------------------------

interface NormalisedHit {
  readonly _id: string;
  readonly _score: number;
  readonly _source: SearchLessonsIndexDoc;
  readonly _highlight?: Readonly<Record<string, readonly string[]>>;
}

/** Normalise RRF scores for transcript availability (ADR-099). */
export function normaliseTranscriptScores(
  hits: readonly EsHit<SearchLessonsIndexDoc>[],
): NormalisedHit[] {
  const mapped = hits.map((hit) => ({
    _id: hit._id,
    _score: hit._score ?? 0,
    _source: hit._source,
    _highlight: hit.highlight,
    has_transcript: hit._source.has_transcript,
  }));

  const normalised = mapped.map((doc) => {
    const factor = doc.has_transcript ? 1 : 2;
    return {
      _id: doc._id,
      _score: doc._score * factor,
      _source: doc._source,
      _highlight: doc._highlight,
    };
  });

  return normalised.sort((a, b) => b._score - a._score);
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

export function clampSize(size: number | undefined): number {
  return Math.min(Math.max(size ?? 25, 1), 100);
}

export function clampFrom(from: number | undefined): number {
  return typeof from === 'number' && from >= 0 ? from : 0;
}
