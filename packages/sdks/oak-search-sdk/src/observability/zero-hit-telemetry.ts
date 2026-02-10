/**
 * Zero-hit telemetry fetching from Elasticsearch.
 *
 * @packageDocumentation
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type {
  ZeroHitEvent,
  ZeroHitScope,
  ZeroHitTelemetry,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { TelemetryFetchOptions } from '../types/observability.js';

/**
 * Fetch persisted telemetry from Elasticsearch.
 *
 * Falls back to empty results if the index does not exist.
 */
export async function fetchTelemetry(
  options: TelemetryFetchOptions,
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<ZeroHitTelemetry> {
  try {
    const response = await client.search({
      index: indexName,
      size: options.limit,
      track_total_hits: true,
      sort: [{ '@timestamp': { order: 'desc' } }],
      query: { match_all: {} },
      aggs: {
        by_scope: { terms: { field: 'search_scope', size: 10 } },
      },
    });

    const total = normaliseTotal(response.hits.total);
    const recent = extractRecentEvents(response.hits.hits);
    const byScope = extractScopeCounts(response.aggregations);

    return {
      summary: { total, byScope, latestIndexVersion: null },
      recent,
    };
  } catch (error: unknown) {
    logger?.debug('Failed to fetch zero-hit telemetry, returning empty', {
      error: error instanceof Error ? error.message : String(error),
    });
    return emptyTelemetry();
  }
}

function emptyTelemetry(): ZeroHitTelemetry {
  return {
    summary: {
      total: 0,
      byScope: { lessons: 0, units: 0, sequences: 0 },
      latestIndexVersion: null,
    },
    recent: [],
  };
}

function normaliseTotal(total: unknown): number {
  if (typeof total === 'number') {
    return total;
  }
  if (!isTotalHitsObject(total)) {
    return 0;
  }
  return total.value;
}

function isTotalHitsObject(value: unknown): value is { value: number } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('value' in value)) {
    return false;
  }
  return typeof value.value === 'number';
}

function extractRecentEvents(hits: readonly { _source?: unknown }[]): ZeroHitEvent[] {
  const events: ZeroHitEvent[] = [];
  for (const hit of hits) {
    if (!isZeroHitDoc(hit._source)) {
      continue;
    }
    events.push({
      timestamp: new Date(hit._source['@timestamp']).getTime(),
      scope: hit._source.search_scope,
      text: hit._source.text,
      filters: hit._source.filters ?? {},
      indexVersion: hit._source.index_version,
    });
  }
  return events;
}

interface ZeroHitDoc {
  readonly '@timestamp': string;
  readonly search_scope: ZeroHitScope;
  readonly text: string;
  readonly filters?: Record<string, string>;
  readonly index_version: string;
}

function isZeroHitDoc(value: unknown): value is ZeroHitDoc {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    '@timestamp' in value && 'search_scope' in value && 'text' in value && 'index_version' in value
  );
}

function extractScopeCounts(aggregations: unknown): Record<ZeroHitScope, number> {
  const counts: Record<ZeroHitScope, number> = { lessons: 0, units: 0, sequences: 0 };
  const buckets = extractBuckets(aggregations);
  for (const bucket of buckets) {
    if (bucket.key === 'lessons' || bucket.key === 'units' || bucket.key === 'sequences') {
      counts[bucket.key] = bucket.doc_count;
    }
  }
  return counts;
}

interface ScopeBucket {
  readonly key: string;
  readonly doc_count: number;
}

function extractBuckets(aggregations: unknown): readonly ScopeBucket[] {
  if (typeof aggregations !== 'object' || aggregations === null) {
    return [];
  }
  if (!('by_scope' in aggregations)) {
    return [];
  }
  const byScope = aggregations.by_scope;
  if (typeof byScope !== 'object' || byScope === null) {
    return [];
  }
  if (!('buckets' in byScope)) {
    return [];
  }
  const buckets = byScope.buckets;
  if (!Array.isArray(buckets)) {
    return [];
  }
  return buckets.filter(isScopeBucket);
}

function isScopeBucket(value: unknown): value is ScopeBucket {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('key' in value) || !('doc_count' in value)) {
    return false;
  }
  return typeof value.key === 'string' && typeof value.doc_count === 'number';
}
