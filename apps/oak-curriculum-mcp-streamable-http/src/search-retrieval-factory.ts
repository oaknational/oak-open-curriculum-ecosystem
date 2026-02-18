/**
 * Factory for creating the SearchRetrievalService from validated ES credentials.
 *
 * Extracted from handlers.ts to keep that file within the max-lines limit.
 * Accepts injectable factory dependencies for testability per ADR-078.
 *
 * The factory uses a generic type parameter `TClient` so that tests can
 * inject simple fakes without needing to construct a real ES Client.
 */

import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { Client, type ClientOptions } from '@elastic/elasticsearch';
import { createSearchSdk } from '@oaknational/oak-search-sdk';

/**
 * Injectable factory dependencies for testability.
 *
 * Defaults to the real `@elastic/elasticsearch` Client and
 * `@oaknational/oak-search-sdk` createSearchSdk. Tests inject
 * simple fakes to avoid external resource creation.
 *
 * @typeParam TClient - The ES client type. Defaults to `Client` for
 *   production. Tests can use any type (e.g., an empty object).
 */
export interface SearchRetrievalFactories<TClient = Client> {
  /** Creates an Elasticsearch client from configuration. */
  readonly createEsClient: (config: ClientOptions) => TClient;
  /** Creates the Search SDK from an ES client and configuration. */
  readonly createSdk: (config: {
    readonly deps: { readonly esClient: TClient };
    readonly config: { readonly indexTarget: 'primary' };
  }) => { readonly retrieval: SearchRetrievalService };
}

/**
 * Default factories using the real Elasticsearch client and Search SDK.
 */
const defaultFactories: SearchRetrievalFactories<Client> = {
  createEsClient: (config) => new Client(config),
  createSdk: (config) => createSearchSdk(config),
};

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
  factories: SearchRetrievalFactories = defaultFactories,
): SearchRetrievalService {
  const esClient = factories.createEsClient({
    node: env.ELASTICSEARCH_URL,
    auth: { apiKey: env.ELASTICSEARCH_API_KEY },
  });
  const searchSdk = factories.createSdk({
    deps: { esClient },
    config: { indexTarget: 'primary' },
  });
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return searchSdk.retrieval;
}
