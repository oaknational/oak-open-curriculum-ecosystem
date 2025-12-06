/**
 * @module es-types
 * @description Elasticsearch type definitions re-exported from @elastic/elasticsearch.
 *
 * This module provides type-safe Elasticsearch structures by re-exporting
 * official types from the @elastic/elasticsearch package. This ensures:
 * - Full type safety with the official ES client
 * - No ad-hoc Record<string, unknown> types
 * - Single source of truth for ES API types
 * - Compatibility with official ES client
 *
 * ## Usage
 *
 * ```typescript
 * import type {
 *   EsIndexBody,
 *   EsIlmPolicyBody,
 *   EsSearchBody,
 *   EsHitSource
 * } from './es-types.js';
 * ```
 *
 * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html}
 */

import type { estypes } from '@elastic/elasticsearch';

/**
 * Elasticsearch index creation body including mappings and settings.
 * Used when creating or updating an index.
 */
export interface EsIndexBody {
  readonly mappings?: estypes.MappingTypeMapping;
  readonly settings?: estypes.IndicesIndexSettings;
  readonly aliases?: Record<string, estypes.IndicesAlias>;
}

/**
 * Elasticsearch ILM (Index Lifecycle Management) policy body.
 * Defines lifecycle phases and actions for index management.
 */
export interface EsIlmPolicyBody {
  readonly policy?: estypes.IlmPolicy;
}

/**
 * Elasticsearch search request body.
 * Defines query, aggregations, sorting, pagination, etc.
 */
export interface EsSearchBody {
  readonly query?: estypes.QueryDslQueryContainer;
  readonly aggregations?: Record<string, estypes.AggregationsAggregationContainer>;
  readonly aggs?: Record<string, estypes.AggregationsAggregationContainer>;
  readonly sort?: estypes.Sort;
  readonly size?: number;
  readonly from?: number;
  readonly _source?: estypes.SearchSourceConfig;
  readonly track_total_hits?: boolean | number;
  readonly timeout?: string;
}

/**
 * Elasticsearch hit source - the _source field from a search hit.
 * Contains the original document that was indexed.
 */
export type EsHitSource<T = unknown> = estypes.SearchHit<T>['_source'];

/**
 * Elasticsearch mappings - defines how documents and fields are stored and indexed.
 */
export type EsMappings = estypes.MappingTypeMapping;

/**
 * Elasticsearch index settings - controls operational aspects of the index.
 */
export type EsSettings = estypes.IndicesIndexSettings;

/**
 * Elasticsearch aliases configuration.
 */
export type EsAliases = Record<string, estypes.IndicesAlias>;

/**
 * Single search hit from Elasticsearch response.
 */
export type EsSearchHit<T = unknown> = estypes.SearchHit<T>;

/**
 * Array of search hits from Elasticsearch response.
 */
export type EsSearchHits<T = unknown> = estypes.SearchHitsMetadata<T>;

/**
 * Elasticsearch search aggregations result.
 */
export type EsSearchAggregations = Record<string, estypes.AggregationsAggregate>;

/**
 * Complete Elasticsearch search response.
 */
export type EsSearchResponse<T = unknown> = estypes.SearchResponse<T>;
