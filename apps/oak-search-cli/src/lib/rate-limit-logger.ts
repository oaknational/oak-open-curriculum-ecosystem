/**
 * Utilities for logging rate limit status and warnings.
 */

import type { RateLimitTracker, RateLimitInfo } from '@oaknational/curriculum-sdk';
import type { LogContextInput } from '@oaknational/logger';
import { ingestLogger } from './logger';

/** Structured rate limit info for logging */
interface FormattedRateLimitInfo extends LogContextInput {
  readonly limit: number | 'unknown';
  readonly remaining: number | 'unknown';
  readonly used: number | 'unknown';
  readonly resetTime: string;
  readonly resetIn: string;
}

/**
 * Format rate limit info for logging
 */
function formatRateLimitInfo(info: RateLimitInfo): FormattedRateLimitInfo {
  return {
    limit: info.limit ?? 'unknown',
    remaining: info.remaining ?? 'unknown',
    used: info.limit && info.remaining ? info.limit - info.remaining : 'unknown',
    resetTime: info.resetDate ? info.resetDate.toISOString() : 'unknown',
    resetIn: info.reset ? `${Math.round((info.reset - Date.now()) / 1000 / 60)}min` : 'unknown',
  };
}

/**
 * Log current rate limit status
 */
export function logRateLimitStatus(tracker: RateLimitTracker): void {
  const status = tracker.getStatus();
  const requestCount = tracker.getRequestCount();
  const requestRate = tracker.getRequestRate();

  ingestLogger.info('API Rate Limit Status', {
    requests: {
      count: requestCount,
      rate: `${requestRate.toFixed(2)}/sec`,
    },
    rateLimit: formatRateLimitInfo(status),
  });

  // Warn if approaching limit
  if (status.remaining !== null && status.limit !== null) {
    const percentUsed = ((status.limit - status.remaining) / status.limit) * 100;

    if (percentUsed >= 90) {
      ingestLogger.warn('⚠️  Rate limit critical: 90%+ quota used', {
        remaining: status.remaining,
        limit: status.limit,
        percentUsed: `${percentUsed.toFixed(1)}%`,
      });
    } else if (percentUsed >= 75) {
      ingestLogger.warn('⚠️  Rate limit warning: 75%+ quota used', {
        remaining: status.remaining,
        limit: status.limit,
        percentUsed: `${percentUsed.toFixed(1)}%`,
      });
    }
  }
}

/**
 * Create a periodic logger that logs rate limit status at intervals
 */
export function startRateLimitMonitoring(
  tracker: RateLimitTracker,
  intervalMs = 30000,
): () => void {
  const intervalId = setInterval(() => {
    logRateLimitStatus(tracker);
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

/**
 * Execute an async operation with rate limit monitoring.
 *
 * Logs initial status, monitors periodically, logs final status on completion.
 *
 * @typeParam T - Return type of the operation
 * @param tracker - Rate limit tracker to monitor
 * @param intervalMs - Monitoring interval in milliseconds (default 30000)
 * @param operation - Async operation to execute
 * @returns Result of the operation
 */
export async function withRateLimitMonitoring<T>(
  tracker: RateLimitTracker,
  intervalMs: number,
  operation: () => Promise<T>,
): Promise<T> {
  logRateLimitStatus(tracker);
  const stopMonitoring = startRateLimitMonitoring(tracker, intervalMs);

  try {
    return await operation();
  } finally {
    ingestLogger.info('Final API usage statistics');
    logRateLimitStatus(tracker);
    stopMonitoring();
  }
}
