/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-curriculum-glossary
 * @description Elasticsearch mapping for the oak_curriculum_glossary index.
 * Contains curriculum term definitions with semantic search capabilities.
 */

export const OAK_CURRICULUM_GLOSSARY_MAPPING = {
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
      term: {
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
      term_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      definition: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      subject_slugs: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      key_stages: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      lesson_ids: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      usage_count: {
        type: 'integer',
      },
      term_semantic: {
        type: 'semantic_text',
      },
      term_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
    },
  },
} as const;

export type OakCurriculumGlossaryMapping = typeof OAK_CURRICULUM_GLOSSARY_MAPPING;
