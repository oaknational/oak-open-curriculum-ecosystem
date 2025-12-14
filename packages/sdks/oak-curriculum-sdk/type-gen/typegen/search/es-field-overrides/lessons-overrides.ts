/**
 * @module es-field-overrides/lessons-overrides
 * @description Field overrides for the oak_lessons index.
 *
 * These overrides define ES-specific field configurations that cannot be automatically
 * derived from Zod types (e.g. text with analyzers, completion with contexts, dense_vector).
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
import { LESSONS_COMPLETION_CONTEXTS } from '../completion-contexts.js';
import {
  createCompletionContexts,
  textFieldWithAnalyzers,
  KEYWORD_SUBFIELD,
  SEARCH_AS_YOU_TYPE_SUBFIELD,
} from './common.js';

/**
 * Field overrides for the oak_lessons index.
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
  /**
   * Dense vector for lesson transcript content (384-dim E5).
   * Used in three-way hybrid search for semantic similarity on full lesson content.
   */
  lesson_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  /**
   * Dense vector for lesson title (384-dim E5).
   * Used for title-focused semantic similarity queries.
   */
  title_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
  tier: {
    type: 'keyword',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
