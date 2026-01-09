/**
 * Retry logic with exponential backoff for openapi-fetch client.
 *
 * Automatically retries:
 * - HTTP 429 (rate limit) and 503 (service unavailable) errors
 * - Network exceptions (TypeError: fetch failed, connection refused, etc.)
 *
 * Note: This is implemented as a fetch wrapper rather than middleware because
 * openapi-fetch middleware doesn't support request retries from the onResponse hook.
 *
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { RetryConfig } from '../../config/retry-config.js';
import { calculateBackoff, shouldRetry } from '../../config/retry-config.js';
import { sleep } from './rate-limit.js';

/**
 * Result of a fetch attempt - either a response or an error.
 */
type FetchResult = { readonly response: Response } | { readonly error: Error };

/**
 * Attempt a fetch call, catching network exceptions.
 *
 * @param originalFetch - The fetch function to call
 * @param input - Fetch input (URL or Request)
 * @param init - Fetch init options
 * @returns Response or error if network exception occurred
 */
async function tryFetch(
  originalFetch: typeof fetch,
  input: Parameters<typeof fetch>[0],
  init: RequestInit | undefined,
): Promise<FetchResult> {
  try {
    const response = await originalFetch(input, init);
    return { response };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}

/**
 * Determine if a fetch result should trigger a retry.
 *
 * @param result - The fetch result to check
 * @param config - Retry configuration
 * @returns true if this result should trigger a retry
 */
function shouldRetryResult(result: FetchResult, config: RetryConfig): boolean {
  if ('error' in result) {
    return true; // Always retry network errors
  }
  return shouldRetry(result.response.status, config);
}

/**
 * Unwrap a fetch result, throwing on error.
 *
 * @param result - The fetch result to unwrap
 * @returns The response
 * @throws The error if result contains an error
 */
function unwrapResult(result: FetchResult): Response {
  if ('error' in result) {
    throw result.error;
  }
  return result.response;
}

/**
 * Create a fetch wrapper with retry logic.
 * Wraps a fetch function to add automatic retry with exponential backoff.
 *
 * This function wraps the native fetch (or a custom fetch) to automatically
 * retry requests that fail with:
 * - Retryable status codes (429, 503 by default)
 * - Network exceptions (TypeError: fetch failed, connection errors)
 *
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
    // First attempt
    let lastResult = await tryFetch(originalFetch, input, init);

    // If retry is disabled, return immediately (throw for errors)
    if (!config.enabled) {
      return unwrapResult(lastResult);
    }

    // If first attempt succeeded with non-retryable status, return immediately
    if (!shouldRetryResult(lastResult, config)) {
      return unwrapResult(lastResult);
    }

    // Attempt retries with exponential backoff
    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      const delay = calculateBackoff(attempt, config);
      await sleep(delay);

      const retryInput = input instanceof Request ? input.clone() : input;
      lastResult = await tryFetch(originalFetch, retryInput, init);

      if (!shouldRetryResult(lastResult, config)) {
        break;
      }
    }

    return unwrapResult(lastResult);
  };
}
