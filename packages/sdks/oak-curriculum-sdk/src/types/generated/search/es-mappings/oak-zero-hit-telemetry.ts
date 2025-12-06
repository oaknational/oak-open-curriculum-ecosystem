/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-zero-hit-telemetry
 * @description Elasticsearch mapping for the oak_zero_hit_telemetry index.
 * Tracks zero-result search queries for content gap analysis.
 */

export const OAK_ZERO_HIT_MAPPING = {
  mappings: {
    dynamic: 'strict',
    properties: {
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
        enabled: false,
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
    },
  },
} as const;

export type OakZeroHitMapping = typeof OAK_ZERO_HIT_MAPPING;
