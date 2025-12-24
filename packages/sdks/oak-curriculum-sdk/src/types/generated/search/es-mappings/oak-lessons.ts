/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

/**
 * Elasticsearch mapping for the oak_lessons index.
 *
 * Contains lesson documents with semantic embeddings for hybrid search.
 */

export const OAK_LESSONS_MAPPING = {
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
      lesson_id: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      lesson_slug: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      lesson_title: {
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
      key_stage: {
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
      unit_ids: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      unit_titles: {
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
      unit_count: {
        type: 'integer',
      },
      lesson_keywords: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      key_learning_points: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      misconceptions_and_common_mistakes: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      teacher_tips: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      content_guidance: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      lesson_content: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
        term_vector: 'with_positions_offsets',
      },
      lesson_structure: {
        type: 'text',
        analyzer: 'oak_text_index',
        search_analyzer: 'oak_text_search',
      },
      lesson_content_semantic: {
        type: 'semantic_text',
      },
      lesson_structure_semantic: {
        type: 'semantic_text',
      },
      lesson_url: {
        type: 'keyword',
        ignore_above: 1024,
      },
      unit_urls: {
        type: 'keyword',
        ignore_above: 1024,
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
      title_suggest: {
        type: 'completion',
        contexts: [
          { name: 'subject', type: 'category' },
          { name: 'key_stage', type: 'category' },
        ],
      },
      pupil_lesson_outcome: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      supervision_level: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      downloads_available: {
        type: 'boolean',
      },
      tiers: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      tier_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      exam_boards: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      exam_board_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      exam_subjects: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      exam_subject_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      ks4_options: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      ks4_option_titles: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
      doc_type: {
        type: 'keyword',
        normalizer: 'oak_lower',
      },
    },
  },
} as const;

export type OakLessonsMapping = typeof OAK_LESSONS_MAPPING;
