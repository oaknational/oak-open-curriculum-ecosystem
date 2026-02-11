/**
 * Observe CLI handler functions.
 *
 * Handlers for SDK-mapped observability operations: telemetry
 * fetching, zero-hit summaries, and event purging.
 */

import type {
  ZeroHitTelemetry,
  ZeroHitSummary,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { ObservabilityService, TelemetryFetchOptions } from '@oaknational/oak-search-sdk';

/**
 * Fetch persisted telemetry from Elasticsearch.
 *
 * @param observability - The SDK observability service
 * @param options - Fetch options (limit)
 * @returns Telemetry data with summary and recent events
 */
export async function handleTelemetry(
  observability: ObservabilityService,
  options: TelemetryFetchOptions,
): Promise<ZeroHitTelemetry> {
  return observability.fetchTelemetry(options);
}

/**
 * Get an aggregated summary of zero-hit activity.
 *
 * @param observability - The SDK observability service
 * @returns Aggregated zero-hit summary from the in-memory store
 */
export function handleSummary(observability: ObservabilityService): ZeroHitSummary {
  return observability.getZeroHitSummary();
}
