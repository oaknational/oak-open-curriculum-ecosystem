/**
 * @module es-field-overrides
 * @description Elasticsearch field override configurations for each index.
 *
 * These overrides define ES-specific field configurations that cannot be automatically
 * derived from Zod types (e.g. semantic_text, completion with contexts, text with analyzers).
 * The generator uses these configurations to produce the actual ES mapping TypeScript modules.
 *
 * This is SOURCE CODE - the generator consumes it to produce the generated mappings.
 */

import type { EsFieldMapping } from './es-field-config.js';

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
    contexts: [
      { name: 'subject', type: 'category' },
      { name: 'key_stage', type: 'category' },
    ],
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
 */
export const UNITS_FIELD_OVERRIDES = {
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
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_unit_rollup index.
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
    contexts: [
      { name: 'subject', type: 'category' },
      { name: 'key_stage', type: 'category' },
      { name: 'sequence', type: 'category' },
    ],
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
    contexts: [
      { name: 'subject', type: 'category' },
      { name: 'phase', type: 'category' },
    ],
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
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
