/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm sdk-codegen
 */

/**
 * Elasticsearch mapping for the oak_ref_key_stages index.
 *
 * Contains key stage metadata with aggregated counts for navigation and filtering.
 */

export const OAK_REF_KEY_STAGES_MAPPING = {
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
      key_stage_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stage_title: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
        fields: {
          keyword: {
            type: 'keyword',
            normalizer: 'oak_lower',
            ignore_above: 256,
          },
          sa: {
            type: 'search_as_you_type',
          },
        },
      },
      phase: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      years: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      subject_count: {
        type: 'integer',
      },
      unit_count: {
        type: 'integer',
      },
      lesson_count: {
        type: 'integer',
      },
    },
  },
} as const;

export type OakRefKeyStagesMapping = typeof OAK_REF_KEY_STAGES_MAPPING;
