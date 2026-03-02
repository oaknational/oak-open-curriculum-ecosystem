/**
 * Zero-hit telemetry search and parsing using ES SDK types.
 */
import { z } from 'zod';
import type { estypes } from '@elastic/elasticsearch';
import type { ZeroHitEvent } from './zero-hit-store';
import type { SearchScope } from '../../types/oak';
import type { EsSearchBody, EsSearchHit } from '@oaknational/curriculum-sdk/elasticsearch.js';
import type { ZeroHitDoc } from '@oaknational/sdk-codegen/search';

/** Zod schema for top_hits _source containing index_version. */
const TopHitSourceSchema = z.object({ index_version: z.string().min(1) });

/** Type-safe ES search response for zero-hit telemetry. */
export type ZeroHitSearchResponse = estypes.SearchResponse<ZeroHitDoc, ZeroHitAggregations>;

interface ZeroHitAggregations {
  by_scope?: estypes.AggregationsStringTermsAggregate;
  latest_version?: estypes.AggregationsTopHitsAggregate;
}

/** High-level summary presented on the zero-hit dashboard. */
export interface ZeroHitTelemetrySummary {
  total: number;
  byScope: Record<SearchScope, number>;
  latestIndexVersion: string | null;
}

/** Build the Elasticsearch search request retrieving zero-hit telemetry. */
export function buildSearchBody(limit: number): EsSearchBody {
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
  response: ZeroHitSearchResponse,
  limit: number,
): {
  summary: ZeroHitTelemetrySummary;
  recent: ZeroHitEvent[];
} {
  const hitsArray = response.hits.hits;
  const recent = hitsArray
    .slice(0, limit)
    .map((hit) => normaliseHit(hit))
    .filter((event): event is ZeroHitEvent => event !== null);

  return {
    summary: {
      total: normaliseTotal(response.hits.total),
      byScope: normaliseScopeBuckets(response.aggregations?.by_scope),
      latestIndexVersion: extractLatestVersion(response.aggregations?.latest_version),
    },
    recent,
  };
}

function normaliseHit(hit: EsSearchHit<ZeroHitDoc>): ZeroHitEvent | null {
  const source = hit._source;
  if (!source) {
    return null;
  }

  const timestamp = resolveTimestamp(source['@timestamp']);
  if (timestamp === null) {
    return null;
  }

  return {
    timestamp,
    scope: normaliseScope(source.search_scope),
    text: source.query,
    filters: normaliseFilters(source.filters),
    indexVersion: source.index_version,
    tookMs: source.took_ms,
    timedOut: source.timed_out,
    requestId: source.request_id,
    sessionId: source.session_id,
  };
}

function normaliseScope(value: string): SearchScope {
  return isRecognisedScope(value) ? value : 'lessons';
}

/** Convert ZeroHitDoc filters to string-only filters. */
function normaliseFilters(value: ZeroHitDoc['filters']): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      const entry = value[key];
      if (typeof entry === 'string') {
        result[key] = entry;
      }
    }
  }
  return result;
}

/** Normalise ES total hits (can be number or `{ value, relation }`). */
function normaliseTotal(total: estypes.SearchTotalHits | number | undefined): number {
  if (typeof total === 'number') {
    return total;
  }
  if (total && 'value' in total) {
    return total.value;
  }
  return 0;
}

/** Extract scope counts from ES terms aggregation buckets. */
function normaliseScopeBuckets(
  agg: estypes.AggregationsStringTermsAggregate | undefined,
): Record<SearchScope, number> {
  const result: Record<SearchScope, number> = {
    lessons: 0,
    units: 0,
    sequences: 0,
  };

  if (!agg || !Array.isArray(agg.buckets)) {
    return result;
  }

  for (const bucket of agg.buckets) {
    if (isStringTermsBucket(bucket)) {
      const key = bucket.key;
      if (typeof key === 'string' && isRecognisedScope(key)) {
        result[key] = bucket.doc_count;
      }
    }
  }

  return result;
}

/** Type narrowing for ES string terms bucket (internal, well-typed ES union). */
function isStringTermsBucket(
  bucket: estypes.AggregationsStringTermsBucket | estypes.AggregationsStringRareTermsBucket,
): bucket is estypes.AggregationsStringTermsBucket {
  return 'key' in bucket && 'doc_count' in bucket;
}

function isRecognisedScope(value: string): value is SearchScope {
  return value === 'lessons' || value === 'units' || value === 'sequences';
}

/** Extract latest index version from top_hits aggregation using Zod validation. */
function extractLatestVersion(
  agg: estypes.AggregationsTopHitsAggregate | undefined,
): string | null {
  const hits = agg?.hits?.hits;
  if (!hits || hits.length === 0) {
    return null;
  }

  const firstHit = hits[0];
  const source: unknown = firstHit?._source;

  // External boundary: ES top_hits _source is unknown, validate with Zod
  const parsed = TopHitSourceSchema.safeParse(source);
  if (!parsed.success) {
    return null;
  }

  return parsed.data.index_version;
}

function resolveTimestamp(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
