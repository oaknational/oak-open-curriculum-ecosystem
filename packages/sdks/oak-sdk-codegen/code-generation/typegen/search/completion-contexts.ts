/**
 * Single source of truth for per-index completion context definitions.
 *
 * This module defines the exact completion contexts allowed for each search index.
 * Both the Zod schema generator and ES mapping generator consume these definitions,
 * ensuring compile-time enforcement that documents only include valid contexts.
 *
 * **Cardinal Rule Compliance**: These definitions flow to generated code at sdk-codegen time.
 * Running `pnpm sdk-codegen` regenerates all dependent schemas and mappings.
 *
 * @example
 * ```typescript
 * import { LESSONS_COMPLETION_CONTEXTS } from './completion-contexts.js';
 *
 * // Use in Zod generator to create per-index completion schemas
 * // Use in ES mapping generator to create completion field contexts
 * ```
 */

/**
 * All valid completion context names across all indexes.
 *
 * This is the union of all possible context names. Individual indexes
 * use subsets of these as defined in their specific context arrays.
 */
export const ALL_COMPLETION_CONTEXTS = ['subject', 'key_stage', 'sequence', 'phase'] as const;

/**
 * A valid completion context name.
 *
 * @example 'subject' | 'key_stage' | 'sequence' | 'phase'
 */
export type CompletionContextName = (typeof ALL_COMPLETION_CONTEXTS)[number];

/**
 * Type guard to check if a value is a valid completion context name.
 *
 * @param value - The value to check
 * @returns True if the value is a valid CompletionContextName
 *
 * @example
 * ```typescript
 * if (isValidCompletionContext(contextName)) {
 *   // contextName is typed as CompletionContextName
 * }
 * ```
 */
export function isValidCompletionContext(value: unknown): value is CompletionContextName {
  if (typeof value !== 'string') {
    return false;
  }
  // Check against the known context names without type assertion
  return ALL_COMPLETION_CONTEXTS.some((ctx) => ctx === value);
}

/**
 * Completion contexts for the oak_lessons index.
 *
 * Lessons are filtered by subject and key stage.
 * They do NOT use sequence context (that's at the unit level).
 *
 * @see LESSONS_FIELD_OVERRIDES - ES mapping overrides consuming this
 * @see SearchLessonsCompletionContextsSchema - Generated Zod schema
 */
export const LESSONS_COMPLETION_CONTEXTS = ['subject', 'key_stage'] as const;

/**
 * Type representing the allowed contexts for lessons completion.
 */
export type LessonsCompletionContext = (typeof LESSONS_COMPLETION_CONTEXTS)[number];

/**
 * Completion contexts for the oak_units index.
 *
 * Units are filtered by subject, key stage, and sequence (programme).
 *
 * @see UNITS_FIELD_OVERRIDES - ES mapping overrides consuming this
 * @see SearchUnitsCompletionContextsSchema - Generated Zod schema
 */
export const UNITS_COMPLETION_CONTEXTS = ['subject', 'key_stage', 'sequence'] as const;

/**
 * Type representing the allowed contexts for units completion.
 */
export type UnitsCompletionContext = (typeof UNITS_COMPLETION_CONTEXTS)[number];

/**
 * Completion contexts for the oak_unit_rollup index.
 *
 * Unit rollups have the same context structure as units.
 *
 * @see UNIT_ROLLUP_FIELD_OVERRIDES - ES mapping overrides consuming this
 * @see SearchUnitRollupCompletionContextsSchema - Generated Zod schema
 */
export const UNIT_ROLLUP_COMPLETION_CONTEXTS = ['subject', 'key_stage', 'sequence'] as const;

/**
 * Type representing the allowed contexts for unit rollup completion.
 */
export type UnitRollupCompletionContext = (typeof UNIT_ROLLUP_COMPLETION_CONTEXTS)[number];

/**
 * Completion contexts for the oak_sequences index.
 *
 * Sequences (programmes) are filtered by subject and phase.
 * They use phase instead of key_stage for broader grouping.
 *
 * @see SEQUENCES_FIELD_OVERRIDES - ES mapping overrides consuming this
 * @see SearchSequenceCompletionContextsSchema - Generated Zod schema
 */
export const SEQUENCES_COMPLETION_CONTEXTS = ['subject', 'phase'] as const;

/**
 * Type representing the allowed contexts for sequences completion.
 */
export type SequencesCompletionContext = (typeof SEQUENCES_COMPLETION_CONTEXTS)[number];

/**
 * Completion contexts for the oak_threads index.
 *
 * Threads are filtered by subject only (they span key stages).
 *
 * @see SearchThreadCompletionContextsSchema - Generated Zod schema
 */
export const THREADS_COMPLETION_CONTEXTS = ['subject'] as const;

/**
 * Type representing the allowed contexts for threads completion.
 */
export type ThreadsCompletionContext = (typeof THREADS_COMPLETION_CONTEXTS)[number];

/**
 * Index name to completion contexts mapping.
 *
 * This provides a type-safe lookup for getting contexts by index name.
 * Used by generators to retrieve the correct contexts for each index.
 */
export const INDEX_COMPLETION_CONTEXTS = {
  lessons: LESSONS_COMPLETION_CONTEXTS,
  units: UNITS_COMPLETION_CONTEXTS,
  unit_rollup: UNIT_ROLLUP_COMPLETION_CONTEXTS,
  sequences: SEQUENCES_COMPLETION_CONTEXTS,
  threads: THREADS_COMPLETION_CONTEXTS,
} as const;

/**
 * Index names that have completion contexts defined.
 */
export type IndexWithCompletion = keyof typeof INDEX_COMPLETION_CONTEXTS;

/**
 * Gets the completion contexts for a given index name.
 *
 * @param indexName - The index name (e.g., 'lessons', 'units')
 * @returns The readonly tuple of context names for that index
 *
 * @example
 * ```typescript
 * const contexts = getCompletionContextsForIndex('lessons');
 * // Returns: readonly ['subject', 'key_stage']
 * ```
 */
export function getCompletionContextsForIndex(
  indexName: IndexWithCompletion,
): readonly CompletionContextName[] {
  return INDEX_COMPLETION_CONTEXTS[indexName];
}
