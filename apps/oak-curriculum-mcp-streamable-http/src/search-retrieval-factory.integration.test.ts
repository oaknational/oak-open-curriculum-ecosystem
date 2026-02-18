/**
 * Integration tests for the search retrieval factory.
 *
 * Verifies that createSearchRetrieval delegates to injected factories
 * and logs appropriate status messages when given valid credentials.
 *
 * Uses the generic `SearchRetrievalFactories<TClient>` interface to
 * inject simple fakes without constructing real ES Client instances.
 */

import { describe, it, expect, vi } from 'vitest';
import type { ClientOptions } from '@elastic/elasticsearch';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  createSearchRetrieval,
  type SearchRetrievalFactories,
} from './search-retrieval-factory.js';
import { createFakeSearchRetrieval } from './test-helpers/fakes.js';

/**
 * Fake client type used in tests. An empty interface is fine because
 * the mock SDK factory never exercises the client's methods.
 */
interface FakeClient {
  readonly _brand: 'fake-es-client';
}

/** A specific fake client value. */
const fakeEsClient: FakeClient = { _brand: 'fake-es-client' };

/** Creates a simple fake logger that records info messages. */
function createFakeLogger(): { info: (msg: string) => void; messages: string[] } {
  const messages: string[] = [];
  return {
    info: vi.fn<(msg: string) => void>((msg) => {
      messages.push(msg);
    }),
    messages,
  };
}

/** Creates fake factories typed with FakeClient. */
function createFakeFactories(
  retrieval: SearchRetrievalService,
): SearchRetrievalFactories<FakeClient> {
  return {
    createEsClient: vi.fn<(config: ClientOptions) => FakeClient>().mockReturnValue(fakeEsClient),
    createSdk: vi
      .fn<SearchRetrievalFactories<FakeClient>['createSdk']>()
      .mockReturnValue({ retrieval }),
  };
}

describe('createSearchRetrieval', () => {
  describe('when credentials are present', () => {
    const validEnv = {
      ELASTICSEARCH_URL: 'http://localhost:9200',
      ELASTICSEARCH_API_KEY: 'test-api-key',
    };

    it('returns a SearchRetrievalService', () => {
      const logger = createFakeLogger();
      const retrieval = createFakeSearchRetrieval();
      const factories = createFakeFactories(retrieval);

      const result = createSearchRetrieval(validEnv, logger, factories);

      expect(result).toBe(retrieval);
    });

    it('passes ES URL and API key to the client factory', () => {
      const logger = createFakeLogger();
      const factories = createFakeFactories(createFakeSearchRetrieval());

      createSearchRetrieval(validEnv, logger, factories);

      expect(factories.createEsClient).toHaveBeenCalledOnce();
      expect(factories.createEsClient).toHaveBeenCalledWith({
        node: 'http://localhost:9200',
        auth: { apiKey: 'test-api-key' },
      });
    });

    it('passes ES client to the SDK factory with primary index target', () => {
      const logger = createFakeLogger();
      const factories = createFakeFactories(createFakeSearchRetrieval());

      createSearchRetrieval(validEnv, logger, factories);

      expect(factories.createSdk).toHaveBeenCalledOnce();
      expect(factories.createSdk).toHaveBeenCalledWith({
        deps: { esClient: fakeEsClient },
        config: { indexTarget: 'primary' },
      });
    });

    it('logs a configured message', () => {
      const logger = createFakeLogger();
      const factories = createFakeFactories(createFakeSearchRetrieval());

      createSearchRetrieval(validEnv, logger, factories);

      expect(logger.info).toHaveBeenCalledOnce();
      expect(logger.messages[0]).toContain('configured');
    });
  });
});
