/**
 * @module es-field-overrides/meta-overrides
 * @description Field overrides for the oak_meta index.
 *
 * This index stores ingestion metadata.
 */

import type { EsFieldMapping } from '../es-field-config.js';

/**
 * Field overrides for the oak_meta index.
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
