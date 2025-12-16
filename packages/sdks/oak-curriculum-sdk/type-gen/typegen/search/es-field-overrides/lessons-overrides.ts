/**
 * Field overrides for the oak_lessons index.
 *
 * These overrides define ES-specific field configurations that cannot be automatically
 * derived from Zod types (e.g. text with analysers, completion with contexts, semantic_text).
 *
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075 - dense vectors removed.
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
  tier: {
    type: 'keyword',
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
