/**
 * Shared unit enrichment fields for unit and rollup indexes.
 *
 * These fields provide pedagogical context and curriculum alignment data.
 */

import type { IndexFieldDefinitions } from './types.js';

/**
 * Unit enrichment fields from `/units/\{unit\}/summary` API endpoint.
 * These are included in both UNITS_INDEX_FIELDS and UNIT_ROLLUP_INDEX_FIELDS.
 */
export const UNIT_ENRICHMENT_FIELDS: IndexFieldDefinitions = [
  { name: 'description', zodType: 'string', optional: true },
  { name: 'why_this_why_now', zodType: 'string', optional: true },
  { name: 'categories', zodType: 'array-string', optional: true },
  { name: 'prior_knowledge_requirements', zodType: 'array-string', optional: true },
  { name: 'national_curriculum_content', zodType: 'array-string', optional: true },
] as const;
