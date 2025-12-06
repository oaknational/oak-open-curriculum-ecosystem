/* eslint-disable max-lines */
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

import type { EsFieldMapping } from './es-field-config.js';
import {
  LESSONS_COMPLETION_CONTEXTS,
  UNITS_COMPLETION_CONTEXTS,
  UNIT_ROLLUP_COMPLETION_CONTEXTS,
  SEQUENCES_COMPLETION_CONTEXTS,
  type CompletionContextName,
} from './completion-contexts.js';

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
function createCompletionContexts(
  contexts: readonly CompletionContextName[],
): readonly { name: string; type: 'category' }[] {
  return contexts.map((name) => ({ name, type: 'category' as const }));
}

/**
 * Creates a text field with Oak's standard analyzers.
 */
function textFieldWithAnalyzers(options?: {
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
 */
const KEYWORD_SUBFIELD: EsFieldMapping = {
  type: 'keyword',
  ignore_above: 256,
  normalizer: 'oak_lower',
};

/**
 * Search-as-you-type sub-field configuration.
 */
const SEARCH_AS_YOU_TYPE_SUBFIELD: EsFieldMapping = {
  type: 'search_as_you_type',
};

/**
 * Field overrides for the oak_lessons index.
 * These override the default Zod-to-ES type mapping with ES-specific configurations.
 *
 * @see LESSONS_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const LESSONS_FIELD_OVERRIDES = {
  lesson_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(LESSONS_COMPLETION_CONTEXTS),
  },
  unit_titles: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
    },
  }),
  lesson_keywords: textFieldWithAnalyzers(),
  key_learning_points: textFieldWithAnalyzers(),
  misconceptions_and_common_mistakes: textFieldWithAnalyzers(),
  teacher_tips: textFieldWithAnalyzers(),
  content_guidance: textFieldWithAnalyzers(),
  transcript_text: textFieldWithAnalyzers({
    term_vector: 'with_positions_offsets',
  }),
  lesson_semantic: {
    type: 'semantic_text',
  },
  lesson_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  unit_urls: {
    type: 'keyword',
    ignore_above: 1024,
  },
  thread_titles: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
    },
  }),
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_units index.
 *
 * @see UNITS_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const UNITS_FIELD_OVERRIDES = {
  unit_title: {
    type: 'text',
    analyzer: 'standard',
  },
  unit_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  subject_programmes_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  thread_slugs: {
    type: 'keyword',
    normalizer: 'oak_lower',
  },
  thread_titles: {
    type: 'keyword',
    normalizer: 'oak_lower',
  },
  thread_orders: {
    type: 'integer',
  },
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(UNITS_COMPLETION_CONTEXTS),
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_unit_rollup index.
 *
 * @see UNIT_ROLLUP_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const UNIT_ROLLUP_FIELD_OVERRIDES = {
  unit_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(UNIT_ROLLUP_COMPLETION_CONTEXTS),
  },
  unit_topics: textFieldWithAnalyzers(),
  rollup_text: textFieldWithAnalyzers({
    term_vector: 'with_positions_offsets',
  }),
  unit_semantic: {
    type: 'semantic_text',
  },
  unit_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  subject_programmes_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  thread_slugs: {
    type: 'keyword',
    normalizer: 'oak_lower',
  },
  thread_titles: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
    },
  }),
  thread_orders: {
    type: 'integer',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_sequences index.
 *
 * @see SEQUENCES_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const SEQUENCES_FIELD_OVERRIDES = {
  sequence_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(SEQUENCES_COMPLETION_CONTEXTS),
  },
  category_titles: textFieldWithAnalyzers(),
  sequence_semantic: {
    type: 'semantic_text',
  },
  sequence_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_sequence_facets index.
 * This index has minimal overrides as it's primarily keyword-based.
 */
export const SEQUENCE_FACETS_FIELD_OVERRIDES = {} as const satisfies Readonly<
  Record<string, EsFieldMapping>
>;

/**
 * Field overrides for the oak_meta index.
 * This index stores ingestion metadata.
 */
export const META_FIELD_OVERRIDES = {
  version: {
    type: 'keyword',
  },
  ingested_at: {
    type: 'date',
  },
  subjects: {
    type: 'keyword',
  },
  key_stages: {
    type: 'keyword',
  },
  duration_ms: {
    type: 'integer',
  },
  doc_counts: {
    type: 'object',
    enabled: false, // Store as-is without indexing internal structure
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_zero_hit_telemetry index.
 * This index tracks zero-result search queries for content gap analysis.
 *
 * Key field configurations:
 * - `@timestamp`: ES date field for time-based queries and ILM
 * - `query`: text field with keyword subfield for both full-text and exact matching
 * - `filters`: flattened field for flexible filter structure without mapping bloat
 * - `took_ms`: long type (not integer) to handle potentially large timing values
 */
export const ZERO_HIT_FIELD_OVERRIDES = {
  '@timestamp': {
    type: 'date',
  },
  search_scope: {
    type: 'keyword',
  },
  query: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  filters: {
    type: 'object',
    enabled: false, // Store filter structure as-is for audit without indexing
  },
  index_version: {
    type: 'keyword',
  },
  request_id: {
    type: 'keyword',
  },
  session_id: {
    type: 'keyword',
  },
  took_ms: {
    type: 'long',
  },
  timed_out: {
    type: 'boolean',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
