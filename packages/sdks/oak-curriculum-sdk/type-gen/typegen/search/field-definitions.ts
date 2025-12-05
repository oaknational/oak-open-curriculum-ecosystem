/**
 * @module field-definitions
 * @description Shared field definitions for search indexes.
 *
 * This module defines the canonical field definitions that are consumed by both:
 * - The Zod schema generator (for runtime validation)
 * - The ES mapping generator (for Elasticsearch index configuration)
 *
 * By defining fields ONCE in this module, we ensure that Zod schemas and ES mappings
 * can never diverge, eliminating "mapper_parsing_exception" errors during bulk indexing.
 *
 * @example
 * ```typescript
 * import { UNITS_INDEX_FIELDS } from './field-definitions.js';
 *
 * // Use in Zod generator
 * const zodSchema = generateZodSchemaFromFields('SearchUnitsIndexDocSchema', UNITS_INDEX_FIELDS);
 *
 * // Use in ES mapping generator
 * const esFields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);
 * ```
 */

/**
 * Zod type identifier for field definitions.
 *
 * Maps to Zod schema builders:
 * - `string` → `z.string().min(1)`
 * - `number` → `z.number().int().nonnegative()`
 * - `array-string` → `z.array(z.string().min(1))`
 * - `array-number` → `z.array(z.number())`
 * - `object` → References a specific schema (e.g., SearchCompletionSuggestPayloadSchema)
 */
export type ZodFieldType = 'string' | 'number' | 'array-string' | 'array-number' | 'object';

/**
 * Definition for a single field in a search index document.
 *
 * This interface captures all information needed to generate both:
 * - A Zod schema field for runtime validation
 * - An Elasticsearch mapping field for index configuration
 *
 * @property name - The field name as it appears in documents
 * @property zodType - The Zod type category for this field
 * @property optional - Whether the field is optional (affects `.optional()` in Zod)
 * @property enumRef - Optional reference to an enum tuple (e.g., 'SUBJECT_TUPLE')
 */
export interface FieldDefinition {
  /** The field name as it appears in documents and mappings. */
  readonly name: string;

  /** The Zod type category for schema generation. */
  readonly zodType: ZodFieldType;

  /** Whether this field is optional in the document schema. */
  readonly optional: boolean;

  /**
   * Optional reference to an enum tuple constant name.
   * When specified, the Zod generator will use `z.enum(${enumRef})` instead of `z.string()`.
   * @example 'SUBJECT_TUPLE' | 'KEY_STAGE_TUPLE'
   */
  readonly enumRef?: string;
}

/**
 * A readonly array of field definitions representing all fields in a search index.
 *
 * @example
 * ```typescript
 * const fields: IndexFieldDefinitions = [
 *   { name: 'id', zodType: 'string', optional: false },
 *   { name: 'tags', zodType: 'array-string', optional: true },
 * ] as const;
 * ```
 */
export type IndexFieldDefinitions = readonly FieldDefinition[];

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
 * Contains 21 fields:
 * - 10 required fields
 * - 11 optional fields
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
] as const;

/**
 * Field definitions for the oak_unit_rollup search index.
 *
 * Contains 18 fields:
 * - 9 required fields
 * - 9 optional fields
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
] as const;

