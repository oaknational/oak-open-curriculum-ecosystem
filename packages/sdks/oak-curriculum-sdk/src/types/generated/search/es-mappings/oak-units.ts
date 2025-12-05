/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-units
 * @description Elasticsearch mapping for the oak_units index.
 * Contains basic unit metadata for filtering and navigation.
 */

export const OAK_UNITS_MAPPING = {
  settings: {
    analysis: {
      normalizer: {
        oak_lower: {
          type: 'custom',
          filter: ['lowercase', 'asciifolding'],
        },
      },
    },
  },
  mappings: {
    dynamic: 'strict',
    properties: {
      unit_id: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_title: {
        type: 'text',
        analyzer: 'standard',
      },
      subject_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stage: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      years: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      lesson_ids: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      lesson_count: {
        type: 'integer',
      },
      unit_topics: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
      subject_programmes_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
      sequence_ids: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      thread_slugs: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      thread_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      thread_orders: {
        type: 'integer',
      },
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'key_stage', type: 'category' },
          { name: 'sequence', type: 'category' },
        ],
      },
    },
  },
} as const;

export type OakUnitsMapping = typeof OAK_UNITS_MAPPING;
