/**
 * Observability service factory — creates the ObservabilityService implementation.
 *
 * Each SDK instance gets its own in-memory event store (closure-scoped,
 * not module-level). Events are optionally persisted to Elasticsearch.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type {
  ZeroHitEvent,
  ZeroHitScope,
  ZeroHitSummary,
} from '@oaknational/sdk-codegen/observability';

import type {
  ObservabilityService,
  ObservabilityError,
  ZeroHitPayload,
} from '../types/observability.js';
import type { SearchSdkConfig, SearchSdkZeroHitConfig } from '../types/sdk.js';
import { resolveZeroHitIndexName } from '../internal/index-resolver.js';
import { fetchTelemetry } from './zero-hit-telemetry.js';

/**
 * Convert an unknown caught error into an `ObservabilityError`.
 *
 * @param error - The caught error value
 * @returns A typed `ObservabilityError` discriminated union member
 */
function toObservabilityError(error: unknown): ObservabilityError {
  const message = error instanceof Error ? error.message : String(error);
  return { type: 'es_error', message };
}

/** Maximum events held in the in-memory store. */
const MAX_EVENTS = 200;

/**
 * Create the observability service implementation.
 *
 * @param esClient - Elasticsearch client for persistence and telemetry
 * @param config - SDK configuration (index target, zero-hit settings)
 * @param logger - Optional structured logger
 * @returns ObservabilityService with recordZeroHit, getRecentZeroHits, getZeroHitSummary, persistZeroHitEvent, fetchTelemetry
 *
 * @example
 * ```typescript
 * const observe = createObservabilityService(esClient, config, logger);
 * await observe.recordZeroHit({ scope: 'lessons', query: 'test search' });
 * const summary = observe.getZeroHitSummary();
 * ```
 */
export function createObservabilityService(
  esClient: Client,
  config: SearchSdkConfig,
  logger?: Logger,
): ObservabilityService {
  const events: ZeroHitEvent[] = [];
  const zeroHitConfig = config.zeroHit ?? {};
  const zeroHitIndex = resolveZeroHitIndexName(config.indexTarget);

  return {
    recordZeroHit: (payload) =>
      recordZeroHit(payload, events, zeroHitConfig, esClient, zeroHitIndex, logger),
    getRecentZeroHits: (limit) => getRecentZeroHits(events, limit),
    getZeroHitSummary: () => getZeroHitSummary(events),
    persistZeroHitEvent: (event) => persistEvent(event, zeroHitConfig, esClient, zeroHitIndex),
    fetchTelemetry: (options) => fetchTelemetry(options, esClient, zeroHitIndex, logger),
  };
}

// ---------------------------------------------------------------------------
// Record zero-hit
// ---------------------------------------------------------------------------

/**
 * Record a zero-hit event in memory and optionally persist to Elasticsearch.
 *
 * @param payload - Zero-hit payload (scope, query, filters, etc.)
 * @param events - Mutable in-memory event store
 * @param zeroHitConfig - Zero-hit configuration (persistence)
 * @param client - Elasticsearch client
 * @param indexName - Zero-hit telemetry index name
 * @param logger - Optional logger
 * @returns Result; err on ES persistence failure
 */
async function recordZeroHit(
  payload: ZeroHitPayload,
  events: ZeroHitEvent[],
  zeroHitConfig: SearchSdkZeroHitConfig,
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<Result<void, ObservabilityError>> {
  const event: ZeroHitEvent = {
    timestamp: payload.timestamp ?? Date.now(),
    scope: payload.scope,
    query: payload.query,
    filters: { ...payload.filters },
    indexVersion: payload.indexVersion,
  };

  events.unshift(event);
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }

  logger?.debug('Zero-hit event recorded', { scope: payload.scope, query: payload.query });

  if (zeroHitConfig.persistenceEnabled) {
    try {
      await indexEvent(event, client, indexName);
    } catch (error: unknown) {
      return err(toObservabilityError(error));
    }
  }

  return ok(undefined);
}

// ---------------------------------------------------------------------------
// In-memory queries
// ---------------------------------------------------------------------------

/**
 * Return the most recent zero-hit events, limited by count.
 *
 * @param events - In-memory event store
 * @param limit - Max events to return (default 50)
 * @returns Sliced array of events
 */
function getRecentZeroHits(
  events: readonly ZeroHitEvent[],
  limit?: number,
): readonly ZeroHitEvent[] {
  const effectiveLimit = typeof limit === 'number' && limit > 0 ? limit : 50;
  return events.slice(0, effectiveLimit);
}

/**
 * Build summary of zero-hit events (total, by scope, latest index version).
 *
 * @param events - In-memory event store
 * @returns ZeroHitSummary
 */
function getZeroHitSummary(events: readonly ZeroHitEvent[]): ZeroHitSummary {
  const byScope: Record<ZeroHitScope, number> = { lessons: 0, units: 0, sequences: 0 };

  for (const event of events) {
    if (event.scope in byScope) {
      byScope[event.scope]++;
    }
  }

  const latestEvent = events[0];
  return {
    total: events.length,
    byScope,
    latestIndexVersion: latestEvent?.indexVersion ?? null,
  };
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/**
 * Persist a zero-hit event to Elasticsearch if persistence is enabled.
 *
 * @param event - Zero-hit event to persist
 * @param zeroHitConfig - Zero-hit configuration
 * @param client - Elasticsearch client
 * @param indexName - Zero-hit telemetry index name
 * @returns Result; err on ES failure
 */
async function persistEvent(
  event: ZeroHitEvent,
  zeroHitConfig: SearchSdkZeroHitConfig,
  client: Client,
  indexName: string,
): Promise<Result<void, ObservabilityError>> {
  if (!zeroHitConfig.persistenceEnabled) {
    return ok(undefined);
  }

  try {
    await indexEvent(event, client, indexName);
    return ok(undefined);
  } catch (error: unknown) {
    return err(toObservabilityError(error));
  }
}

/**
 * Index a zero-hit event document to Elasticsearch.
 *
 * @param event - Zero-hit event
 * @param client - Elasticsearch client
 * @param indexName - Target index name
 */
async function indexEvent(event: ZeroHitEvent, client: Client, indexName: string): Promise<void> {
  const doc = {
    '@timestamp': new Date(event.timestamp).toISOString(),
    search_scope: event.scope,
    query: event.query,
    filters: event.filters,
    index_version: event.indexVersion,
  };

  await client.index({ index: indexName, document: doc });
}
