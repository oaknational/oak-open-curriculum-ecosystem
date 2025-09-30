import type { ZeroHitEvent } from './zero-hit-store';
import type { UnknownRecord } from './zero-hit-persistence-index';

/** Minimal representation of an Elasticsearch hit consumed by the parser. */
export interface SearchHit {
  _source?: UnknownRecord;
}

/** Structure of the `hits` section returned by Elasticsearch. */
export interface SearchHits {
  total?: unknown;
  hits?: SearchHit[];
}

/** Aggregation buckets required for the zero-hit dashboard. */
export interface SearchAggregations {
  by_scope?: {
    buckets?: unknown;
  };
  latest_version?: unknown;
}

/** Subset of the Elasticsearch search response used for telemetry parsing. */
export interface SearchResponse {
  hits?: SearchHits;
  aggregations?: SearchAggregations;
}

/** High-level summary presented on the zero-hit dashboard. */
export interface ZeroHitTelemetrySummary {
  total: number;
  byScope: Record<'lessons' | 'units' | 'sequences', number>;
  latestIndexVersion: string | null;
}

/** Build the Elasticsearch search request retrieving zero-hit telemetry. */
export function buildSearchBody(limit: number): UnknownRecord {
  return {
    size: limit,
    track_total_hits: true,
    sort: [{ '@timestamp': { order: 'desc' } }],
    query: { match_all: {} },
    _source: {
      includes: [
        '@timestamp',
        'search_scope',
        'query',
        'filters',
        'index_version',
        'took_ms',
        'timed_out',
        'request_id',
        'session_id',
      ],
    },
    aggs: {
      by_scope: {
        terms: { field: 'search_scope', size: 10 },
      },
      latest_version: {
        top_hits: {
          sort: [{ '@timestamp': { order: 'desc' } }],
          _source: { includes: ['index_version'] },
          size: 1,
        },
      },
    },
  };
}

/** Parse the search response into dashboard-friendly telemetry structures. */
export function parseSearchResponse(
  response: SearchResponse,
  limit: number,
): {
  summary: ZeroHitTelemetrySummary;
  recent: ZeroHitEvent[];
} {
  const hitsArray = Array.isArray(response.hits?.hits) ? response.hits.hits : [];
  const recent = hitsArray
    .slice(0, limit)
    .map((hit) => normaliseHit(hit))
    .filter((event): event is ZeroHitEvent => event !== null);
  const total = normaliseTotal(response.hits?.total);
  const byScope = normaliseScopeBuckets(response.aggregations?.by_scope?.buckets);
  const latestIndexVersion = extractLatestVersion(response.aggregations?.latest_version);

  return {
    summary: {
      total,
      byScope,
      latestIndexVersion,
    },
    recent,
  };
}

function normaliseHit(hit: SearchHit | undefined): ZeroHitEvent | null {
  const source = resolveHitSource(hit);
  if (!source) {
    return null;
  }

  const timestamp = resolveTimestamp(source['@timestamp']);
  if (timestamp === null) {
    return null;
  }

  return {
    timestamp,
    scope: normaliseScope(source['search_scope']),
    text: extractStringValue(source['query']),
    filters: normaliseFilters(source['filters']),
    indexVersion: extractStringValue(source['index_version']),
    tookMs: normaliseOptionalNumber(source['took_ms']),
    timedOut: normaliseOptionalBoolean(source['timed_out']),
    requestId: normaliseOptionalString(source['request_id']),
    sessionId: normaliseOptionalString(source['session_id']),
  };
}

function normaliseScope(value: unknown): 'lessons' | 'units' | 'sequences' {
  return value === 'units' || value === 'sequences' ? value : 'lessons';
}

function normaliseFilters(value: unknown): Record<string, string> {
  if (!isUnknownRecord(value)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string') {
      result[key] = entry;
    }
  }
  return result;
}

function normaliseTotal(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (isUnknownRecord(value)) {
    const totalValue = value['value'];
    if (typeof totalValue === 'number') {
      return totalValue;
    }
  }
  return 0;
}

function normaliseScopeBuckets(value: unknown): Record<'lessons' | 'units' | 'sequences', number> {
  const initial: Record<'lessons' | 'units' | 'sequences', number> = {
    lessons: 0,
    units: 0,
    sequences: 0,
  };
  if (!Array.isArray(value)) {
    return initial;
  }
  for (const bucket of value) {
    if (!isUnknownRecord(bucket)) {
      continue;
    }
    const key = bucket['key'];
    const count = bucket['doc_count'];
    if (
      (key === 'lessons' || key === 'units' || key === 'sequences') &&
      typeof count === 'number'
    ) {
      initial[key] = count;
    }
  }
  return initial;
}

function extractLatestVersion(value: unknown): string | null {
  if (!isTopHitsAggregation(value)) {
    return null;
  }
  const [latest] = value.hits.hits;
  if (!latest || !isUnknownRecord(latest._source)) {
    return null;
  }
  const indexVersion = latest._source['index_version'];
  return typeof indexVersion === 'string' && indexVersion.length > 0 ? indexVersion : null;
}

function normaliseOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function normaliseOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function normaliseOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isTopHitsAggregation(value: unknown): value is { hits: { hits: SearchHit[] } } {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const hitsContainer = value['hits'];
  if (!isUnknownRecord(hitsContainer)) {
    return false;
  }
  const hits = hitsContainer['hits'];
  return Array.isArray(hits);
}

function resolveHitSource(hit: SearchHit | undefined): UnknownRecord | null {
  return hit && isUnknownRecord(hit._source) ? hit._source : null;
}

function resolveTimestamp(value: unknown): number | null {
  if (typeof value !== 'string') {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractStringValue(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '');
}
