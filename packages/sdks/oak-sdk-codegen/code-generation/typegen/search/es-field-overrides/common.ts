/**
 * Shared helpers and constants for ES field override configurations.
 *
 * This module provides reusable field configuration builders and common constants
 * used across all index override modules.
 */

import type { EsFieldMapping } from '../es-field-types.js';
import type { CompletionContextName } from '../completion-contexts.js';

/**
 * Converts a readonly tuple of context names into ES completion context configs.
 *
 * @param contexts - Readonly tuple of context names from completion-contexts.ts
 * @returns Array of ES completion context configurations
 *
 * @example
 * ```typescript
 * createCompletionContexts(LESSONS_COMPLETION_CONTEXTS);
 * // Returns: [{ name: 'subject', type: 'category' }, { name: 'key_stage', type: 'category' }]
 * ```
 */
export function createCompletionContexts(
  contexts: readonly CompletionContextName[],
): readonly { name: string; type: 'category' }[] {
  return contexts.map((name) => ({ name, type: 'category' as const }));
}

/**
 * Creates a text field with Oak's standard analyzers.
 *
 * @param options - Optional field configuration options
 * @returns ES field mapping with Oak text analyzers
 *
 * @example
 * ```typescript
 * textFieldWithAnalyzers({ fields: { keyword: KEYWORD_SUBFIELD } });
 * // Returns: { type: 'text', analyzer: 'oak_text_index', search_analyzer: 'oak_text_search', fields: {...} }
 * ```
 */
export function textFieldWithAnalyzers(options?: {
  fields?: Readonly<Record<string, EsFieldMapping>>;
  term_vector?: string;
}): EsFieldMapping {
  return {
    type: 'text',
    analyzer: 'oak_text_index',
    search_analyzer: 'oak_text_search',
    ...options,
  };
}

/**
 * Keyword sub-field configuration for text fields.
 *
 * Used for exact matching and aggregations on text fields.
 */
export const KEYWORD_SUBFIELD: EsFieldMapping = {
  type: 'keyword',
  ignore_above: 256,
  normalizer: 'oak_lower',
};

/**
 * Search-as-you-type sub-field configuration.
 *
 * Used for type-ahead search on text fields.
 */
export const SEARCH_AS_YOU_TYPE_SUBFIELD: EsFieldMapping = {
  type: 'search_as_you_type',
};
