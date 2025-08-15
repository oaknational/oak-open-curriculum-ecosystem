/**
 * SDK client factory for Oak Curriculum API
 * Creates configured API client instances
 */

// CRITICAL: Import ONLY path-based client functions, NEVER OakApiClient
import { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import type { OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';

/**
 * Configuration for SDK client
 */
export interface SdkClientConfig {
  /** API key for authentication */
  apiKey?: string;
  /** Base URL for API (optional) */
  baseUrl?: string;
}

/**
 * Creates configured Oak API PATH-BASED client
 * CRITICAL: Returns OakApiPathBasedClient for pure data-driven execution
 */
export function createSdkClient(config: SdkClientConfig): OakApiPathBasedClient {
  const apiKey = config.apiKey ?? process.env.OAK_API_KEY ?? '';
  if (!apiKey) {
    throw new Error('OAK_API_KEY is required');
  }
  // CRITICAL: Use path-based client for data-driven execution
  // This enables: client[path][method](params) syntax
  return createOakPathBasedClient(apiKey);
}
