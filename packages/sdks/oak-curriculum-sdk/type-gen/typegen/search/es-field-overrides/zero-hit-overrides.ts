/**
 * @module es-field-overrides/zero-hit-overrides
 * @description Field overrides for the oak_zero_hit_telemetry index.
 *
 * This index tracks zero-result search queries for content gap analysis.
 *
 * Key field configurations:
 * - `@timestamp`: ES date field for time-based queries and ILM
 * - `query`: text field with keyword subfield for both full-text and exact matching
 * - `filters`: flattened field for flexible filter structure without mapping bloat
 * - `took_ms`: long type (not integer) to handle potentially large timing values
 */

import type { EsFieldMapping } from '../es-field-config.js';

/**
 * Field overrides for the oak_zero_hit_telemetry index.
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
