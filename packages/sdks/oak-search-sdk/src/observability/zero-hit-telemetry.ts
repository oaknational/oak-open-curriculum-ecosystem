/**
 * Zero-hit telemetry fetching from Elasticsearch.
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type {
  ZeroHitEvent,
  ZeroHitScope,
  ZeroHitTelemetry,
} from '@oaknational/sdk-codegen/observability';

import type { TelemetryFetchOptions, ObservabilityError } from '../types/observability.js';

/**
 * Fetch persisted telemetry from Elasticsearch.
 *
 * @param options - Fetch options specifying limit
 * @param client - Elasticsearch client
 * @param indexName - The zero-hit telemetry index name
 * @returns `ok` with telemetry data, or `err` with an `ObservabilityError`
 *
 * @example
 * ```typescript
 * const result = await fetchTelemetry(
 *   { limit: 50 },
 *   esClient,
 *   'oak_zero_hits_primary',
 * );
 * ```
 */
export async function fetchTelemetry(
  options: TelemetryFetchOptions,
  client: Client,
  indexName: string,
): Promise<Result<ZeroHitTelemetry, ObservabilityError>> {
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

    return ok({
      summary: { total, byScope, latestIndexVersion: null },
      recent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message });
  }
}

/**
 * Normalise ES hit total to a number (handles object shape).
 *
 * @param total - Raw hit total from ES response
 * @returns Total count
 */
function normaliseTotal(total: unknown): number {
  if (typeof total === 'number') {
    return total;
  }
  if (!isTotalHitsObject(total)) {
    return 0;
  }
  return total.value;
}

/**
 * Type guard: value has a numeric value property (ES total hits object).
 *
 * @param value - Value to check
 * @returns True if value has required shape (object with numeric value property)
 */
function isTotalHitsObject(value: unknown): value is { value: number } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('value' in value)) {
    return false;
  }
  return typeof value.value === 'number';
}

/**
 * Extract ZeroHitEvent objects from ES search hits.
 *
 * @param hits - Search hits from ES response
 * @returns Array of mapped ZeroHitEvent
 */
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

/** Shape of a zero-hit document as stored in Elasticsearch. */
interface ZeroHitDoc {
  readonly '@timestamp': string;
  readonly search_scope: ZeroHitScope;
  readonly text: string;
  readonly filters?: Record<string, string>;
  readonly index_version: string;
}

/**
 * Type guard: value is a valid ZeroHitDoc.
 *
 * @param value - Value to check
 * @returns True if value has required ZeroHitDoc fields
 */
function isZeroHitDoc(value: unknown): value is ZeroHitDoc {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    '@timestamp' in value && 'search_scope' in value && 'text' in value && 'index_version' in value
  );
}

/**
 * Extract scope counts from ES terms aggregation buckets.
 *
 * @param aggregations - Raw aggregations from ES response
 * @returns Record of scope to count
 */
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

/** Shape of an ES terms aggregation bucket. */
interface ScopeBucket {
  readonly key: string;
  readonly doc_count: number;
}

/**
 * Extract scope buckets from ES aggregations.
 *
 * @param aggregations - Raw aggregations from ES response
 * @returns Filtered array of ScopeBucket
 */
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

/**
 * Type guard: value is a valid ScopeBucket.
 *
 * @param value - Value to check
 * @returns True if value has key and doc_count
 */
function isScopeBucket(value: unknown): value is ScopeBucket {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('key' in value) || !('doc_count' in value)) {
    return false;
  }
  return typeof value.key === 'string' && typeof value.doc_count === 'number';
}
