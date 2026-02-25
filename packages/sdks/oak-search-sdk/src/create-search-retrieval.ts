/**
 * Convenience factory: ES credentials → RetrievalService.
 *
 * Encapsulates the common pattern of creating an Elasticsearch client and
 * a Search SDK instance to obtain a {@link RetrievalService}. Both MCP
 * server apps (stdio and HTTP) use this instead of duplicating the
 * composition logic.
 *
 * Uses dependency injection for the ES client and SDK factories so that
 * tests can substitute simple fakes without network access.
 */

import { Client } from '@elastic/elasticsearch';
import { createSearchSdk } from './create-search-sdk.js';
import type { RetrievalService } from './types/index.js';

/** Derived from the public Client constructor — avoids deep-importing internal types. */
export type EsClientConfig = ConstructorParameters<typeof Client>[0];

/**
 * Injectable factory dependencies for testability.
 *
 * Defaults to the real `@elastic/elasticsearch` Client and
 * `@oaknational/oak-search-sdk` createSearchSdk. Tests inject
 * simple fakes to avoid external resource creation.
 */
export interface SearchRetrievalFactories<TClient = Client> {
  readonly createEsClient: (config: EsClientConfig) => TClient;
  readonly createSdk: (config: {
    readonly deps: { readonly esClient: TClient };
    readonly config: { readonly indexTarget: 'primary' };
  }) => { readonly retrieval: RetrievalService };
}

const defaultFactories: SearchRetrievalFactories<Client> = {
  createEsClient: (config) => new Client(config),
  createSdk: (config) => createSearchSdk(config),
};

/**
 * Creates a {@link RetrievalService} from Elasticsearch credentials.
 *
 * @param credentials - Validated environment variables with ES connection details
 * @param factories - Injectable factory dependencies (defaults to real implementations)
 * @returns A RetrievalService connected to Elasticsearch
 *
 * @example
 * ```typescript
 * import { createSearchRetrieval } from '@oaknational/oak-search-sdk';
 *
 * const retrieval = createSearchRetrieval({
 *   ELASTICSEARCH_URL: 'https://es.example.com',
 *   ELASTICSEARCH_API_KEY: 'my-api-key',
 * });
 * ```
 */
export function createSearchRetrieval(
  credentials: {
    readonly ELASTICSEARCH_URL: string;
    readonly ELASTICSEARCH_API_KEY: string;
  },
  factories?: SearchRetrievalFactories,
): RetrievalService;

export function createSearchRetrieval<TClient>(
  credentials: {
    readonly ELASTICSEARCH_URL: string;
    readonly ELASTICSEARCH_API_KEY: string;
  },
  factories: SearchRetrievalFactories<TClient>,
): RetrievalService;

export function createSearchRetrieval(
  credentials: {
    readonly ELASTICSEARCH_URL: string;
    readonly ELASTICSEARCH_API_KEY: string;
  },
  factories: SearchRetrievalFactories = defaultFactories,
): RetrievalService {
  const esClient = factories.createEsClient({
    node: credentials.ELASTICSEARCH_URL,
    auth: { apiKey: credentials.ELASTICSEARCH_API_KEY },
  });
  const searchSdk = factories.createSdk({
    deps: { esClient },
    config: { indexTarget: 'primary' },
  });
  return searchSdk.retrieval;
}
