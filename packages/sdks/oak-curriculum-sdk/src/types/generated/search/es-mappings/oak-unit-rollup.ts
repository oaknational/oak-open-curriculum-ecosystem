/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * @module oak-unit-rollup
 * @description Elasticsearch mapping for the oak_unit_rollup index.
 * Contains aggregated unit content for semantic search across lessons.
 */

export const OAK_UNIT_ROLLUP_MAPPING = {
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
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      rollup_text: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
        term_vector: 'with_positions_offsets',
      },
      unit_semantic: {
        type: 'semantic_text',
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
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
        fields: {
          keyword: {
            type: 'keyword',
            normalizer: 'oak_lower',
            ignore_above: 256,
          },
        },
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

export type OakUnitRollupMapping = typeof OAK_UNIT_ROLLUP_MAPPING;
