/**
 * Observability service interface — zero-hit tracking, persistence, and telemetry.
 *
 * Tracks searches that return no results to support quality improvement.
 * Events are held in an instance-level in-memory store (not module-level
 * state) and optionally persisted to Elasticsearch.
 *
 * Types for zero-hit events, summaries, and telemetry flow from the
 * Curriculum SDK and are re-exported, not redefined.
 */

import type {
  ZeroHitScope,
  ZeroHitEvent,
  ZeroHitSummary,
  ZeroHitTelemetry,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

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
 * await observability.recordZeroHit({
 *   scope: 'lessons',
 *   text: 'quantum computing ks2',
 *   filters: { subject: 'science', keyStage: 'ks2' },
 *   indexVersion: 'v2024.01.0',
 * });
 *
 * // Get recent events
 * const recent = observability.getRecentZeroHits(10);
 *
 * // Get aggregated summary
 * const summary = observability.getZeroHitSummary();
 * ```
 */
export interface ObservabilityService {
  /**
   * Record a zero-hit event.
   *
   * Stores the event in the in-memory store and optionally sends
   * a webhook notification. If persistence is enabled, also indexes
   * the event to Elasticsearch.
   *
   * @param payload - The zero-hit event details
   */
  recordZeroHit(payload: ZeroHitPayload): Promise<void>;

  /**
   * Retrieve recent zero-hit events from the in-memory store.
   *
   * Returns events in reverse chronological order (newest first).
   *
   * @param limit - Maximum number of events to return. Defaults to 50.
   * @returns A readonly array of recent events
   */
  getRecentZeroHits(limit?: number): readonly ZeroHitEvent[];

  /**
   * Get an aggregated summary of zero-hit activity.
   *
   * Summarises total count, per-scope breakdown, and the latest
   * index version from the in-memory store.
   *
   * @returns Aggregated zero-hit summary
   */
  getZeroHitSummary(): ZeroHitSummary;

  /**
   * Persist a zero-hit event to Elasticsearch.
   *
   * Only operates when persistence is enabled in the SDK configuration.
   * When disabled, this method is a no-op.
   *
   * @param event - The zero-hit event to persist
   */
  persistZeroHitEvent(event: ZeroHitEvent): Promise<void>;

  /**
   * Fetch persisted telemetry from Elasticsearch.
   *
   * Retrieves historical zero-hit data from the Elasticsearch
   * telemetry index. Falls back to empty results when the index
   * does not exist.
   *
   * @param options - Fetch options with limit
   * @returns Telemetry data with summary and recent events
   */
  fetchTelemetry(options: TelemetryFetchOptions): Promise<ZeroHitTelemetry>;
}
