/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm sdk-codegen
 */

/**
 * Elasticsearch mapping for the oak_sequence_facets index.
 *
 * Contains sequence facet data for navigation and filtering.
 * Generated from SEQUENCE_FACETS_INDEX_FIELDS at sdk-codegen time.
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
      phase_title: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stages: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stage_title: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      years: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_slugs: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_count: {
        type: 'integer',
      },
      lesson_count: {
        type: 'integer',
      },
      has_ks4_options: {
        type: 'boolean',
      },
      sequence_canonical_url: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
    },
  },
} as const;

export type OakSequenceFacetsMapping = typeof OAK_SEQUENCE_FACETS_MAPPING;
