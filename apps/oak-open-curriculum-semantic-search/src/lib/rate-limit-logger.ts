/**
 * @module rate-limit-logger
 * @description Utilities for logging rate limit status and warnings.
 */

import type { RateLimitTracker, RateLimitInfo } from '@oaknational/oak-curriculum-sdk';
import { sandboxLogger } from './logger';

/**
 * Format rate limit info for logging
 */
function formatRateLimitInfo(info: RateLimitInfo): object {
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

  sandboxLogger.info('API Rate Limit Status', {
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
      sandboxLogger.warn('⚠️  Rate limit critical: 90%+ quota used', {
        remaining: status.remaining,
        limit: status.limit,
        percentUsed: `${percentUsed.toFixed(1)}%`,
      });
    } else if (percentUsed >= 75) {
      sandboxLogger.warn('⚠️  Rate limit warning: 75%+ quota used', {
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
