/**
 * SDK client factory for Oak Curriculum API
 * Creates configured API client instances
 */

import { createApiClient } from '@oaknational/oak-curriculum-sdk';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';

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
 * Creates configured Oak API client
 */
export function createSdkClient(config: SdkClientConfig): OakApiClient {
  return createApiClient({
    apiKey: config.apiKey || process.env.OAK_API_KEY,
    baseUrl: config.baseUrl,
  });
}
