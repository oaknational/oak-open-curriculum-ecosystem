/**
 * RRF query builders — constructs Elasticsearch retriever queries.
 *
 * Four-way RRF for lessons/units (BM25+ELSER on content+structure).
 * Two-way RRF for sequences (BM25+ELSER).
 */

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/** BM25 field definitions for four-retriever architecture. */
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'lesson_content',
];
const LESSON_BM25_STRUCTURE = ['lesson_structure^2', 'lesson_title^3'];
const UNIT_BM25_CONTENT = ['unit_title^3', 'unit_content', 'unit_topics^1.5'];
const UNIT_BM25_STRUCTURE = ['unit_structure^2', 'unit_title^3'];

/** Build four-way RRF retriever (BM25+ELSER on content+structure). */
export function buildFourWayRetriever(
  text: string,
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
      ? { fuzziness: 'AUTO' as const, minimum_should_match: '2<65%' }
      : { fuzziness: 'AUTO:3,6' as const, prefix_length: 1, fuzzy_transpositions: true };

  return {
    rrf: {
      retrievers: [
        buildBm25Retriever(text, contentFields, filterClause, phrases, bm25Config),
        {
          standard: {
            query: { semantic: { field: contentSemantic, query: text } },
            filter: filterClause,
          },
        },
        buildBm25Retriever(text, structureFields, filterClause, phrases, bm25Config),
        {
          standard: {
            query: { semantic: { field: structureSemantic, query: text } },
            filter: filterClause,
          },
        },
      ],
      rank_window_size: 80,
      rank_constant: 60,
    },
  };
}

/** Build a BM25 retriever with optional phrase boosting. */
function buildBm25Retriever(
  text: string,
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
    query: text,
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

/** Create match_phrase queries for detected curriculum phrases. */
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

function stripBoost(field: string): string {
  const i = field.indexOf('^');
  return i !== -1 ? field.slice(0, i) : field;
}
