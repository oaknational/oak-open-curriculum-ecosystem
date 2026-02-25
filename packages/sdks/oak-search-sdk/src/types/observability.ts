/**
 * Observability service interface — zero-hit tracking, persistence, and telemetry.
 *
 * Tracks searches that return no results to support quality improvement.
 * Events are held in an instance-level in-memory store (not module-level
 * state) and optionally persisted to Elasticsearch.
 *
 * Types for zero-hit events, summaries, and telemetry flow from
 * `@oaknational/sdk-codegen/observability` and are re-exported, not redefined.
 */

import type { Result } from '@oaknational/result';
import type {
  ZeroHitScope,
  ZeroHitEvent,
  ZeroHitSummary,
  ZeroHitTelemetry,
} from '@oaknational/sdk-codegen/observability';

// ---------------------------------------------------------------------------
// Observability error type
// ---------------------------------------------------------------------------

/**
 * Error type for observability service I/O operations.
 *
 * Uses a discriminated union on the `type` field for exhaustive matching.
 * Only applies to methods that perform Elasticsearch I/O — sync in-memory
 * methods (`getRecentZeroHits`, `getZeroHitSummary`) cannot fail.
 *
 * @example
 * ```typescript
 * const result = await sdk.observability.fetchTelemetry({ limit: 50 });
 * if (!result.ok) {
 *   switch (result.error.type) {
 *     case 'es_error':
 *       console.error(`ES error (${result.error.statusCode}): ${result.error.message}`);
 *       break;
 *     case 'unknown':
 *       console.error(`Unexpected: ${result.error.message}`);
 *       break;
 *   }
 * }
 * ```
 */
export type ObservabilityError =
  | {
      /** An Elasticsearch communication or transport error. */
      readonly type: 'es_error';
      /** Human-readable description of the ES error. */
      readonly message: string;
      /** HTTP status code from Elasticsearch, when available. */
      readonly statusCode?: number;
    }
  | {
      /** An error that does not fit the other categories. */
      readonly type: 'unknown';
      /** Human-readable description of the unexpected error. */
      readonly message: string;
    };

// ---------------------------------------------------------------------------
// Zero-hit payload type
// ---------------------------------------------------------------------------

/**
 * Payload for recording a zero-hit event.
 *
 * The `timestamp` is optional — when omitted, the service uses the
 * current time. All other fields are required to properly categorise
 * the event.
 */
export interface ZeroHitPayload {
  /** The search scope that returned zero results. */
  readonly scope: ZeroHitScope;

  /** The search query text that produced no results. */
  readonly text: string;

  /** The filters that were active when the query was made. */
  readonly filters: Readonly<Record<string, string>>;

  /** The index version at the time of the query. */
  readonly indexVersion: string;

  /** Time taken by Elasticsearch (milliseconds). */
  readonly tookMs?: number;

  /** Whether the query timed out. */
  readonly timedOut?: boolean;

  /** Optional explicit timestamp (Unix epoch milliseconds). */
  readonly timestamp?: number;
}

// ---------------------------------------------------------------------------
// Telemetry fetch options
// ---------------------------------------------------------------------------

/** Options for fetching persisted telemetry. */
export interface TelemetryFetchOptions {
  /** Maximum number of recent events to return. */
  readonly limit: number;
}

// ---------------------------------------------------------------------------
// Observability service interface
// ---------------------------------------------------------------------------

/**
 * Observability service — zero-hit tracking, persistence, and telemetry.
 *
 * Each SDK instance maintains its own in-memory event store. Events are
 * optionally persisted to Elasticsearch when persistence is enabled in
 * the SDK configuration.
 *
 * @example
 * ```typescript
 * const { observability } = createSearchSdk({ deps, config });
 *
 * // Record a zero-hit event
 * const recordResult = await observability.recordZeroHit({
 *   scope: 'lessons',
 *   text: 'quantum computing ks2',
 *   filters: { subject: 'science', keyStage: 'ks2' },
 *   indexVersion: 'v2024.01.0',
 * });
 * if (!recordResult.ok) {
 *   console.error(`Persistence failed: ${recordResult.error.message}`);
 * }
 *
 * // Get recent events (sync, cannot fail)
 * const recent = observability.getRecentZeroHits(10);
 *
 * // Get aggregated summary (sync, cannot fail)
 * const summary = observability.getZeroHitSummary();
 * ```
 */
export interface ObservabilityService {
  /**
   * Record a zero-hit event.
   *
   * Stores the event in the in-memory store (always succeeds) and,
   * when persistence is enabled, indexes it to Elasticsearch. If
   * persistence fails, the in-memory recording still succeeds but
   * the failure is surfaced via the `Result`.
   *
   * @param payload - The zero-hit event details
   * @returns `ok` on success, or `err` with an `ObservabilityError` if persistence failed
   */
  recordZeroHit(payload: ZeroHitPayload): Promise<Result<void, ObservabilityError>>;

  /**
   * Retrieve recent zero-hit events from the in-memory store.
   *
   * Returns events in reverse chronological order (newest first).
   * This is a synchronous, pure in-memory operation that cannot fail.
   *
   * @param limit - Maximum number of events to return. Defaults to 50.
   * @returns A readonly array of recent events
   */
  getRecentZeroHits(limit?: number): readonly ZeroHitEvent[];

  /**
   * Get an aggregated summary of zero-hit activity.
   *
   * Summarises total count, per-scope breakdown, and the latest
   * index version from the in-memory store. This is a synchronous,
   * pure in-memory operation that cannot fail.
   *
   * @returns Aggregated zero-hit summary
   */
  getZeroHitSummary(): ZeroHitSummary;

  /**
   * Persist a zero-hit event to Elasticsearch.
   *
   * Only operates when persistence is enabled in the SDK configuration.
   * When disabled, returns `ok` immediately (no-op).
   *
   * @param event - The zero-hit event to persist
   * @returns `ok` on success, or `err` with an `ObservabilityError` if persistence failed
   */
  persistZeroHitEvent(event: ZeroHitEvent): Promise<Result<void, ObservabilityError>>;

  /**
   * Fetch persisted telemetry from Elasticsearch.
   *
   * Retrieves historical zero-hit data from the Elasticsearch
   * telemetry index.
   *
   * @param options - Fetch options with limit
   * @returns `ok` with telemetry data, or `err` with an `ObservabilityError`
   */
  fetchTelemetry(
    options: TelemetryFetchOptions,
  ): Promise<Result<ZeroHitTelemetry, ObservabilityError>>;
}
