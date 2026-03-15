import { esClient } from './es-client';
import type { estypes } from '@elastic/elasticsearch';
import { typeSafeEntries } from '@oaknational/type-helpers';
// use types from estypes only

/**
 * Narrow search request shape we use in the app.
 *
 * Supports two mutually exclusive modes:
 * 1. Traditional query mode: Uses `query` for search
 * 2. Retriever mode (ES 8.11+): Uses `retriever` for hybrid RRF search
 *
 * When using `retriever`, filters are placed inside each sub-retriever.
 */
export interface EsSearchRequest {
  index: string;
  size?: number;
  /** Traditional query. Omit when using retriever mode. */
  query?: estypes.QueryDslQueryContainer;
  /** ES 8.11+ retriever for RRF hybrid search. Replaces deprecated rank API. */
  retriever?: estypes.RetrieverContainer;
  highlight?: estypes.SearchHighlight;
  sort?: estypes.Sort;
  _source?: string[];
  aggs?: Record<string, estypes.AggregationsAggregationContainer>;
  from?: number;
}

export interface EsHit<TDoc> {
  _index: string;
  _id: string;
  _score: number | null;
  _source: TDoc;
  highlight?: Record<string, string[]>;
}

export interface EsSearchResponse<TDoc> {
  hits: {
    total: { value: number; relation: 'eq' | 'gte' };
    max_score: number | null;
    hits: EsHit<TDoc>[];
  };
  took: number;
  timed_out: boolean;
  aggregations?: Record<string, estypes.AggregationsAggregate>;
}

function hasKey<T extends string>(obj: unknown, key: T): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}
function isEsHit<TDoc>(v: unknown): v is EsHit<TDoc> {
  return (
    typeof v === 'object' &&
    v !== null &&
    hasKey(v, '_id') &&
    hasKey(v, '_source') &&
    typeof v._id === 'string'
  );
}
export function isEsSearchResponse<TDoc>(v: unknown): v is EsSearchResponse<TDoc> {
  if (!(typeof v === 'object' && v !== null && hasKey(v, 'hits'))) {
    return false;
  }
  const h = v.hits;
  if (!(typeof h === 'object' && h !== null && hasKey(h, 'hits'))) {
    return false;
  }
  const arr = h.hits;
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr.every(isEsHit);
}

/**
 * Type for the search function, enabling dependency injection for testability.
 * @see ADR-078 Dependency Injection for Testability
 */
export type EsSearchFn = <T>(body: EsSearchRequest) => Promise<EsSearchResponse<T>>;

/**
 * Lessons-specific search function type. Accepts both EsSearchFn and
 * `(body) =\> Promise\<EsSearchResponse\<SearchLessonsIndexDoc\>\>` so tests can pass
 * a fixed response without type assertions.
 */
export type EsSearchFnForDoc<TDoc> = (body: EsSearchRequest) => Promise<EsSearchResponse<TDoc>>;

export async function esSearch<T>(body: EsSearchRequest): Promise<EsSearchResponse<T>> {
  const client = esClient();
  const res = await client.search<T, Record<string, estypes.AggregationsAggregate>>(
    buildSearchParams(body),
  );
  return wrapSearchResponse<T>(res, body.index, body.size ?? 25);
}

/**
 * Builds the search request parameters for the ES client.
 *
 * Supports two modes:
 * - Query mode: Traditional search with `query` property
 * - Retriever mode (ES 8.11+): Hybrid RRF search with `retriever` property
 */
function buildSearchParams(body: EsSearchRequest): estypes.SearchRequest {
  const params: estypes.SearchRequest = {
    index: body.index,
    size: body.size ?? 25,
  };

  // Use retriever mode OR query mode (mutually exclusive)
  if (body.retriever) {
    params.retriever = body.retriever;
  } else if (body.query) {
    params.query = body.query;
  }

  assignOptional(body.highlight, (value) => {
    params.highlight = value;
  });
  assignOptional(body.sort, (value) => {
    params.sort = value;
  });
  assignOptional(body._source, (value) => {
    params._source = value;
  });
  assignOptional(body.aggs, (value) => {
    params.aggs = value;
  });

  const from = normaliseFrom(body.from);
  if (from !== undefined) {
    params.from = from;
  }

  return params;
}

function assignOptional<T>(value: T | undefined, setter: (value: T) => void): void {
  if (value !== undefined) {
    setter(value);
  }
}

function normaliseFrom(value: number | undefined): number | undefined {
  return typeof value === 'number' && value >= 0 ? value : undefined;
}

function wrapSearchResponse<T>(
  res: estypes.SearchResponse<T, Record<string, estypes.AggregationsAggregate>>,
  fallbackIndex: string,
  requestedSize: number,
): EsSearchResponse<T> {
  const hits = (res.hits.hits ?? [])
    .map((hit) => normalizeHit(hit, fallbackIndex))
    .filter((value): value is EsHit<T> => value !== undefined)
    .slice(0, requestedSize);

  const wrapped: EsSearchResponse<T> = {
    hits: {
      total: normalizeTotal(res.hits.total, hits.length),
      max_score: res.hits.max_score ?? null,
      hits,
    },
    took: typeof res.took === 'number' ? res.took : 0,
    timed_out: res.timed_out === true,
  };

  if (res.aggregations) {
    wrapped.aggregations = res.aggregations;
  }

  if (!isEsSearchResponse<T>(wrapped)) {
    throw new Error('Unexpected ES search response shape');
  }

  return wrapped;
}

function normalizeHit<T>(
  hit: estypes.SearchResponse<T>['hits']['hits'][number],
  fallbackIndex: string,
): EsHit<T> | undefined {
  if (typeof hit._id !== 'string' || hit._source === undefined) {
    return undefined;
  }

  return {
    _index: typeof hit._index === 'string' ? hit._index : fallbackIndex,
    _id: hit._id,
    _score: typeof hit._score === 'number' ? hit._score : null,
    _source: hit._source,
    highlight: toHighlightMap(hit.highlight),
  };
}

function normalizeTotal(
  total: estypes.SearchTotalHits | number | undefined,
  fallback: number,
): { value: number; relation: 'eq' | 'gte' } {
  if (typeof total === 'number') {
    return { value: total, relation: 'eq' };
  }
  if (total && typeof total === 'object' && typeof total.value === 'number') {
    return { value: total.value, relation: total.relation === 'gte' ? 'gte' : 'eq' };
  }
  return { value: fallback, relation: 'eq' };
}

function toHighlightMap(value: unknown): HighlightMap | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const highlight: HighlightMap = {};
  for (const [field, entry] of typeSafeEntries(value)) {
    if (!isStringArray(entry)) {
      return undefined;
    }
    highlight[field] = entry;
  }

  return highlight;
}

type HighlightMap = Record<string, string[]>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Bulk helper — accepts classic action/line pairs (same shape we already used),
 * composes NDJSON, and calls the client's transport to POST /_bulk.
 */
export async function esBulk(ops: readonly unknown[]): Promise<void> {
  const client = esClient();
  const ndjson = ops.map((o) => JSON.stringify(o)).join('\n') + '\n';
  await client.transport.request(
    {
      method: 'POST',
      path: '/_bulk',
      body: ndjson,
    },
    {
      headers: { 'content-type': 'application/x-ndjson' },
    },
  );

  // Server replies with per-item errors in body; we could optionally parse it,
  // but we keep parity with our previous strict/no-partial-success approach.
}
