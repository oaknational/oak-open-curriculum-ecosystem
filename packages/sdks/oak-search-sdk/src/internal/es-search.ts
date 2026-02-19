/**
 * Elasticsearch search adapter — wraps a `Client` into an `EsSearchFn`.
 *
 * This module bridges the gap between the SDK's injected `Client`
 * dependency and the internal `EsSearchFn` type used by all service
 * implementations. It normalises the ES client response into the
 * SDK's internal `EsSearchResponse` shape.
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest, EsSearchResponse, EsHit, EsSearchFn } from './types.js';

/**
 * Create an `EsSearchFn` from an Elasticsearch `Client` instance.
 *
 * The returned function:
 * 1. Translates `EsSearchRequest` into an ES `SearchRequest`
 * 2. Calls `client.search()`
 * 3. Normalises the response into `EsSearchResponse<T>`
 *
 * @param client - The Elasticsearch client instance
 * @returns A search function compatible with SDK internals
 */
export function createEsSearchFn(client: Client): EsSearchFn {
  return async function esSearch<T>(body: EsSearchRequest): Promise<EsSearchResponse<T>> {
    const params = buildSearchParams(body);
    const res = await client.search<T, Record<string, estypes.AggregationsAggregate>>(params);
    return wrapSearchResponse<T>(res, body.index, body.size ?? 25);
  };
}

/**
 * Build ES client search parameters from the internal request type.
 *
 * Supports two mutually exclusive modes:
 * - Query mode: traditional search with `query` property
 * - Retriever mode (ES 8.11+): hybrid RRF search with `retriever`
 *
 * @param body - The internal search request
 * @returns ES client search parameters
 */
function buildSearchParams(body: EsSearchRequest): estypes.SearchRequest {
  const params: estypes.SearchRequest = {
    index: body.index,
    size: body.size ?? 25,
  };

  assignQueryOrRetriever(params, body);
  assignOptionalFields(params, body);

  return params;
}

/**
 * Assign query or retriever (mutually exclusive) to the search params.
 *
 * @param params - The search params to mutate
 * @param body - The internal request with query or retriever
 */
function assignQueryOrRetriever(params: estypes.SearchRequest, body: EsSearchRequest): void {
  if (body.retriever) {
    params.retriever = body.retriever;
  } else if (body.query) {
    params.query = body.query;
  }
}

/**
 * Assign optional search parameters (highlight, sort, _source, aggs, from) when present.
 *
 * @param params - The search params to mutate
 * @param body - The internal request
 */
function assignOptionalFields(params: estypes.SearchRequest, body: EsSearchRequest): void {
  if (body.highlight !== undefined) {
    params.highlight = body.highlight;
  }
  if (body.sort !== undefined) {
    params.sort = body.sort;
  }
  if (body._source !== undefined) {
    if ('excludes' in body._source) {
      params._source = { excludes: [...body._source.excludes] };
    } else {
      params._source = [...body._source];
    }
  }
  if (body.aggs !== undefined) {
    params.aggs = { ...body.aggs };
  }
  if (typeof body.from === 'number' && body.from >= 0) {
    params.from = body.from;
  }
}

/**
 * Normalise the ES client response into the SDK's internal shape.
 *
 * Handles missing fields, type coercion, and ES response format
 * variations across versions.
 *
 * @param res - The raw ES search response
 * @param fallbackIndex - Index name when hit._index is missing
 * @param requestedSize - Maximum hits to return
 * @returns Normalised EsSearchResponse
 */
function wrapSearchResponse<T>(
  res: estypes.SearchResponse<T, Record<string, estypes.AggregationsAggregate>>,
  fallbackIndex: string,
  requestedSize: number,
): EsSearchResponse<T> {
  const hits = (res.hits.hits ?? [])
    .map((hit) => normalizeHit(hit, fallbackIndex))
    .filter((value): value is EsHit<T> => value !== undefined)
    .slice(0, requestedSize);

  const result: EsSearchResponse<T> = {
    hits: {
      total: normalizeTotal(res.hits.total, hits.length),
      max_score: res.hits.max_score ?? null,
      hits,
    },
    took: typeof res.took === 'number' ? res.took : 0,
    timed_out: res.timed_out === true,
  };

  if (res.aggregations) {
    return { ...result, aggregations: res.aggregations };
  }

  return result;
}

/**
 * Normalise a single ES hit into the internal shape.
 *
 * The ES client types `hit.highlight` as `Record<string, string[]> | undefined`
 * which is already the correct shape. We just need to verify presence.
 *
 * @param hit - The raw ES hit
 * @param fallbackIndex - Index name when hit._index is missing
 * @returns Normalised EsHit or undefined if hit is invalid
 */
function normalizeHit<T>(
  hit: estypes.SearchResponse<T>['hits']['hits'][number],
  fallbackIndex: string,
): EsHit<T> | undefined {
  if (typeof hit._id !== 'string' || hit._source === undefined) {
    return undefined;
  }

  const esHit: EsHit<T> = {
    _index: typeof hit._index === 'string' ? hit._index : fallbackIndex,
    _id: hit._id,
    _score: typeof hit._score === 'number' ? hit._score : null,
    _source: hit._source,
  };

  // ES client types hit.highlight as Record<string, string[]> | undefined
  if (hit.highlight) {
    return { ...esHit, highlight: hit.highlight };
  }

  return esHit;
}

/**
 * Normalise the total hits value from ES response variations.
 *
 * @param total - The raw total from ES (number or object)
 * @param fallback - Fallback count when total is missing
 * @returns Normalised total with value and relation
 */
function normalizeTotal(
  total: estypes.SearchTotalHits | number | undefined,
  fallback: number,
): { readonly value: number; readonly relation: 'eq' | 'gte' } {
  if (typeof total === 'number') {
    return { value: total, relation: 'eq' };
  }
  if (total && typeof total === 'object' && typeof total.value === 'number') {
    return { value: total.value, relation: total.relation === 'gte' ? 'gte' : 'eq' };
  }
  return { value: fallback, relation: 'eq' };
}
