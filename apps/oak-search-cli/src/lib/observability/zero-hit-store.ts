import type { SearchScope } from '../../types/oak';

/** Maximum number of zero-hit events retained in memory. */
const MAX_EVENTS = 200;

type ZeroHitScope = SearchScope;

/**
 * Represents a single zero-hit telemetry event stored for dashboard consumption.
 */
interface ZeroHitEvent {
  timestamp: number;
  scope: ZeroHitScope;
  query: string;
  filters: Record<string, string>;
  indexVersion: string;
  tookMs?: number;
  timedOut?: boolean;
  requestId?: string;
  sessionId?: string;
}

const events: ZeroHitEvent[] = [];

/**
 * Record a zero-hit event in memory for subsequent aggregation.
 * Oldest entries are discarded once the maximum capacity is reached.
 */
export function recordZeroHitEvent(
  event: Omit<ZeroHitEvent, 'timestamp'> & { timestamp?: number },
): void {
  const entry: ZeroHitEvent = {
    timestamp: event.timestamp ?? Date.now(),
    scope: event.scope,
    query: event.query,
    filters: event.filters,
    indexVersion: event.indexVersion,
    tookMs: event.tookMs,
    timedOut: event.timedOut,
    requestId: event.requestId,
    sessionId: event.sessionId,
  };

  events.unshift(entry);
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }
}

/**
 * Return a copy of the recent zero-hit events ordered from newest to oldest.
 */
export function getZeroHitRecent(limit = 50): ZeroHitEvent[] {
  return events.slice(0, Math.max(0, limit));
}

/**
 * Summarise zero-hit activity grouped by search scope and overall totals.
 */
export function getZeroHitSummary(): {
  total: number;
  byScope: Record<ZeroHitScope, number>;
  latestIndexVersion: string | null;
} {
  const byScope: Record<ZeroHitScope, number> = {
    lessons: 0,
    units: 0,
    sequences: 0,
  };

  for (const event of events) {
    byScope[event.scope] += 1;
  }

  return {
    total: events.length,
    byScope,
    latestIndexVersion: events.length > 0 ? events[0].indexVersion : null,
  };
}

/**
 * Utility reserved for tests to clear the in-memory store between assertions.
 */
export function resetZeroHitStore(): void {
  events.length = 0;
}
