/**
 * @module es-field-overrides/sequence-facets-overrides
 * @description Field overrides for the oak_sequence_facets index.
 *
 * This index uses normalizers for case-insensitive keyword matching on slug/identifier fields.
 * All fields are keywords (no text search) for exact filtering and faceted navigation.
 */

import type { EsFieldMapping } from '../es-field-config.js';

/**
 * Field overrides for the oak_sequence_facets index.
 */
export const SEQUENCE_FACETS_FIELD_OVERRIDES = {
  sequence_slug: { type: 'keyword', normalizer: 'oak_lower' },
  subject_slug: { type: 'keyword', normalizer: 'oak_lower' },
  phase_slug: { type: 'keyword', normalizer: 'oak_lower' },
  key_stages: { type: 'keyword', normalizer: 'oak_lower' },
  years: { type: 'keyword', normalizer: 'oak_lower' },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
