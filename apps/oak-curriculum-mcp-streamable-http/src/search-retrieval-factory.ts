/**
 * Factory for creating the SearchRetrievalService from validated ES credentials.
 *
 * Delegates to the shared `createSearchRetrieval` in `@oaknational/oak-search-sdk`
 * and re-exports its DI types for app-local test usage.
 *
 * **Connectivity trade-off**: The ES client is created with credentials but no
 * startup health check or warm-up ping is performed. The first search tool call
 * is the first time the client contacts Elasticsearch. If ES is unreachable,
 * the error surfaces at query time, not at startup. This is acceptable for the
 * public alpha because: (1) Vercel cold starts benefit from fast bootstrap,
 * (2) ES errors are already mapped to typed `RetrievalError` results, and
 * (3) a startup ping would add complexity without improving the user-facing
 * error path. Revisit if startup health gates are needed for production.
 */

import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  createSearchRetrieval as createRetrievalFromCredentials,
  type SearchRetrievalFactories,
} from '@oaknational/oak-search-sdk';

export type { SearchRetrievalFactories };

/**
 * Creates a SearchRetrievalService from validated environment credentials.
 *
 * @param env - Environment variables with ES credentials (validated by env schema)
 * @param logger - Logger for startup messages
 * @returns SearchRetrievalService connected to Elasticsearch
 */
export function createSearchRetrieval(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
): SearchRetrievalService;

/**
 * Creates a SearchRetrievalService with injectable factory dependencies.
 *
 * @param env - Environment variables with ES credentials (validated by env schema)
 * @param logger - Logger for startup messages
 * @param factories - Injectable factory dependencies for testability
 * @returns SearchRetrievalService connected to Elasticsearch
 */
export function createSearchRetrieval<TClient>(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
  factories: SearchRetrievalFactories<TClient>,
): SearchRetrievalService;

export function createSearchRetrieval(
  env: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string },
  logger: { info: (msg: string) => void },
  factories?: SearchRetrievalFactories,
): SearchRetrievalService {
  const retrieval = factories
    ? createRetrievalFromCredentials(env, factories)
    : createRetrievalFromCredentials(env);
  logger.info('Search retrieval service configured (lazy connection — no startup ping)');
  return retrieval;
}
