import { BaseApiClient } from './oak-base-client.js';
import type { OakApiClient, OakApiPathBasedClient, OakClientConfig } from './oak-base-client.js';

/**
 * Create an Oak API client using the OpenAPI-Fetch style interface.
 *
 * Supports both legacy API key string and new configuration object with
 * rate limiting and retry options.
 *
 * Environment-agnostic: The SDK core never reads environment variables.
 * Always pass the API key explicitly.
 *
 * @param config - API key string (legacy) or configuration object
 * @returns The method-based `OakApiClient` instance
 *
 * @example
 * // Legacy usage (backwards compatible)
 * const client = createOakClient('my-api-key');
 *
 * @example
 * // New usage with rate limiting and retry configuration
 * const client = createOakClient({
 *   apiKey: 'my-api-key',
 *   rateLimit: { minRequestInterval: 200 },
 *   retry: { maxRetries: 5 }
 * });
 */
export function createOakClient(config: OakClientConfig | string): OakApiClient {
  const _client = new BaseApiClient(config);
  const baseClient = _client.client;
  return baseClient;
}

/**
 * Create an Oak API client using the path-indexed interface.
 *
 * Supports both legacy API key string and new configuration object with
 * rate limiting and retry options.
 *
 * Environment-agnostic: The SDK core never reads environment variables.
 * Always pass the API key explicitly.
 *
 * @param config - API key string (legacy) or configuration object
 * @returns The path-based `OakApiPathBasedClient` instance
 *
 * @example
 * // Legacy usage (backwards compatible)
 * const client = createOakPathBasedClient('my-api-key');
 *
 * @example
 * // New usage with rate limiting and retry configuration
 * const client = createOakPathBasedClient({
 *   apiKey: 'my-api-key',
 *   rateLimit: { minRequestInterval: 200 },
 *   retry: { maxRetries: 5 }
 * });
 */
export function createOakPathBasedClient(config: OakClientConfig | string): OakApiPathBasedClient {
  const _client = new BaseApiClient(config);
  const pathBasedClient = _client.pathBasedClient;
  return pathBasedClient;
}

/**
 * Create the full Oak API base client with access to all features including rate limit tracking.
 *
 * This returns the BaseApiClient instance which provides access to:
 * - The standard client interface
 * - The path-based client interface
 * - The rate limit tracker for monitoring API usage
 *
 * @param config - API key string (legacy) or configuration object
 * @returns The full BaseApiClient instance
 *
 * @example
 * const baseClient = createOakBaseClient({
 *   apiKey: 'my-api-key',
 *   rateLimit: { minRequestInterval: 200 },
 *   retry: { maxRetries: 5 }
 * });
 *
 * // Access the client
 * const data = await baseClient.client.GET('/subjects');
 *
 * // Check rate limit status
 * const status = baseClient.rateLimitTracker.getStatus();
 * console.log('Remaining requests:', status.remaining);
 */
export function createOakBaseClient(config: OakClientConfig | string): BaseApiClient {
  return new BaseApiClient(config);
}

// Do not export classes directly, access is through the factory functions only.

// Re-export types for convenience
export type { OakApiClient, OakApiPathBasedClient, OakClientConfig } from './oak-base-client.js';
export { BaseApiClient } from './oak-base-client.js';
export type { paths } from '../types/generated/api-schema/api-paths-types';
