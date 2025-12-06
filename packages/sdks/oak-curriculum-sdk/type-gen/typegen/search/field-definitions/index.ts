/**
 * @module field-definitions
 * @description Aggregated field definitions for all search indexes.
 *
 * This module re-exports field definitions from specialized modules:
 * - **curriculum**: Educational content indexes (lessons, units, sequences, threads)
 * - **observability**: System behavior indexes (meta, zero-hit telemetry)
 *
 * By organizing field definitions into separate concerns, we maintain clarity
 * about the purpose of each index while preserving backward compatibility for
 * code that imports from this barrel module.
 *
 * ## Single Source of Truth
 *
 * Field definitions defined here are consumed by:
 * 1. **Zod schema generators** → Runtime validation
 * 2. **ES mapping generators** → Elasticsearch index configuration
 *
 * This ensures Zod schemas and ES mappings can never diverge, eliminating
 * `mapper_parsing_exception` and `strict_dynamic_mapping_exception` errors.
 *
 * @example
 * ```typescript
 * // Import specific index fields
 * import { LESSONS_INDEX_FIELDS } from './field-definitions/index.js';
 *
 * // Import by category
 * import { LESSONS_INDEX_FIELDS } from './field-definitions/curriculum.js';
 * import { META_INDEX_FIELDS } from './field-definitions/observability.js';
 * ```
 */

// Re-export shared types
export type { ZodFieldType, FieldDefinition, IndexFieldDefinitions } from './types.js';

// Re-export curriculum index fields
export {
  THREADS_INDEX_FIELDS,
  LESSONS_INDEX_FIELDS,
  UNITS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
} from './curriculum.js';

// Re-export observability index fields
export { META_INDEX_FIELDS, ZERO_HIT_INDEX_FIELDS } from './observability.js';
