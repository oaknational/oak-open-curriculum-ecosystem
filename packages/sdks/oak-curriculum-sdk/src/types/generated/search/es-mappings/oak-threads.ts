/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-threads
 * @description Elasticsearch mapping for the oak_threads index.
 * Contains curriculum thread documents for thread-centric navigation.
 *
 * Threads represent conceptual progressions (e.g., Number, Algebra) that
 * span multiple units and key stages within a subject.
 */

export const OAK_THREADS_MAPPING = {
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
      thread_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      thread_title: {
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
      unit_count: {
        type: 'integer',
      },
      subject_slugs: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      thread_semantic: {
        type: 'semantic_text',
      },
      thread_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
        ],
      },
    },
  },
} as const;

export type OakThreadsMapping = typeof OAK_THREADS_MAPPING;
