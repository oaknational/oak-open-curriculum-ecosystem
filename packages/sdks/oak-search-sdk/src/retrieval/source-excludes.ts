/**
 * Default _source exclude lists for each search index.
 *
 * These fields are used by Elasticsearch for scoring and matching but
 * are not needed in the response payload. Excluding them significantly
 * reduces response size without affecting relevance scoring.
 *
 * Lessons: ~186 KB to ~12 KB for 5 results (94% reduction).
 */

import type { EsSourceExcludes } from '../internal/types.js';

/** Fields excluded from lesson search responses (content + semantic + suggest). */
export const LESSON_SOURCE_EXCLUDES: EsSourceExcludes = {
  excludes: [
    'lesson_content',
    'lesson_content_semantic',
    'lesson_structure',
    'lesson_structure_semantic',
    'title_suggest',
  ],
};

/** Fields excluded from unit search responses (semantic + suggest). */
export const UNIT_SOURCE_EXCLUDES: EsSourceExcludes = {
  excludes: ['unit_content_semantic', 'unit_structure_semantic', 'title_suggest'],
};

/** Fields excluded from sequence search responses (semantic + suggest). */
export const SEQUENCE_SOURCE_EXCLUDES: EsSourceExcludes = {
  excludes: ['sequence_semantic', 'title_suggest'],
};

/** Fields excluded from thread search responses (semantic + suggest). */
export const THREAD_SOURCE_EXCLUDES: EsSourceExcludes = {
  excludes: ['thread_semantic', 'title_suggest'],
};
