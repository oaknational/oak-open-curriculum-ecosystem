/**
 * Tests for the createSearchRetrieval convenience factory.
 *
 * Uses simple fakes — no real ES client or network calls.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSearchRetrieval } from './create-search-retrieval.js';

describe('createSearchRetrieval', () => {
  const credentials = {
    ELASTICSEARCH_URL: 'https://es.example.com',
    ELASTICSEARCH_API_KEY: 'test-api-key',
  };

  it('returns a RetrievalService from ES credentials', () => {
    const fakeRetrieval = { searchLessons: vi.fn() };
    const fakeSdk = { retrieval: fakeRetrieval };

    const result = createSearchRetrieval(credentials, {
      createEsClient: vi.fn().mockReturnValue({}),
      createSdk: vi.fn().mockReturnValue(fakeSdk),
    });

    expect(result).toBe(fakeRetrieval);
  });

  it('passes ES credentials to the client factory', () => {
    const createEsClient = vi.fn().mockReturnValue({});
    const createSdk = vi.fn().mockReturnValue({ retrieval: {} });

    createSearchRetrieval(credentials, { createEsClient, createSdk });

    expect(createEsClient).toHaveBeenCalledWith({
      node: 'https://es.example.com',
      auth: { apiKey: 'test-api-key' },
    });
  });

  it('passes the ES client and primary index target to the SDK factory', () => {
    const fakeClient = { ping: vi.fn() };
    const createEsClient = vi.fn().mockReturnValue(fakeClient);
    const createSdk = vi.fn().mockReturnValue({ retrieval: {} });

    createSearchRetrieval(credentials, { createEsClient, createSdk });

    expect(createSdk).toHaveBeenCalledWith({
      deps: { esClient: fakeClient },
      config: { indexTarget: 'primary' },
    });
  });
});
