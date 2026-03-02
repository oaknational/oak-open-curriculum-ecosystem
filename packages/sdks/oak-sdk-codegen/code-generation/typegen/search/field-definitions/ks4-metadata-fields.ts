/**
 * Shared KS4 metadata fields for lesson, unit, and rollup indexes.
 *
 * These fields support many-to-many relationships between documents and
 * KS4 programme factors (tiers, exam boards, etc.).
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { IndexFieldDefinitions } from './types.js';

/**
 * KS4 metadata arrays shared across lessons, units, and unit_rollup indexes.
 * These fields support many-to-many relationships per ADR-080.
 */
export const KS4_METADATA_FIELDS: IndexFieldDefinitions = [
  { name: 'tiers', zodType: 'array-string', optional: true },
  { name: 'tier_titles', zodType: 'array-string', optional: true },
  { name: 'exam_boards', zodType: 'array-string', optional: true },
  { name: 'exam_board_titles', zodType: 'array-string', optional: true },
  { name: 'exam_subjects', zodType: 'array-string', optional: true },
  { name: 'exam_subject_titles', zodType: 'array-string', optional: true },
  { name: 'ks4_options', zodType: 'array-string', optional: true },
  { name: 'ks4_option_titles', zodType: 'array-string', optional: true },
] as const;
