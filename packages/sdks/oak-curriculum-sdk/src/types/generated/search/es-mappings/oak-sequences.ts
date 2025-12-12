/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-sequences
 * @description Elasticsearch mapping for the oak_sequences index.
 * Contains programme sequence documents for navigation and search.
 */

export const OAK_SEQUENCES_MAPPING = {
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
      sequence_id: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      sequence_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      sequence_title: {
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
      subject_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      subject_title: {
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
      category_titles: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      key_stages: {
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
      sequence_semantic: {
        type: 'semantic_text',
      },
      sequence_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'phase', type: 'category' },
        ],
      },
      doc_type: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
    },
  },
} as const;

export type OakSequencesMapping = typeof OAK_SEQUENCES_MAPPING;
