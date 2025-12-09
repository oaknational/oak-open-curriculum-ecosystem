/**
 * @module field-definitions/reference
 * @description Field definitions for reference data indexes.
 *
 * Reference indexes store metadata about curriculum entities (subjects, key stages, etc.)
 * that are used for navigation, autocomplete, and enrichment of primary content indexes.
 *
 * These indexes are distinguished from curriculum content indexes:
 * - **Reference indexes**: Store entity metadata with aggregated counts
 * - **Curriculum indexes**: Store educational content (lessons, units, sequences, threads)
 *
 * By defining fields ONCE in this module, we ensure that Zod schemas and ES mappings
 * can never diverge.
 *
 * @see {@link ./curriculum.ts} for curriculum content index definitions
 */

import type { IndexFieldDefinitions } from './types.js';

/**
 * Field definitions for the oak_ref_subjects reference index.
 *
 * Stores subject metadata with aggregated counts for navigation and filtering.
 * Subjects are the top-level curriculum organisation (Maths, English, Science, etc.).
 *
 * Contains 9 fields:
 * - 9 required fields
 * - 0 optional fields
 *
 * @see SearchRefSubjectsIndexDocSchema - Generated Zod schema
 * @see OAK_REF_SUBJECTS_MAPPING - Generated ES mapping
 */
export const REF_SUBJECTS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'subject_title', zodType: 'string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false },
  { name: 'sequence_count', zodType: 'number', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'has_tiers', zodType: 'boolean', optional: false },
  { name: 'has_exam_boards', zodType: 'boolean', optional: false },
  { name: 'subject_url', zodType: 'string', optional: false },
] as const;

/**
 * Field definitions for the oak_ref_key_stages reference index.
 *
 * Stores key stage metadata with aggregated counts for navigation and filtering.
 * Key stages are UK education phases (KS1, KS2, KS3, KS4).
 *
 * Contains 7 fields:
 * - 7 required fields
 * - 0 optional fields
 *
 * @see SearchRefKeyStagesIndexDocSchema - Generated Zod schema
 * @see OAK_REF_KEY_STAGES_MAPPING - Generated ES mapping
 */
export const REF_KEY_STAGES_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'key_stage_slug', zodType: 'string', optional: false, enumRef: 'KEY_STAGE_TUPLE' },
  { name: 'key_stage_title', zodType: 'string', optional: false },
  { name: 'phase', zodType: 'string', optional: false },
  { name: 'years', zodType: 'array-string', optional: false },
  { name: 'subject_count', zodType: 'number', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
] as const;

/**
 * Field definitions for the oak_curriculum_glossary reference index.
 *
 * Stores curriculum keywords with definitions for glossary lookups and enrichment.
 * Keywords are extracted from lessons and aggregated with usage statistics.
 *
 * Contains 9 fields:
 * - 6 required fields
 * - 3 optional fields
 *
 * @see SearchCurriculumGlossaryIndexDocSchema - Generated Zod schema
 * @see OAK_CURRICULUM_GLOSSARY_MAPPING - Generated ES mapping
 */
export const CURRICULUM_GLOSSARY_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'term', zodType: 'string', optional: false },
  { name: 'term_slug', zodType: 'string', optional: false },
  { name: 'definition', zodType: 'string', optional: true },
  { name: 'subject_slugs', zodType: 'array-string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false },
  { name: 'lesson_ids', zodType: 'array-string', optional: false },
  { name: 'usage_count', zodType: 'number', optional: false },
  { name: 'term_semantic', zodType: 'string', optional: true },
  { name: 'term_url', zodType: 'string', optional: true },
] as const;
