/** Integration tests for shared CLI client construction helpers. */

import { describe, it, expect } from 'vitest';
import { createEsClient } from './create-cli-sdk.js';

describe('createEsClient', () => {
  const validEnv = {
    ELASTICSEARCH_URL: 'https://test-es.example.com:9243',
    ELASTICSEARCH_API_KEY: 'REDACTED',
    OAK_API_KEY: 'oak-api-key-123',
    SEARCH_API_KEY: 'search-api-key-at-least-10-chars',
    SEARCH_INDEX_TARGET: 'primary' as const,
    SEARCH_INDEX_VERSION: 'v1-test',
    ZERO_HIT_WEBHOOK_URL: 'none' as const,
    ZERO_HIT_PERSISTENCE_ENABLED: false,
    ZERO_HIT_INDEX_RETENTION_DAYS: 30,
  };

  it('creates an Elasticsearch client with valid environment values', () => {
    const client = createEsClient(validEnv);
    expect(client).toBeDefined();
  });

  it('accepts sandbox index target', () => {
    const client = createEsClient({
      ...validEnv,
      SEARCH_INDEX_TARGET: 'sandbox',
    });

    expect(client).toBeDefined();
  });

  it('ignores optional zero-hit configuration for client construction', () => {
    const client = createEsClient({
      ...validEnv,
      ZERO_HIT_PERSISTENCE_ENABLED: true,
      ZERO_HIT_WEBHOOK_URL: 'https://hooks.example.com/zero-hit',
      ZERO_HIT_INDEX_RETENTION_DAYS: 14,
    });

    expect(client).toBeDefined();
  });
});
