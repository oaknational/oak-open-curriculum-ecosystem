/**
 * Field definitions for curriculum-related search indexes (lessons, units,
 * sequences, threads).
 *
 * These are the core educational content indexes. By defining fields ONCE in this
 * module, we ensure Zod schemas and ES mappings never diverge, eliminating
 * "mapper_parsing_exception" errors during bulk indexing.
 *
 * @see {@link ../field-definitions/observability.ts} for observability index definitions
 */

import type { IndexFieldDefinitions } from './types.js';
import { KS4_METADATA_FIELDS } from './ks4-metadata-fields.js';
import { UNIT_ENRICHMENT_FIELDS } from './unit-enrichment-fields.js';

/** Field definitions for the oak_threads search index. @see SearchThreadIndexDocSchema */
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
 * Contains 35 fields:
 * - 11 required fields (includes `has_transcript`)
 * - 24 optional fields (includes `lesson_content` for lessons without transcripts)
 *
 * KS4 metadata fields (tiers, exam_boards, exam_subjects, ks4_options) are arrays
 * to support many-to-many relationships. A lesson can appear in multiple tiers
 * (e.g., Foundation AND Higher) and multiple exam board sequences.
 *
 * @see SearchLessonsIndexDocSchema
 * @see OAK_LESSONS_MAPPING
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */
export const LESSONS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'lesson_id', zodType: 'string', optional: false },
  { name: 'lesson_slug', zodType: 'string', optional: false },
  { name: 'lesson_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  /** Parent subject for hierarchical filtering (e.g., physics → science). @see ADR-101 */
  { name: 'subject_parent', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  // Display title fields for UI (avoids slug-to-title lookup overhead)
  { name: 'subject_title', zodType: 'string', optional: true },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'key_stage_title', zodType: 'string', optional: true },
  /** Phase slug for curriculum filtering (primary/secondary). @see ADR for phase-aligned search. */
  { name: 'phase_slug', zodType: 'string', optional: true },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'unit_ids', zodType: 'array-string', optional: false },
  { name: 'unit_titles', zodType: 'array-string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: true },
  { name: 'lesson_keywords', zodType: 'array-string', optional: true },
  { name: 'key_learning_points', zodType: 'array-string', optional: true },
  { name: 'misconceptions_and_common_mistakes', zodType: 'array-string', optional: true },
  { name: 'teacher_tips', zodType: 'array-string', optional: true },
  { name: 'content_guidance', zodType: 'array-string', optional: true },
  /** Whether transcript is available. MFL/PE lessons often lack transcripts. @see ADR-094 */
  { name: 'has_transcript', zodType: 'boolean', optional: false },
  /** BM25 transcript text. Optional: omitted when no transcript to avoid index pollution. @see ADR-095 */
  { name: 'lesson_content', zodType: 'string', optional: true },
  { name: 'lesson_structure', zodType: 'string', optional: true },
  /** ELSER transcript text. Optional: same rationale as lesson_content. @see ADR-095 */
  { name: 'lesson_content_semantic', zodType: 'string', optional: true },
  { name: 'lesson_structure_semantic', zodType: 'string', optional: true },
  { name: 'lesson_url', zodType: 'string', optional: false },
  { name: 'unit_urls', zodType: 'array-string', optional: false },
  { name: 'thread_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_titles', zodType: 'array-string', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
  // Pupil lesson outcome - used for search result snippets and highlighting
  { name: 'pupil_lesson_outcome', zodType: 'string', optional: true },
  // Lesson metadata (from LessonSummaryResponseSchema)
  { name: 'supervision_level', zodType: 'string', optional: true },
  { name: 'downloads_available', zodType: 'boolean', optional: true },
  ...KS4_METADATA_FIELDS,
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_units search index.
 *
 * These definitions are the single source of truth for:
 * - `SearchUnitsIndexDocSchema` (Zod schema)
 * - `OAK_UNITS_MAPPING` (Elasticsearch mapping)
 *
 * Contains 27 fields:
 * - 10 required fields
 * - 17 optional fields
 *
 * KS4 metadata fields (tiers, exam_boards, exam_subjects, ks4_options) are arrays
 * to support many-to-many relationships. A unit can appear in multiple tiers
 * (e.g., Foundation AND Higher) and multiple exam board sequences.
 *
 * @see SearchUnitsIndexDocSchema
 * @see OAK_UNITS_MAPPING
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */
export const UNITS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'unit_id', zodType: 'string', optional: false },
  { name: 'unit_slug', zodType: 'string', optional: false },
  { name: 'unit_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  /** Parent subject for hierarchical filtering (e.g., physics → science). @see ADR-101 */
  { name: 'subject_parent', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  // Display title fields for UI (avoids slug-to-title lookup overhead)
  { name: 'subject_title', zodType: 'string', optional: true },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'key_stage_title', zodType: 'string', optional: true },
  /** Phase slug for curriculum filtering (primary/secondary). @see ADR for phase-aligned search. */
  { name: 'phase_slug', zodType: 'string', optional: true },
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
  // Unit enrichment fields from /units/{unit}/summary
  ...UNIT_ENRICHMENT_FIELDS,
  ...KS4_METADATA_FIELDS,
  { name: 'doc_type', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_unit_rollup search index.
 *
 * Contains 30 fields:
 * - 10 required fields
 * - 20 optional fields
 *
 * KS4 metadata fields (tiers, exam_boards, exam_subjects, ks4_options) are arrays
 * to support many-to-many relationships. A unit can appear in multiple tiers
 * (e.g., Foundation AND Higher) and multiple exam board sequences.
 *
 * @see SearchUnitRollupDocSchema
 * @see OAK_UNIT_ROLLUP_MAPPING
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */
export const UNIT_ROLLUP_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'unit_id', zodType: 'string', optional: false },
  { name: 'unit_slug', zodType: 'string', optional: false },
  { name: 'unit_title', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  /** Parent subject for hierarchical filtering (e.g., physics → science). @see ADR-101 */
  { name: 'subject_parent', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  // Display title fields for UI (avoids slug-to-title lookup overhead)
  { name: 'subject_title', zodType: 'string', optional: true },
  { name: 'key_stage', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'key_stage_title', zodType: 'string', optional: true },
  /** Phase slug for curriculum filtering (primary/secondary). @see ADR for phase-aligned search. */
  { name: 'phase_slug', zodType: 'string', optional: true },
  { name: 'years', zodType: 'array-string', optional: true },
  { name: 'lesson_ids', zodType: 'array-string', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'unit_topics', zodType: 'array-string', optional: true },
  // BM25 text fields for lexical search (content = aggregated transcripts, structure = curated summary)
  { name: 'unit_content', zodType: 'string', optional: false },
  { name: 'unit_structure', zodType: 'string', optional: true },
  // ELSER semantic fields (Phase 3 nomenclature: <entity>_content|structure_semantic)
  { name: 'unit_content_semantic', zodType: 'string', optional: true },
  { name: 'unit_structure_semantic', zodType: 'string', optional: true },
  { name: 'unit_url', zodType: 'string', optional: false },
  { name: 'subject_programmes_url', zodType: 'string', optional: false },
  { name: 'sequence_ids', zodType: 'array-string', optional: true },
  { name: 'thread_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_titles', zodType: 'array-string', optional: true },
  { name: 'thread_orders', zodType: 'array-number', optional: true },
  { name: 'title_suggest', zodType: 'object', optional: true },
  // Unit enrichment fields from /units/{unit}/summary
  ...UNIT_ENRICHMENT_FIELDS,
  ...KS4_METADATA_FIELDS,
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
 * Contains 13 fields (11 required, 2 optional). Provides faceted navigation data.
 * @see SearchSequenceFacetsIndexDocSchema @see OAK_SEQUENCE_FACETS_MAPPING
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
