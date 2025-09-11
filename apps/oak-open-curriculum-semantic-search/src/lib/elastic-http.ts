import { esClient } from './es-client';
import type { estypes } from '@elastic/elasticsearch';
// use types from estypes only

/** Narrow search request shape we use in the app. */
export interface EsSearchRequest {
  index: string;
  size?: number;
  query: estypes.QueryDslQueryContainer;
  highlight?: estypes.SearchHighlight;
  sort?: estypes.Sort;
  _source?: string[];
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
function isEsSearchResponse<TDoc>(v: unknown): v is EsSearchResponse<TDoc> {
  if (!(typeof v === 'object' && v !== null && hasKey(v, 'hits'))) return false;
  const h = v.hits;
  if (!(typeof h === 'object' && h !== null && hasKey(h, 'hits'))) return false;
  const arr = h.hits;
  if (!Array.isArray(arr)) return false;
  return arr.every(isEsHit);
}

/** Execute a search via official client, enforce a stable response shape. */
export async function esSearch<T>(body: EsSearchRequest): Promise<EsSearchResponse<T>> {
  const client = esClient();
  const { index, size, query, highlight, sort, _source } = body;

  const res = await client.search<T, estypes.AggregationsAggregate>({
    index,
    size: size ?? 25,
    query,
    highlight,
    sort,
    _source,
  });

  const wrapped: EsSearchResponse<T> = {
    hits: {
      total:
        res.hits.total && typeof res.hits.total === 'object'
          ? { value: res.hits.total.value, relation: 'eq' }
          : { value: res.hits.hits.length, relation: 'eq' },
      max_score: res.hits.max_score ?? null,
      hits: res.hits.hits
        .map((h) => {
          if (typeof h._id !== 'string' || h._source === undefined) return undefined;
          const hit: EsHit<T> = {
            _index: typeof h._index === 'string' ? h._index : index,
            _id: h._id,
            _score: typeof h._score === 'number' ? h._score : null,
            _source: h._source,
            highlight: h.highlight,
          };
          return hit;
        })
        .filter((x): x is EsHit<T> => Boolean(x)),
    },
    took: typeof res.took === 'number' ? res.took : 0,
    timed_out: false,
  };

  if (!isEsSearchResponse<T>(wrapped)) {
    throw new Error('Unexpected ES search response shape');
  }
  return wrapped;
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
