/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-meta
 * @description Elasticsearch mapping for the oak_meta index.
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
      doc_counts: {
        type: 'keyword',
      },
      duration_ms: {
        type: 'integer',
      },
    },
  },
} as const;

export type OakMetaMapping = typeof OAK_META_MAPPING;
