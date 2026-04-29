/**
 * CLI-local filter and facet builders for hybrid search.
 *
 * These are CLI-specific because they handle phase expansion and rich
 * metadata filtering that the SDK's simpler filter builders do not support.
 * Retriever shapes, query processing, score processing, and highlights
 * are owned by the SDK (ADR-134).
 */

import type { estypes } from '@elastic/elasticsearch';
import { isKs4ScienceVariant, SUBJECT_TO_PARENT } from '@oaknational/curriculum-sdk';
import type { KeyStage, AllSubjectSlug } from '../../types/oak';
import { type Phase, buildKeyStageFilter, collectMetadataFilters } from './phase-filter-utils';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Filter options for lesson and unit queries. Array fields use OR logic within;
 * different fields use AND logic between them. Key stage filter precedence: `phases > keyStages > keyStage`
 */
export interface SearchFilterOptions {
  /** Subject filter - uses AllSubjectSlug to support KS4 science variants. @see ADR-101 */
  readonly subject?: AllSubjectSlug;
  readonly phase?: Phase;
  readonly phases?: readonly Phase[];
  readonly keyStage?: KeyStage;
  readonly keyStages?: readonly KeyStage[];
  readonly year?: string;
  readonly years?: readonly string[];
  readonly unitSlug?: string;
  readonly minLessons?: number;
  readonly tier?: string;
  readonly tiers?: readonly string[];
  readonly examBoard?: string;
  readonly examBoards?: readonly string[];
  readonly examSubject?: string;
  readonly ks4Option?: string;
  readonly threadSlug?: string;
  readonly category?: string;
}

/**
 * Determines which field to use for subject filtering (ADR-101 smart filtering).
 *
 * For KS4 science variants at KS4: use `subject_slug` for specific matching.
 * For all other cases: use `subject_parent` for broad matching.
 */
function buildSubjectFilter(
  subject: AllSubjectSlug,
  keyStage: KeyStage | undefined,
): { field: 'subject_slug' | 'subject_parent'; value: string } {
  if (isKs4ScienceVariant(subject) && keyStage === 'ks4') {
    return { field: 'subject_slug', value: subject };
  }
  return { field: 'subject_parent', value: SUBJECT_TO_PARENT[subject] };
}

/** Creates filters for lesson queries. */
export function createLessonFilters(options: SearchFilterOptions): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (options.subject) {
    const subjectFilter = buildSubjectFilter(options.subject, options.keyStage);
    filters.push({ term: { [subjectFilter.field]: subjectFilter.value } });
  }
  const keyStageFilter = buildKeyStageFilter(options);
  if (keyStageFilter) {
    filters.push(keyStageFilter);
  }
  if (options.unitSlug) {
    filters.push({ term: { unit_ids: options.unitSlug } });
  }
  filters.push(...collectMetadataFilters(options));
  return filters;
}

/** Creates filters for unit queries. */
export function createUnitFilters(options: SearchFilterOptions): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (options.subject) {
    const subjectFilter = buildSubjectFilter(options.subject, options.keyStage);
    filters.push({ term: { [subjectFilter.field]: subjectFilter.value } });
  }
  const keyStageFilter = buildKeyStageFilter(options);
  if (keyStageFilter) {
    filters.push(keyStageFilter);
  }
  if (typeof options.minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: options.minLessons } } });
  }
  filters.push(...collectMetadataFilters(options));
  return filters;
}

/**
 * Creates facet aggregations for lesson queries.
 *
 * Includes programme factors (tier) for KS4 filtering.
 */
export function createLessonFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
  };
}

/**
 * Creates facet aggregations for unit queries.
 *
 * @see ADR-097 Context Enrichment Architecture
 */
export function createUnitFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
    topics: { terms: { field: 'unit_topics.keyword', size: 30 } },
  };
}
