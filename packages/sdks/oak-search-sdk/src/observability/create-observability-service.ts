/**
 * Observability service factory — creates the ObservabilityService implementation.
 *
 * Each SDK instance gets its own in-memory event store (closure-scoped,
 * not module-level). Events are optionally persisted to Elasticsearch.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type {
  ZeroHitEvent,
  ZeroHitScope,
  ZeroHitSummary,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { ObservabilityService, ZeroHitPayload } from '../types/observability.js';
import type { SearchSdkConfig, SearchSdkZeroHitConfig } from '../types/sdk.js';
import { resolveZeroHitIndexName } from '../internal/index-resolver.js';
import { fetchTelemetry } from './zero-hit-telemetry.js';

/** Maximum events held in the in-memory store. */
const MAX_EVENTS = 200;

/**
 * Create the observability service implementation.
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
    persistZeroHitEvent: (event) =>
      persistEvent(event, zeroHitConfig, esClient, zeroHitIndex, logger),
    fetchTelemetry: (options) => fetchTelemetry(options, esClient, zeroHitIndex, logger),
  };
}

// ---------------------------------------------------------------------------
// Record zero-hit
// ---------------------------------------------------------------------------

async function recordZeroHit(
  payload: ZeroHitPayload,
  events: ZeroHitEvent[],
  zeroHitConfig: SearchSdkZeroHitConfig,
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<void> {
  const event: ZeroHitEvent = {
    timestamp: payload.timestamp ?? Date.now(),
    scope: payload.scope,
    text: payload.text,
    filters: { ...payload.filters },
    indexVersion: payload.indexVersion,
  };

  events.unshift(event);
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }

  logger?.debug('Zero-hit event recorded', { scope: payload.scope, text: payload.text });

  if (zeroHitConfig.persistenceEnabled) {
    try {
      await indexEvent(event, client, indexName);
    } catch (error: unknown) {
      logger?.error(
        'Failed to persist zero-hit event',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// In-memory queries
// ---------------------------------------------------------------------------

function getRecentZeroHits(
  events: readonly ZeroHitEvent[],
  limit?: number,
): readonly ZeroHitEvent[] {
  const effectiveLimit = typeof limit === 'number' && limit > 0 ? limit : 50;
  return events.slice(0, effectiveLimit);
}

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

async function persistEvent(
  event: ZeroHitEvent,
  zeroHitConfig: SearchSdkZeroHitConfig,
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<void> {
  if (!zeroHitConfig.persistenceEnabled) {
    return;
  }

  try {
    await indexEvent(event, client, indexName);
  } catch (error: unknown) {
    logger?.error(
      'Failed to persist zero-hit event',
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

async function indexEvent(event: ZeroHitEvent, client: Client, indexName: string): Promise<void> {
  const doc = {
    '@timestamp': new Date(event.timestamp).toISOString(),
    search_scope: event.scope,
    text: event.text,
    filters: event.filters,
    index_version: event.indexVersion,
  };

  await client.index({ index: indexName, document: doc });
}
