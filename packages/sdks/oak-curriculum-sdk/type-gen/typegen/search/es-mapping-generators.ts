/**
 * @module es-mapping-generators
 * @description Generators for primary search indexes with full ES settings.
 * These indexes use text analyzers for full-text search capabilities.
 */

import {
  LESSONS_FIELD_OVERRIDES,
  UNIT_ROLLUP_FIELD_OVERRIDES,
  SEQUENCES_FIELD_OVERRIDES,
  type EsFieldMapping,
} from './es-field-config.js';
import { HEADER, generateSettingsBlock, generatePropertiesBlock } from './es-mapping-utils.js';

// Re-export minimal generators for convenience
export {
  createUnitsMappingModule,
  createSequenceFacetsMappingModule,
  createMetaMappingModule,
} from './es-mapping-generators-minimal.js';

/**
 * Creates the oak_lessons mapping module.
 */
export function createLessonsMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['lesson_id', { type: 'keyword', normalizer: 'oak_lower' }],
    ['lesson_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['lesson_title', LESSONS_FIELD_OVERRIDES.lesson_title],
    ['title_suggest', LESSONS_FIELD_OVERRIDES.title_suggest],
    ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['key_stage', { type: 'keyword', normalizer: 'oak_lower' }],
    ['years', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_ids', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_titles', LESSONS_FIELD_OVERRIDES.unit_titles],
    ['unit_count', { type: 'integer' }],
    ['lesson_keywords', LESSONS_FIELD_OVERRIDES.lesson_keywords],
    ['key_learning_points', LESSONS_FIELD_OVERRIDES.key_learning_points],
    [
      'misconceptions_and_common_mistakes',
      LESSONS_FIELD_OVERRIDES.misconceptions_and_common_mistakes,
    ],
    ['teacher_tips', LESSONS_FIELD_OVERRIDES.teacher_tips],
    ['content_guidance', LESSONS_FIELD_OVERRIDES.content_guidance],
    ['transcript_text', LESSONS_FIELD_OVERRIDES.transcript_text],
    ['lesson_semantic', LESSONS_FIELD_OVERRIDES.lesson_semantic],
    ['lesson_url', LESSONS_FIELD_OVERRIDES.lesson_url],
    ['unit_urls', LESSONS_FIELD_OVERRIDES.unit_urls],
    ['thread_slugs', { type: 'keyword', normalizer: 'oak_lower' }],
    ['thread_titles', LESSONS_FIELD_OVERRIDES.thread_titles],
  ];

  return (
    HEADER +
    `/**
 * @module oak-lessons
 * @description Elasticsearch mapping for the oak_lessons index.
 * Contains lesson documents with semantic embeddings for hybrid search.
 */

export const OAK_LESSONS_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakLessonsMapping = typeof OAK_LESSONS_MAPPING;
`
  );
}

/**
 * Creates the oak_unit_rollup mapping module.
 */
export function createUnitRollupMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['unit_id', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_title', UNIT_ROLLUP_FIELD_OVERRIDES.unit_title],
    ['title_suggest', UNIT_ROLLUP_FIELD_OVERRIDES.title_suggest],
    ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['key_stage', { type: 'keyword', normalizer: 'oak_lower' }],
    ['years', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_topics', UNIT_ROLLUP_FIELD_OVERRIDES.unit_topics],
    ['lesson_ids', { type: 'keyword', normalizer: 'oak_lower' }],
    ['lesson_count', { type: 'integer' }],
    ['rollup_text', UNIT_ROLLUP_FIELD_OVERRIDES.rollup_text],
    ['unit_semantic', UNIT_ROLLUP_FIELD_OVERRIDES.unit_semantic],
    ['unit_url', UNIT_ROLLUP_FIELD_OVERRIDES.unit_url],
    ['subject_programmes_url', UNIT_ROLLUP_FIELD_OVERRIDES.subject_programmes_url],
    ['sequence_ids', { type: 'keyword', normalizer: 'oak_lower' }],
    ['thread_slugs', UNIT_ROLLUP_FIELD_OVERRIDES.thread_slugs],
    ['thread_titles', UNIT_ROLLUP_FIELD_OVERRIDES.thread_titles],
    ['thread_orders', UNIT_ROLLUP_FIELD_OVERRIDES.thread_orders],
  ];

  return (
    HEADER +
    `/**
 * @module oak-unit-rollup
 * @description Elasticsearch mapping for the oak_unit_rollup index.
 * Contains aggregated unit content for semantic search across lessons.
 */

export const OAK_UNIT_ROLLUP_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakUnitRollupMapping = typeof OAK_UNIT_ROLLUP_MAPPING;
`
  );
}

/**
 * Creates the oak_sequences mapping module.
 */
export function createSequencesMappingModule(): string {
  const fields: [string, EsFieldMapping][] = [
    ['sequence_id', { type: 'keyword', normalizer: 'oak_lower' }],
    ['sequence_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['sequence_title', SEQUENCES_FIELD_OVERRIDES.sequence_title],
    ['title_suggest', SEQUENCES_FIELD_OVERRIDES.title_suggest],
    ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['subject_title', { type: 'keyword', normalizer: 'oak_lower' }],
    ['phase_slug', { type: 'keyword', normalizer: 'oak_lower' }],
    ['phase_title', { type: 'keyword', normalizer: 'oak_lower' }],
    ['category_titles', SEQUENCES_FIELD_OVERRIDES.category_titles],
    ['key_stages', { type: 'keyword', normalizer: 'oak_lower' }],
    ['years', { type: 'keyword', normalizer: 'oak_lower' }],
    ['unit_slugs', { type: 'keyword', normalizer: 'oak_lower' }],
    ['sequence_semantic', SEQUENCES_FIELD_OVERRIDES.sequence_semantic],
    ['sequence_url', SEQUENCES_FIELD_OVERRIDES.sequence_url],
  ];

  return (
    HEADER +
    `/**
 * @module oak-sequences
 * @description Elasticsearch mapping for the oak_sequences index.
 * Contains programme sequence documents for navigation and search.
 */

export const OAK_SEQUENCES_MAPPING = {
${generateSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakSequencesMapping = typeof OAK_SEQUENCES_MAPPING;
`
  );
}
