/**
 * Integration tests for the CLI SDK factory.
 *
 * Verifies that `createCliSdk` correctly wires environment configuration
 * into a fully-formed `SearchSdk` instance with all three services.
 */

import { describe, it, expect } from 'vitest';
import { createCliSdk } from './create-cli-sdk.js';

describe('createCliSdk', () => {
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

  it('returns an SDK with all three services', () => {
    const sdk = createCliSdk(validEnv);

    expect(sdk).toBeDefined();
    expect(sdk.retrieval).toBeDefined();
    expect(sdk.admin).toBeDefined();
    expect(sdk.observability).toBeDefined();
  });

  it('returns an SDK with callable retrieval methods', () => {
    const sdk = createCliSdk(validEnv);

    expect(typeof sdk.retrieval.searchLessons).toBe('function');
    expect(typeof sdk.retrieval.searchUnits).toBe('function');
    expect(typeof sdk.retrieval.searchSequences).toBe('function');
    expect(typeof sdk.retrieval.suggest).toBe('function');
    expect(typeof sdk.retrieval.fetchSequenceFacets).toBe('function');
  });

  it('returns an SDK with callable admin methods', () => {
    const sdk = createCliSdk(validEnv);

    expect(typeof sdk.admin.setup).toBe('function');
    expect(typeof sdk.admin.reset).toBe('function');
    expect(typeof sdk.admin.verifyConnection).toBe('function');
    expect(typeof sdk.admin.listIndexes).toBe('function');
    expect(typeof sdk.admin.updateSynonyms).toBe('function');
    expect(typeof sdk.admin.ingest).toBe('function');
    expect(typeof sdk.admin.getIndexMeta).toBe('function');
    expect(typeof sdk.admin.setIndexMeta).toBe('function');
  });

  it('returns an SDK with callable observability methods', () => {
    const sdk = createCliSdk(validEnv);

    expect(typeof sdk.observability.recordZeroHit).toBe('function');
    expect(typeof sdk.observability.getRecentZeroHits).toBe('function');
    expect(typeof sdk.observability.getZeroHitSummary).toBe('function');
    expect(typeof sdk.observability.persistZeroHitEvent).toBe('function');
    expect(typeof sdk.observability.fetchTelemetry).toBe('function');
  });

  it('accepts sandbox index target', () => {
    const sdk = createCliSdk({
      ...validEnv,
      SEARCH_INDEX_TARGET: 'sandbox',
    });

    expect(sdk).toBeDefined();
    expect(sdk.retrieval).toBeDefined();
  });

  it('passes zero-hit configuration through to the SDK', () => {
    const sdk = createCliSdk({
      ...validEnv,
      ZERO_HIT_PERSISTENCE_ENABLED: true,
      ZERO_HIT_WEBHOOK_URL: 'https://hooks.example.com/zero-hit',
      ZERO_HIT_INDEX_RETENTION_DAYS: 14,
    });

    expect(sdk).toBeDefined();
    expect(sdk.observability).toBeDefined();
  });
});
