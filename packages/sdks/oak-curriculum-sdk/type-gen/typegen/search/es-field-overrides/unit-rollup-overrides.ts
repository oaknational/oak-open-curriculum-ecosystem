/**
 * @module es-field-overrides/unit-rollup-overrides
 * @description Field overrides for the oak_unit_rollup index.
 */

import type { EsFieldMapping } from '../es-field-config.js';
import { UNIT_ROLLUP_COMPLETION_CONTEXTS } from '../completion-contexts.js';
import {
  createCompletionContexts,
  textFieldWithAnalyzers,
  KEYWORD_SUBFIELD,
  SEARCH_AS_YOU_TYPE_SUBFIELD,
} from './common.js';

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
  unit_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  rollup_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  tier: {
    type: 'keyword',
  },
  exam_board: {
    type: 'keyword',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
