/**
 * @module rate-limit
 * @description Rate limiting middleware for openapi-fetch client.
 * Enforces minimum interval between requests to prevent 429 errors.
 */

import type { Middleware } from 'openapi-fetch';
import type { RateLimitConfig } from '../../config/rate-limit-config.js';
import { calculateDelay } from '../../config/rate-limit-config.js';

/**
 * State for tracking request timing.
 * Mutable by design - middleware pattern requires state.
 */
interface RateLimitState {
  lastRequestTime: number;
}

/**
 * Sleep utility for rate limiting delays.
 * Extracted for testability.
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create rate limiting middleware for openapi-fetch client.
 * Enforces minimum interval between requests by delaying when necessary.
 *
 * The middleware intercepts requests before they're sent and ensures
 * that enough time has elapsed since the last request. If not, it delays
 * the request to enforce the minimum interval.
 *
 * @param config - Rate limit configuration
 * @returns Middleware function for openapi-fetch
 */
export function createRateLimitMiddleware(config: RateLimitConfig): Middleware {
  const state: RateLimitState = { lastRequestTime: 0 };

  return {
    async onRequest({ request }) {
      const delay = calculateDelay(state.lastRequestTime, config);
      if (delay > 0) {
        await sleep(delay);
      }
      state.lastRequestTime = Date.now();
      return request;
    },
  };
}
