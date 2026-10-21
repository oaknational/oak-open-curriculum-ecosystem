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
const VALIDATION = `${AGGREGATED_SEARCH}/validation.ts`;
const YEAR_FILTER_SCHEMA = `${AGGREGATED_SEARCH}/year-filter-schema.ts`;

export const SEARCH_YEAR_FILTER_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> =
  {
    [FLAT_ZOD_SCHEMA]: reviewed(
      '67c2f82c74a2a9d8dfb889907eac9bdf890425a1a2c27c70f0903aeeeeefc82c',
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
      'd3b187c29af0b7b5dbeffe306fb5db66aaebf5b0f42178b0b7aad73d794f03d2',
      IMPLEMENTATION_ONLY,
    ),
    // The year filter's accepted shape, shared by the registration and runtime
    // schemas so the two cannot diverge. Input validation, not authored text:
    // the served description of `year` is C078, reviewed at FLAT_ZOD_SCHEMA.
    [YEAR_FILTER_SCHEMA]: excluded(
      '5ec3365a88fb342221551d34a26e33489af33bae5f3708c3a64c0c5a17f51e6b',
      IMPLEMENTATION_ONLY,
    ),
    [VALIDATION]: excluded(
      '053f3e0e0e0befe942973669f903852ab236b2cb65ea0ef642b680f18676fd77',
      IMPLEMENTATION_ONLY,
    ),
  };
