/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm sdk-codegen
 */

/**
 * Elasticsearch mapping for the oak_meta index.
 *
 * Contains ingestion metadata and version tracking.
 */

export const OAK_META_MAPPING = {
  mappings: {
    dynamic: 'strict',
    properties: {
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
        enabled: false,
      },
    },
  },
} as const;

export type OakMetaMapping = typeof OAK_META_MAPPING;
