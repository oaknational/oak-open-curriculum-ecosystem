/**
 * Field overrides for the oak_threads index.
 *
 * Threads represent curriculum progressions (e.g., Number, Algebra, Geometry)
 * that span multiple units and years. They provide a way to navigate the
 * curriculum by conceptual thread rather than by unit sequence.
 *
 * @see THREADS_INDEX_FIELDS - Single source of truth for field definitions
 * @see THREADS_COMPLETION_CONTEXTS - Contexts for completion suggestions
 */

import type { EsFieldMapping } from '../es-field-config.js';
import { THREADS_COMPLETION_CONTEXTS } from '../completion-contexts.js';
import {
  createCompletionContexts,
  textFieldWithAnalyzers,
  KEYWORD_SUBFIELD,
  SEARCH_AS_YOU_TYPE_SUBFIELD,
} from './common.js';

/**
 * Field overrides for the oak_threads index.
 *
 * These overrides configure ES-specific field types that cannot be automatically
 * derived from the Zod field types in THREADS_INDEX_FIELDS.
 *
 * @see THREADS_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const THREADS_FIELD_OVERRIDES = {
  /**
   * Thread title with full-text search capabilities.
   *
   * Includes keyword and search-as-you-type subfields for exact matching
   * and type-ahead search.
   */
  thread_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),

  /**
   * Completion field for thread title suggestions.
   *
   * Uses subject context only since threads span key stages.
   */
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(THREADS_COMPLETION_CONTEXTS),
  },

  /**
   * Semantic text field for ELSER-based semantic search.
   *
   * Enables semantic matching on thread content beyond keyword matching.
   */
  thread_semantic: {
    type: 'semantic_text',
  },

  /**
   * Thread URL as keyword for exact matching.
   *
   * Longer URLs are ignored to prevent index bloat.
   */
  thread_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
