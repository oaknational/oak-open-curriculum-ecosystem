/**
 * RRF query builders — constructs Elasticsearch retriever queries.
 *
 * Four-way RRF for lessons/units (BM25+ELSER on content+structure).
 * Two-way RRF for sequences (BM25+ELSER).
 */

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/** BM25 content fields for lesson search (four-retriever architecture). */
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'lesson_content',
];
/** BM25 structure fields for lesson search (four-retriever architecture). */
const LESSON_BM25_STRUCTURE = ['lesson_structure^2', 'lesson_title^3'];
/** BM25 content fields for unit search (four-retriever architecture). */
const UNIT_BM25_CONTENT = ['unit_title^3', 'unit_content', 'unit_topics^1.5'];
/** BM25 structure fields for unit search (four-retriever architecture). */
const UNIT_BM25_STRUCTURE = ['unit_structure^2', 'unit_title^3'];

/**
 * Build four-way RRF retriever (BM25+ELSER on content+structure).
 *
 * @param query - The search query
 * @param filters - Optional filter clauses
 * @param phrases - Curriculum phrases for phrase boosting
 * @param scope - Whether to use lesson or unit field mappings
 * @returns ES retriever container for hybrid RRF search
 *
 * @example
 * ```typescript
 * const retriever = buildFourWayRetriever('photosynthesis', filters, ['key stage 2'], 'lesson');
 * ```
 */
export function buildFourWayRetriever(
  query: string,
  filters: QueryContainer[],
  phrases: readonly string[],
  scope: 'lesson' | 'unit',
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const contentFields = scope === 'lesson' ? LESSON_BM25_CONTENT : UNIT_BM25_CONTENT;
  const structureFields = scope === 'lesson' ? LESSON_BM25_STRUCTURE : UNIT_BM25_STRUCTURE;
  const contentSemantic = scope === 'lesson' ? 'lesson_content_semantic' : 'unit_content_semantic';
  const structureSemantic =
    scope === 'lesson' ? 'lesson_structure_semantic' : 'unit_structure_semantic';

  const bm25Config =
    scope === 'lesson'
      ? {
          fuzziness: 'AUTO:6,9' as const,
          prefix_length: 1,
          fuzzy_transpositions: true,
          minimum_should_match: '2<65%',
        }
      : {
          fuzziness: 'AUTO:6,9' as const,
          prefix_length: 1,
          fuzzy_transpositions: true,
        };

  return {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, contentFields, filterClause, phrases, bm25Config),
        {
          standard: {
            query: { semantic: { field: contentSemantic, query } },
            filter: filterClause,
          },
        },
        buildBm25Retriever(query, structureFields, filterClause, phrases, bm25Config),
        {
          standard: {
            query: { semantic: { field: structureSemantic, query } },
            filter: filterClause,
          },
        },
      ],
      rank_window_size: 80,
      rank_constant: 60, // coupled to DEFAULT_MIN_SCORE — recalibrate if changed
    },
  };
}

/**
 * Build a BM25 retriever with optional phrase boosting.
 *
 * @param query - The search query
 * @param fields - ES field names (with optional boost suffix)
 * @param filter - Optional filter clause
 * @param phrases - Curriculum phrases for match_phrase boosting
 * @param config - BM25 config (fuzziness, minimum_should_match, etc.)
 * @returns ES retriever container
 */
function buildBm25Retriever(
  query: string,
  fields: readonly string[],
  filter: QueryContainer | undefined,
  phrases: readonly string[],
  config: {
    fuzziness: string;
    minimum_should_match?: string;
    prefix_length?: number;
    fuzzy_transpositions?: boolean;
  },
): estypes.RetrieverContainer {
  const multiMatch: estypes.QueryDslMultiMatchQuery = {
    query,
    type: 'best_fields',
    tie_breaker: 0.2,
    fuzziness: config.fuzziness,
    fields: [...fields],
  };
  if (config.minimum_should_match) {
    multiMatch.minimum_should_match = config.minimum_should_match;
  }
  if (config.prefix_length !== undefined) {
    multiMatch.prefix_length = config.prefix_length;
  }
  if (config.fuzzy_transpositions !== undefined) {
    multiMatch.fuzzy_transpositions = config.fuzzy_transpositions;
  }

  const primaryQuery: QueryContainer = { multi_match: multiMatch };

  if (phrases.length === 0) {
    return { standard: { query: primaryQuery, filter } };
  }

  const phraseBoosters = createPhraseBoosters(phrases, fields);
  return {
    standard: { query: { bool: { must: [primaryQuery], should: phraseBoosters } }, filter },
  };
}

/**
 * Create match_phrase queries for detected curriculum phrases.
 *
 * @param phrases - Curriculum phrases to boost
 * @param fields - ES field names (boosts stripped)
 * @returns Array of match_phrase query containers
 */
function createPhraseBoosters(
  phrases: readonly string[],
  fields: readonly string[],
): QueryContainer[] {
  const strippedFields = fields.map(stripBoost);
  const boosters: QueryContainer[] = [];
  for (const phrase of phrases) {
    for (const field of strippedFields) {
      boosters.push({ match_phrase: { [field]: { query: phrase, boost: 2.0 } } });
    }
  }
  return boosters;
}

/**
 * Remove boost suffix from a field name (e.g. `lesson_title^3` \> `lesson_title`).
 *
 * @param field - ES field name possibly with ^boost suffix
 * @returns Field name without boost
 */
function stripBoost(field: string): string {
  const i = field.indexOf('^');
  return i !== -1 ? field.slice(0, i) : field;
}
