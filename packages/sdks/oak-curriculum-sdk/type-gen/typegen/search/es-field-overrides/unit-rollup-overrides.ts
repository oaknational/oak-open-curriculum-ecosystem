/**
 * @module es-field-overrides/unit-rollup-overrides
 * @description Field overrides for the oak_unit_rollup index.
 *
 * ## Dense Vector Naming Convention
 *
 * Dense vectors use the pattern `{content_type}_dense_vector` to clearly identify
 * what content was embedded:
 *
 * - **Lessons index**: `lesson_dense_vector` (transcript content), `title_dense_vector` (lesson title)
 * - **Unit rollup index**: `unit_dense_vector` (unit title), `rollup_dense_vector` (aggregated transcript text)
 *
 * This semantic naming ensures clarity about what each vector represents for kNN search.
 * All vectors use 384-dimensional E5 embeddings via `.multilingual-e5-small-elasticsearch`.
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
  /**
   * Dense vector for unit title (384-dim E5).
   * Used for title-focused semantic similarity in three-way hybrid search.
   */
  unit_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  /**
   * Dense vector for aggregated rollup text (384-dim E5).
   * Contains embedded representation of all lesson transcripts in this unit.
   * Used in three-way hybrid search for semantic similarity on unit-level content.
   */
  rollup_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  tier: {
    type: 'keyword',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
