/**
 * Factory function for creating a Search SDK instance.
 *
 * Creates stateful service instances that hold the injected
 * dependencies as closures. Each call produces an independent
 * SDK instance with its own in-memory state.
 */

import type { CreateSearchSdkOptions, SearchSdk } from './types/index.js';
import { createRetrievalService } from './retrieval/index.js';
import { createAdminService } from './admin/index.js';
import { createObservabilityService } from './observability/index.js';

/**
 * Creates a Search SDK instance with retrieval, admin, and observability services.
 *
 * @param options - Dependencies and configuration
 * @returns The SDK instance
 *
 * @example
 * ```typescript
 * import { createSearchSdk } from '@oaknational/oak-search-sdk';
 * import { Client } from '@elastic/elasticsearch';
 *
 * const sdk = createSearchSdk({
 *   deps: {
 *     esClient: new Client({ node: esUrl, auth: { apiKey } }),
 *   },
 *   config: { indexTarget: 'primary' },
 * });
 *
 * const results = await sdk.retrieval.searchLessons({
 *   query: 'expanding brackets',
 *   subject: 'maths',
 *   keyStage: 'ks3',
 * });
 * ```
 */
export function createSearchSdk(options: CreateSearchSdkOptions): SearchSdk {
  if (!options.deps.esClient) {
    throw new Error(
      'createSearchSdk: deps.esClient is required. Provide an @elastic/elasticsearch Client instance.',
    );
  }

  if (!options.config.indexTarget) {
    throw new Error("createSearchSdk: config.indexTarget is required. Use 'primary' or 'sandbox'.");
  }

  const { esClient, logger } = options.deps;
  const config = options.config;

  const retrieval = createRetrievalService(esClient, config, logger);
  const admin = createAdminService(esClient, config, logger);
  const observability = createObservabilityService(esClient, config, logger);

  return { retrieval, admin, observability };
}
