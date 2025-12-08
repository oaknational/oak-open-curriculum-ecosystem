/**
 * @module es-field-overrides
 * @description Elasticsearch field override configurations for each index.
 *
 * These overrides define ES-specific field configurations that cannot be automatically
 * derived from Zod types (e.g. semantic_text, completion with contexts, text with analyzers).
 * The generator uses these configurations to produce the actual ES mapping TypeScript modules.
 *
 * **Single Source of Truth**: Completion contexts are imported from `completion-contexts.ts`
 * to ensure ES mappings and Zod schemas stay in lockstep.
 *
 * This is SOURCE CODE - the generator consumes it to produce the generated mappings.
 */

// Re-export all field override constants
export { LESSONS_FIELD_OVERRIDES } from './lessons-overrides.js';
export { UNITS_FIELD_OVERRIDES } from './units-overrides.js';
export { UNIT_ROLLUP_FIELD_OVERRIDES } from './unit-rollup-overrides.js';
export { SEQUENCES_FIELD_OVERRIDES } from './sequences-overrides.js';
export { SEQUENCE_FACETS_FIELD_OVERRIDES } from './sequence-facets-overrides.js';
export { META_FIELD_OVERRIDES } from './meta-overrides.js';
export { ZERO_HIT_FIELD_OVERRIDES } from './zero-hit-overrides.js';

// Re-export common helpers for use by other modules
export {
  createCompletionContexts,
  textFieldWithAnalyzers,
  KEYWORD_SUBFIELD,
  SEARCH_AS_YOU_TYPE_SUBFIELD,
} from './common.js';
