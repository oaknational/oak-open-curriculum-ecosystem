/**
 * @module field-definitions/curriculum
 * @description Field definitions for curriculum-related search indexes.
 *
 * This module contains field definitions for indexes that store Oak curriculum content:
 * lessons, units, sequences, and threads. These indexes represent the core educational
 * content that teachers and students interact with.
 *
 * Curriculum indexes are distinguished from observability indexes:
 * - **Curriculum indexes**: Store educational content (lessons, units, sequences, threads)
 * - **Observability indexes**: Store system behavior and operational data (metrics, logs, telemetry)
 *
 * By defining fields ONCE in this module, we ensure that Zod schemas and ES mappings
 * can never diverge, eliminating "mapper_parsing_exception" errors during bulk indexing.
 *
 * @see {@link ../field-definitions/observability.ts} for observability index definitions
 */

import type { IndexFieldDefinitions } from './types.js';

/**
 * Field definitions for the oak_threads search index.
 *
 * Contains 7 fields:
 * - 3 required fields
 * - 4 optional fields
 *
 * @see SearchThreadIndexDocSchema
 */
export const THREADS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'thread_slug', zodType: 'string', optional: false },
  { name: 'thread_title', zodType: 'string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'subject_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_semantic', zodType: 'string', optional: true },
  { name: 'thread_url', zodType: 'string', optional: false },
  { name: 'title_suggest', zodType: 'object', optional: true },
] as const;

/**
 * Field definitions for the oak_lessons search index.
 *
 * Contains 25 fields:
 * - 10 required fields
 * - 15 optional fields
 *
 * @see SearchLessonsIndexDocSchema
 * @see OAK_LESSONS_MAPPING
 */
export const LESSONS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'lesson_id', zodType: 'string', optional: false },
  { name: 'lesson_slug', zodType: 'string', optional: false },
  { name: 'lesson_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'unit_ids', zodType: 'array-string', optional: false },
  { name: 'unit_titles', zodType: 'array-string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: true },
  { name: 'lesson_keywords', zodType: 'array-string', optional: true },
  { name: 'key_learning_points', zodType: 'array-string', optional: true },
  { name: 'misconceptions_and_common_mistakes', zodType: 'array-string', optional: true },
  { name: 'teacher_tips', zodType: 'array-string', optional: true },
  { name: 'content_guidance', zodType: 'array-string', optional: true },
  { name: 'transcript_text', zodType: 'string', optional: false },
  { name: 'lesson_semantic', zodType: 'string', optional: true },
  { name: 'lesson_url', zodType: 'string', optional: false },
  { name: 'unit_urls', zodType: 'array-string', optional: false },
  { name: 'thread_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_titles', zodType: 'array-string', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
  { name: 'lesson_dense_vector', zodType: 'array-number', optional: true },
  { name: 'title_dense_vector', zodType: 'array-number', optional: true },
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_units search index.
 *
 * These definitions are the single source of truth for:
 * - `SearchUnitsIndexDocSchema` (Zod schema)
 * - `OAK_UNITS_MAPPING` (Elasticsearch mapping)
 *
 * Contains 16 fields:
 * - 9 required fields
 * - 7 optional fields
 *
 * @see SearchUnitsIndexDocSchema
 * @see OAK_UNITS_MAPPING
 */
export const UNITS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'unit_id', zodType: 'string', optional: false },
  { name: 'unit_slug', zodType: 'string', optional: false },
  { name: 'unit_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'lesson_ids', zodType: 'array-string', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'unit_topics', zodType: 'array-string', optional: true },
  { name: 'unit_url', zodType: 'string', optional: false },
  { name: 'subject_programmes_url', zodType: 'string', optional: false },
  { name: 'sequence_ids', zodType: 'array-string', optional: true },
  { name: 'thread_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_titles', zodType: 'array-string', optional: true },
  { name: 'thread_orders', zodType: 'array-number', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_unit_rollup search index.
 *
 * Contains 22 fields:
 * - 9 required fields
 * - 13 optional fields
 *
 * @see SearchUnitRollupDocSchema
 * @see OAK_UNIT_ROLLUP_MAPPING
 */
export const UNIT_ROLLUP_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'unit_id', zodType: 'string', optional: false },
  { name: 'unit_slug', zodType: 'string', optional: false },
  { name: 'unit_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'lesson_ids', zodType: 'array-string', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'unit_topics', zodType: 'array-string', optional: true },
  { name: 'rollup_text', zodType: 'string', optional: false },
  { name: 'unit_semantic', zodType: 'string', optional: true },
  { name: 'unit_url', zodType: 'string', optional: false },
  { name: 'subject_programmes_url', zodType: 'string', optional: false },
  { name: 'sequence_ids', zodType: 'array-string', optional: true },
  { name: 'thread_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_titles', zodType: 'array-string', optional: true },
  { name: 'thread_orders', zodType: 'array-number', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
  { name: 'unit_dense_vector', zodType: 'array-number', optional: true },
  { name: 'rollup_dense_vector', zodType: 'array-number', optional: true },
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_sequences search index.
 *
 * Contains 14 fields:
 * - 4 required fields
 * - 10 optional fields
 *
 * @see SearchSequenceIndexDocSchema
 * @see OAK_SEQUENCES_MAPPING
 */
export const SEQUENCES_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'sequence_id', zodType: 'string', optional: false },
  { name: 'sequence_slug', zodType: 'string', optional: false },
  { name: 'sequence_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'subject_title', zodType: 'string', optional: true },
  { name: 'phase_slug', zodType: 'string', optional: true },
  { name: 'phase_title', zodType: 'string', optional: true },
  { name: 'category_titles', zodType: 'array-string', optional: true },
  { name: 'key_stages', zodType: 'array-string', optional: true },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'unit_slugs', zodType: 'array-string', optional: true },
  { name: 'sequence_semantic', zodType: 'string', optional: true },
  { name: 'sequence_url', zodType: 'string', optional: false },
  { name: 'title_suggest', zodType: 'object', optional: true },
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_sequence_facets search index.
 *
 * Contains 13 fields:
 * - 11 required fields
 * - 2 optional fields
 *
 * This index provides faceted navigation data for sequences. Key design decisions:
 * - Uses `key_stages` (plural, array) to match sequences index pattern
 * - No completion contexts (navigation index, not searchable)
 * - Minimal text fields (all keywords for exact matching/filtering)
 *
 * @see SearchSequenceFacetsIndexDocSchema - Generated Zod schema
 * @see OAK_SEQUENCE_FACETS_MAPPING - Generated ES mapping
 */
export const SEQUENCE_FACETS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'sequence_slug', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'phase_slug', zodType: 'string', optional: false },
  { name: 'phase_title', zodType: 'string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false },
  { name: 'key_stage_title', zodType: 'string', optional: true },
  { name: 'years', zodType: 'array-string', optional: false },
  { name: 'unit_slugs', zodType: 'array-string', optional: false },
  { name: 'unit_titles', zodType: 'array-string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'has_ks4_options', zodType: 'boolean', optional: false },
  { name: 'sequence_canonical_url', zodType: 'string', optional: true },
] as const;
