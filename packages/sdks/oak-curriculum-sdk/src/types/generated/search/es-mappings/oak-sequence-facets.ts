/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-sequence-facets
 * @description Elasticsearch mapping for the oak_sequence_facets index.
 * Contains sequence facet data for navigation.
 */

export const OAK_SEQUENCE_FACETS_MAPPING = {
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
      sequence_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      subject_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      phase_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stages: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      years: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_count: {
        type: 'integer',
      },
    },
  },
} as const;

export type OakSequenceFacetsMapping = typeof OAK_SEQUENCE_FACETS_MAPPING;
