/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-ref-subjects
 * @description Elasticsearch mapping for the oak_ref_subjects index.
 * Contains subject metadata with aggregated counts for navigation and filtering.
 */

export const OAK_REF_SUBJECTS_MAPPING = {
  settings: {
    analysis: {
      normalizer: {
        oak_lower: {
          type: 'custom',
          filter: ['lowercase', 'asciifolding'],
        },
      },
      filter: {
        oak_syns_filter: {
          type: 'synonym_graph',
          synonyms_set: 'oak-syns',
          updateable: true,
        },
      },
      analyzer: {
        oak_text_index: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase'],
        },
        oak_text_search: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'oak_syns_filter'],
        },
      },
    },
  },
  mappings: {
    dynamic: 'strict',
    properties: {
      subject_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      subject_title: {
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
      key_stages: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      sequence_count: {
        type: 'integer',
      },
      unit_count: {
        type: 'integer',
      },
      lesson_count: {
        type: 'integer',
      },
      has_tiers: {
        type: 'boolean',
      },
      has_exam_boards: {
        type: 'boolean',
      },
      subject_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
    },
  },
} as const;

export type OakRefSubjectsMapping = typeof OAK_REF_SUBJECTS_MAPPING;
