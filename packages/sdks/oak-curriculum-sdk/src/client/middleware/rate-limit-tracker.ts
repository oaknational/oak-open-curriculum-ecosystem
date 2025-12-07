/**
 * @module rate-limit-tracker
 * @description Tracks and logs API rate limit information from response headers.
 * Provides visibility into rate limit consumption and warnings when approaching limits.
 */

import type { Middleware } from 'openapi-fetch';

export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  reset: number | null; // Unix timestamp in milliseconds
  resetDate: Date | null;
  lastChecked: Date;
}

export interface RateLimitTracker {
  getStatus(): RateLimitInfo;
  getRequestCount(): number;
  getRequestRate(): number; // requests per second
  reset(): void;
}

interface TrackerState {
  requestCount: number;
  startTime: number;
  lastRateLimit: RateLimitInfo;
}

/**
 * Extract rate limit information from response headers.
 * @internal
 */
function extractRateLimitInfo(response: Response): RateLimitInfo | null {
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (!limit && !remaining && !reset) {
    return null;
  }

  return {
    limit: limit ? parseInt(limit, 10) : null,
    remaining: remaining ? parseInt(remaining, 10) : null,
    reset: reset ? parseInt(reset, 10) * 1000 : null, // Convert to ms
    resetDate: reset ? new Date(parseInt(reset, 10) * 1000) : null,
    lastChecked: new Date(),
  };
}

/**
 * Create middleware that tracks rate limit information from API responses.
 * Monitors the X-RateLimit-* headers and provides metrics about API usage.
 *
 * @returns Middleware and tracker interface
 */
export function createRateLimitTracker(): {
  middleware: Middleware;
  tracker: RateLimitTracker;
} {
  const state: TrackerState = {
    requestCount: 0,
    startTime: Date.now(),
    lastRateLimit: {
      limit: null,
      remaining: null,
      reset: null,
      resetDate: null,
      lastChecked: new Date(),
    },
  };

  const middleware: Middleware = {
    onResponse({ response }) {
      state.requestCount++;

      const rateLimitInfo = extractRateLimitInfo(response);
      if (rateLimitInfo) {
        state.lastRateLimit = rateLimitInfo;
      }

      return response;
    },
  };

  const tracker: RateLimitTracker = {
    getStatus() {
      return { ...state.lastRateLimit };
    },
    getRequestCount() {
      return state.requestCount;
    },
    getRequestRate() {
      const elapsed = (Date.now() - state.startTime) / 1000; // seconds
      return elapsed > 0 ? state.requestCount / elapsed : 0;
    },
    reset() {
      state.requestCount = 0;
      state.startTime = Date.now();
    },
  };

  return { middleware, tracker };
}
