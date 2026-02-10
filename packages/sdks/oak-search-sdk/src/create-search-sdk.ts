/**
 * Factory function for creating a Search SDK instance.
 *
 * This is the stub — implementation will be added during Checkpoints B–D.
 *
 * @packageDocumentation
 */

import type { CreateSearchSdkOptions, SearchSdk } from './types/index.js';

/**
 * Creates a Search SDK instance with retrieval, admin, and observability services.
 *
 * @param options - Dependencies and configuration
 * @returns The SDK instance
 * @throws Error until implementation is complete (Checkpoints B–D)
 */
export function createSearchSdk(options: CreateSearchSdkOptions): SearchSdk {
  // Validate that deps and config are provided — fail fast.
  if (!options.deps.esClient) {
    throw new Error(
      'createSearchSdk: deps.esClient is required. Provide an @elastic/elasticsearch Client instance.',
    );
  }

  if (!options.config.indexTarget) {
    throw new Error("createSearchSdk: config.indexTarget is required. Use 'primary' or 'sandbox'.");
  }

  // TODO: Replace with real service implementations (Checkpoints B–D).
  throw new Error(
    'createSearchSdk: Not yet implemented. Service implementations will be added during SDK extraction (Checkpoints B–D).',
  );
}
