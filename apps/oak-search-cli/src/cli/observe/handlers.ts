/**
 * Observe CLI handler functions.
 *
 * Handlers for SDK-mapped observability operations: telemetry
 * fetching and zero-hit summaries. I/O handlers return `Result`;
 * sync handlers return the value directly.
 */

import type { Result } from '@oaknational/result';
import type { ZeroHitTelemetry, ZeroHitSummary } from '@oaknational/sdk-codegen/observability';
import type {
  ObservabilityService,
  ObservabilityError,
  TelemetryFetchOptions,
} from '@oaknational/oak-search-sdk/read';

/**
 * Fetch persisted telemetry from Elasticsearch.
 *
 * @param observability - The SDK observability service
 * @param options - Fetch options (limit)
 * @returns `ok` with telemetry data, or `err` with an `ObservabilityError`
 */
export async function handleTelemetry(
  observability: ObservabilityService,
  options: TelemetryFetchOptions,
): Promise<Result<ZeroHitTelemetry, ObservabilityError>> {
  return observability.fetchTelemetry(options);
}

/**
 * Get an aggregated summary of zero-hit activity.
 *
 * Sync in-memory operation that cannot fail.
 *
 * @param observability - The SDK observability service
 * @returns Aggregated zero-hit summary from the in-memory store
 */
export function handleSummary(observability: ObservabilityService): ZeroHitSummary {
  return observability.getZeroHitSummary();
}
