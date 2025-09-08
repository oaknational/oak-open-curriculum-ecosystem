import { BaseApiClient } from './oak-base-client.js';
import type { OakApiClient, OakApiPathBasedClient } from './oak-base-client.js';

/**
 * Create an Oak API client using the OpenAPI-Fetch style interface.
 *
 * Environment-agnostic: The SDK core never reads environment variables.
 * Always pass the API key explicitly.
 *
 * @param apiKey - API key to authorize requests.
 * @returns The method-based `OakApiClient` instance.
 */
export function createOakClient(apiKey: string): OakApiClient {
  const _client = new BaseApiClient(apiKey);
  const baseClient = _client.client;
  return baseClient;
}

/**
 * Create an Oak API client using the path-indexed interface.
 *
 * Environment-agnostic: The SDK core never reads environment variables.
 * Always pass the API key explicitly.
 *
 * @param apiKey - API key to authorize requests.
 * @returns The path-based `OakApiPathBasedClient` instance.
 */
export function createOakPathBasedClient(apiKey: string): OakApiPathBasedClient {
  const _client = new BaseApiClient(apiKey);
  const pathBasedClient = _client.pathBasedClient;
  return pathBasedClient;
}

// Do not export classes, access is through the factory functions only.

// Re-export types for convenience
export type { OakApiClient, OakApiPathBasedClient } from './oak-base-client.js';
export type { paths } from '../types/generated/api-schema/api-paths-types';
