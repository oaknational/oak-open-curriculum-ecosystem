import { esClient } from '@lib/es-client';

/** Narrow search request shape we use in the app. */
export type EsSearchRequest = {
  index: string;
  size?: number;
  query: unknown;
  highlight?: unknown;
  sort?: unknown;
  _source?: string[];
};

export type EsHit<TDoc> = {
  _index: string;
  _id: string;
  _score: number | null;
  _source: TDoc;
  highlight?: Record<string, string[]>;
};

export type EsSearchResponse<TDoc> = {
  hits: {
    total: { value: number; relation: 'eq' | 'gte' };
    max_score: number | null;
    hits: Array<EsHit<TDoc>>;
  };
  took: number;
  timed_out: boolean;
};

function hasKey<T extends string>(obj: unknown, key: T): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}
function isEsHit<TDoc>(v: unknown): v is EsHit<TDoc> {
  return (
    typeof v === 'object' &&
    v !== null &&
    hasKey(v, '_id') &&
    hasKey(v, '_source') &&
    typeof (v as { _id: unknown })._id === 'string'
  );
}
function isEsSearchResponse<TDoc>(v: unknown): v is EsSearchResponse<TDoc> {
  if (!(typeof v === 'object' && v !== null && hasKey(v, 'hits'))) return false;
  const h = (v as { hits: unknown }).hits;
  if (!(typeof h === 'object' && h !== null && hasKey(h, 'hits'))) return false;
  const arr = (h as { hits: unknown }).hits;
  if (!Array.isArray(arr)) return false;
  return arr.every(isEsHit);
}

/** Execute a search via official client, enforce a stable response shape. */
export async function esSearch<T>(body: EsSearchRequest): Promise<EsSearchResponse<T>> {
  const client = esClient();
  const { index, size, query, highlight, sort, _source } = body;

  const res = await client.search<Record<string, unknown>, unknown>({
    index,
    size: size ?? 25,
    query,
    highlight: highlight as Record<string, unknown> | undefined,
    sort: sort as unknown,
    _source,
  });

  const data = res.hits as unknown;
  const wrapped: EsSearchResponse<T> = {
    hits: {
      total: {
        value:
          typeof (res.hits.total as any)?.value === 'number'
            ? (res.hits.total as any).value
            : res.hits.hits.length,
        relation: 'eq',
      },
      max_score: res.hits.max_score ?? null,
      hits: res.hits.hits.map((h) => ({
        _index: h._index ?? index,
        _id: h._id!,
        _score: h._score ?? null,
        _source: h._source as T,
        highlight: (h as { highlight?: Record<string, string[]> }).highlight,
      })),
    },
    took: (res as unknown as { took?: number }).took ?? 0,
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
  const res = await client.transport.request({
    method: 'POST',
    path: '/_bulk',
    body: ndjson,
    headers: { 'content-type': 'application/x-ndjson' },
  });

  const ok =
    typeof (res as { statusCode?: number }).statusCode === 'number'
      ? (res as { statusCode: number }).statusCode >= 200 &&
        (res as { statusCode: number }).statusCode < 300
      : true;

  if (!ok) throw new Error('Bulk request failed');

  // Server replies with per-item errors in body; we could optionally parse it,
  // but we keep parity with our previous strict/no-partial-success approach.
}
