/**
 * Field overrides for the oak_sequences index.
 */

import type { EsFieldMapping } from '../es-field-types.js';
import { SEQUENCES_COMPLETION_CONTEXTS } from '../completion-contexts.js';
import {
  createCompletionContexts,
  textFieldWithAnalyzers,
  KEYWORD_SUBFIELD,
  SEARCH_AS_YOU_TYPE_SUBFIELD,
} from './common.js';

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
