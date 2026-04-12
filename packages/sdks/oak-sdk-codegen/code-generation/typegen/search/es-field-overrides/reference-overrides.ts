/**
 * Field overrides for reference data indexes.
 *
 * Reference indexes store metadata about curriculum entities with aggregated counts.
 * They use minimal ES settings (no text analysers) since they are primarily used
 * for navigation, filtering, and enrichment rather than full-text search.
 *
 * @see REF_SUBJECTS_INDEX_FIELDS - Subject reference field definitions
 * @see REF_KEY_STAGES_INDEX_FIELDS - Key stage reference field definitions
 * @see CURRICULUM_GLOSSARY_INDEX_FIELDS - Glossary field definitions
 */

import type { EsFieldMapping } from '../es-field-types.js';
import { textFieldWithAnalyzers, KEYWORD_SUBFIELD, SEARCH_AS_YOU_TYPE_SUBFIELD } from './common.js';

/**
 * Field overrides for the oak_ref_subjects reference index.
 *
 * Subject reference data uses keyword fields for exact matching and filtering.
 * The subject_title field has text subfields for partial matching.
 */
export const REF_SUBJECTS_FIELD_OVERRIDES = {
  /**
   * Subject title with full-text search capabilities.
   */
  subject_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),

  /**
   * Subject URL as keyword for exact matching.
   */
  subject_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_ref_key_stages reference index.
 *
 * Key stage reference data uses keyword fields for exact matching and filtering.
 */
export const REF_KEY_STAGES_FIELD_OVERRIDES = {
  /**
   * Key stage title with full-text search capabilities.
   */
  key_stage_title: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),
} as const satisfies Readonly<Record<string, EsFieldMapping>>;

/**
 * Field overrides for the oak_curriculum_glossary reference index.
 *
 * Glossary terms need text search on the term and definition fields,
 * plus semantic search for concept matching.
 */
export const CURRICULUM_GLOSSARY_FIELD_OVERRIDES = {
  /**
   * Term with full-text search capabilities.
   */
  term: textFieldWithAnalyzers({
    fields: {
      keyword: KEYWORD_SUBFIELD,
      sa: SEARCH_AS_YOU_TYPE_SUBFIELD,
    },
  }),

  /**
   * Definition with full-text search capabilities.
   */
  definition: textFieldWithAnalyzers(),

  /**
   * Semantic text field for ELSER-based semantic search on glossary terms.
   */
  term_semantic: {
    type: 'semantic_text',
  },

  /**
   * Term URL as keyword for exact matching.
   */
  term_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
