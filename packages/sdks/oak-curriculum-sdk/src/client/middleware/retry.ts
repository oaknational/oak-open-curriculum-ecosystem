/**
 * Retry logic with exponential backoff for openapi-fetch client.
 *
 * Automatically retries 429 (rate limit) and 503 (service unavailable) errors.
 *
 * Note: This is implemented as a fetch wrapper rather than middleware because
 * openapi-fetch middleware doesn't support request retries from the onResponse hook.
 */

import type { RetryConfig } from '../../config/retry-config.js';
import { calculateBackoff, shouldRetry } from '../../config/retry-config.js';
import { sleep } from './rate-limit.js';

/**
 * Create a fetch wrapper with retry logic.
 * Wraps a fetch function to add automatic retry with exponential backoff.
 *
 * This function wraps the native fetch (or a custom fetch) to automatically
 * retry requests that fail with retryable status codes (429, 503 by default).
 * It uses exponential backoff to gradually increase the delay between retries.
 *
 * @param originalFetch - The original fetch function to wrap
 * @param config - Retry configuration
 * @returns Wrapped fetch function with retry logic
 * @public
 */
export function createFetchWithRetry(
  originalFetch: typeof fetch,
  config: RetryConfig,
): typeof fetch {
  return async (input: Parameters<typeof fetch>[0], init?: RequestInit): Promise<Response> => {
    let lastResponse: Response = await originalFetch(input, init);

    // If retry is disabled or status is not retryable, return immediately
    if (!shouldRetry(lastResponse.status, config)) {
      return lastResponse;
    }

    // Attempt retries with exponential backoff
    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      // Calculate and wait for backoff delay
      const delay = calculateBackoff(attempt, config);
      await sleep(delay);

      // Clone the request for retry (body can only be read once)
      const retryInput = input instanceof Request ? input.clone() : input;
      lastResponse = await originalFetch(retryInput, init);

      // If success or non-retryable error, return
      if (!shouldRetry(lastResponse.status, config)) {
        return lastResponse;
      }
    }

    // All retries exhausted, return last response
    return lastResponse;
  };
}
