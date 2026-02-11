/**
 * Internal Elasticsearch types for the Search SDK.
 *
 * These types define the request/response shapes used by the SDK's
 * internal search adapter. They are NOT part of the public API.
 */

import type { estypes } from '@elastic/elasticsearch';

/**
 * Search request shape used throughout the SDK.
 *
 * Supports two mutually exclusive modes:
 * 1. Traditional query mode: uses `query` for standard search
 * 2. Retriever mode (ES 8.11+): uses `retriever` for hybrid RRF search
 */
export interface EsSearchRequest {
  /** Target Elasticsearch index name. */
  readonly index: string;

  /** Maximum number of results to return. */
  readonly size?: number;

  /** Traditional query. Omit when using retriever mode. */
  readonly query?: estypes.QueryDslQueryContainer;

  /** ES 8.11+ retriever for RRF hybrid search. Replaces deprecated rank API. */
  readonly retriever?: estypes.RetrieverContainer;

  /** Highlight configuration. */
  readonly highlight?: estypes.SearchHighlight;

  /** Sort configuration. */
  readonly sort?: estypes.Sort;

  /** Source field filtering. */
  readonly _source?: readonly string[];

  /** Aggregation definitions. */
  readonly aggs?: Readonly<Record<string, estypes.AggregationsAggregationContainer>>;

  /** Pagination offset. */
  readonly from?: number;
}

/**
 * A single search hit with typed document source.
 */
export interface EsHit<TDoc> {
  /** Index the document belongs to. */
  readonly _index: string;

  /** Document ID. */
  readonly _id: string;

  /** Relevance score (null for RRF-ranked results). */
  readonly _score: number | null;

  /** The document source. */
  readonly _source: TDoc;

  /** Highlighted field snippets, when highlights were requested. */
  readonly highlight?: Readonly<Record<string, readonly string[]>>;
}

/**
 * Normalised Elasticsearch search response.
 */
export interface EsSearchResponse<TDoc> {
  /** Search hits container. */
  readonly hits: {
    readonly total: { readonly value: number; readonly relation: 'eq' | 'gte' };
    readonly max_score: number | null;
    readonly hits: readonly EsHit<TDoc>[];
  };

  /** Time taken by Elasticsearch in milliseconds. */
  readonly took: number;

  /** Whether the query timed out. */
  readonly timed_out: boolean;

  /** Aggregation results, when aggregations were requested. */
  readonly aggregations?: Readonly<Record<string, estypes.AggregationsAggregate>>;
}

/**
 * Injectable search function type for dependency injection.
 *
 * The SDK creates this function from the injected `Client` at factory
 * time. Internal service implementations use this type rather than
 * coupling directly to the `Client` class, enabling testability.
 *
 * @see ADR-078 Dependency Injection for Testability
 */
export type EsSearchFn = <T>(body: EsSearchRequest) => Promise<EsSearchResponse<T>>;
