/**
 * Reviewed post-baseline semantic deltas — the unit-search year filter (MCP-755).
 *
 * `search` declared a `year` filter for every scope but only applied it to
 * lessons: on a units search the parameter was accepted and dropped, so
 * `keyStage` was the only age filter with any effect and a Year 2 unit was
 * invisible to a Year 3 request. The filter now reaches the unit query.
 *
 * The two description surfaces carry the audit rows (C078's reviewed anchor and
 * C066's revision verdict live with the other aggregated-tool surfaces); the
 * filter, the dispatch that forwards the parameter, and the params type carry
 * no authored agent-facing content.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  TYPE_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

const AGGREGATED_SEARCH = 'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search';
const FLAT_ZOD_SCHEMA = `${AGGREGATED_SEARCH}/flat-zod-schema.ts`;
const TOOL_DEFINITION = `${AGGREGATED_SEARCH}/tool-definition.ts`;
const EXECUTION = `${AGGREGATED_SEARCH}/execution.ts`;
const SEARCH_RETRIEVAL_TYPES = 'packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-types.ts';
const RRF_QUERY_HELPERS = 'packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts';

export const SEARCH_YEAR_FILTER_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> =
  {
    [FLAT_ZOD_SCHEMA]: reviewed(
      'b2c1cde0cd1450b482a0f6fd962711535a0f02b9d424e12cfb7a16dfeb8bea1b',
      [
        'C069',
        'C070',
        'C071',
        'C072',
        'C073',
        'C074',
        'C075',
        'C076',
        'C077',
        'C078',
        'C079',
        'C080',
        'C081',
        'C082',
        'C083',
        'C084',
      ],
    ),
    [TOOL_DEFINITION]: reviewed(
      '80caab09f96c7403e072126f20ae77ebdcda3fa74d1f9bd12071f74f3e31aa31',
      ['C065', 'C066', 'C067', 'C068'],
    ),
    [EXECUTION]: excluded(
      '51f9c5ea1cda45b23dcb019f5ede5bda8468af257b5dcd2a900a4b06594dd38c',
      IMPLEMENTATION_ONLY,
    ),
    [SEARCH_RETRIEVAL_TYPES]: excluded(
      '060dbb80726cd17d7941a659e5cf7e24606738e8020d6112a328d46c229d975e',
      TYPE_ONLY,
    ),
    [RRF_QUERY_HELPERS]: excluded(
      'f67b477a99f9a320320e0d31f80446de9dd0ce0f729ba3b6077be0723acd4a42',
      IMPLEMENTATION_ONLY,
    ),
  };
