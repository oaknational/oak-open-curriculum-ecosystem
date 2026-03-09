/**
 * Integration tests for the Search SDK factory and service interfaces.
 *
 * These tests specify the contract for all three services. Every I/O
 * method returns `Result<T, E>` — tests assert `result.ok` before
 * accessing `result.value`.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSearchSdk } from './create-search-sdk.js';
import type { SearchSdk, SearchSdkDeps, SearchSdkConfig } from './types/index.js';
import { Client, type estypes } from '@elastic/elasticsearch';

// ---------------------------------------------------------------------------
// Test helpers — simple fakes injected as arguments
// ---------------------------------------------------------------------------

/**
 * Empty but valid ES search response shape.
 *
 * Used by `vi.spyOn` mocks on the Client instance. Returns
 * empty result sets with structurally valid metadata so the SDK
 * can process them into correctly-shaped domain results.
 */
const EMPTY_SEARCH_RESPONSE = {
  hits: { total: { value: 0, relation: 'eq' as const }, max_score: null, hits: [] },
  took: 1,
  timed_out: false,
  _shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
  suggest: {
    suggestions: [
      {
        text: '',
        offset: 0,
        length: 0,
        options: [],
      },
    ],
  },
};

const EMPTY_INFO_RESPONSE = {
  name: 'test-node',
  cluster_name: 'test-cluster',
  cluster_uuid: 'test-uuid',
  version: {
    number: '8.17.0',
    build_flavor: 'default',
    build_type: 'tar',
    build_hash: 'abc',
    build_date: '2024-01-01',
    build_snapshot: false,
    lucene_version: '9.0',
    minimum_wire_compatibility_version: '7.17.0',
    minimum_index_compatibility_version: '7.0.0',
  },
  tagline: 'You Know, for Search',
};

/**
 * Create a real ES Client with all methods spied to return
 * valid empty responses. No network IO occurs.
 */
function createTestEsClient(): Client {
  const client = new Client({ node: 'http://localhost:19200' });

  vi.spyOn(client, 'search').mockResolvedValue(EMPTY_SEARCH_RESPONSE);
  vi.spyOn(client, 'index').mockResolvedValue({
    _index: 'test',
    _id: '1',
    _version: 1,
    result: 'created',
    _shards: { total: 1, successful: 1, failed: 0 },
    _seq_no: 0,
    _primary_term: 1,
  });
  vi.spyOn(client, 'get').mockResolvedValue({
    _index: 'oak_meta',
    _id: 'index_version',
    _version: 1,
    _seq_no: 0,
    _primary_term: 1,
    found: true,
    _source: {
      version: 'v-test',
      ingested_at: '2024-01-01T00:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks3'],
      duration_ms: 1000,
      doc_counts: {},
    },
  });
  vi.spyOn(client, 'info').mockResolvedValue(EMPTY_INFO_RESPONSE);
  vi.spyOn(client.cat, 'indices').mockResolvedValue([]);
  vi.spyOn(client.indices, 'create').mockResolvedValue({
    acknowledged: true,
    shards_acknowledged: true,
    index: 'test',
  });
  vi.spyOn(client.indices, 'delete').mockResolvedValue({ acknowledged: true });
  vi.spyOn(client.synonyms, 'putSynonym').mockResolvedValue({
    result: 'created',
    reload_analyzers_details: {
      _shards: { total: 1, successful: 1, failed: 0 },
      reload_details: [],
    },
  });

  // Mock transport.request for bulk operations
  vi.spyOn(client.transport, 'request').mockResolvedValue({ errors: false, items: [] });

  return client;
}

function createTestDeps(): SearchSdkDeps {
  return {
    esClient: createTestEsClient(),
  };
}

function createTestConfig(): SearchSdkConfig {
  return {
    indexTarget: 'primary',
    indexVersion: 'v-test',
  };
}

function getLastSearchParams(client: Client): estypes.SearchRequest {
  const calls = vi.mocked(client.search).mock.calls;
  if (calls.length === 0) {
    throw new Error('Expected client.search to have been called');
  }
  const params = calls[calls.length - 1]?.[0];
  if (typeof params !== 'object' || params === null) {
    throw new Error('Expected search params to be an object');
  }
  return params;
}

function extractSourceExcludes(client: Client): readonly string[] {
  const params = getLastSearchParams(client);
  if (!('_source' in params)) {
    throw new Error('Expected _source to be set on search params');
  }
  const source = params._source;
  if (typeof source !== 'object' || source === null || Array.isArray(source)) {
    throw new Error('Expected _source to be an excludes object');
  }
  if (!('excludes' in source)) {
    throw new Error('Expected _source to have an excludes property');
  }
  const excludes: unknown = source.excludes;
  if (!Array.isArray(excludes)) {
    throw new Error('Expected _source.excludes to be an array');
  }
  return excludes.map((field) => {
    if (typeof field !== 'string') {
      throw new Error(`Expected _source.excludes entries to be strings, got ${typeof field}`);
    }
    return field;
  });
}

// ---------------------------------------------------------------------------
// Factory tests
// ---------------------------------------------------------------------------

describe('createSearchSdk', () => {
  it('returns an SDK instance with retrieval, admin, and observability services', () => {
    const sdk: SearchSdk = createSearchSdk({
      deps: createTestDeps(),
      config: createTestConfig(),
    });

    expect(sdk).toBeDefined();
    expect(sdk.retrieval).toBeDefined();
    expect(sdk.admin).toBeDefined();
    expect(sdk.observability).toBeDefined();
  });

  it('accepts sandbox index target', () => {
    const sdk = createSearchSdk({
      deps: createTestDeps(),
      config: { indexTarget: 'sandbox' },
    });

    expect(sdk).toBeDefined();
  });

  it('accepts zero-hit configuration', () => {
    const sdk = createSearchSdk({
      deps: createTestDeps(),
      config: {
        indexTarget: 'primary',
        zeroHit: {
          persistenceEnabled: true,
          retentionDays: 14,
          webhookUrl: 'https://example.com/webhook',
        },
      },
    });

    expect(sdk).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Retrieval service tests
// ---------------------------------------------------------------------------

describe('RetrievalService', () => {
  function createSdk(): SearchSdk {
    return createSearchSdk({
      deps: createTestDeps(),
      config: createTestConfig(),
    });
  }

  describe('searchLessons', () => {
    it('returns ok with a LessonsSearchResult containing scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchLessons({
        query: 'expanding brackets',
        subject: 'maths',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('lessons');
        expect(result.value.results).toBeInstanceOf(Array);
        expect(result.value.total).toBe(result.value.results.length);
        expect(typeof result.value.took).toBe('number');
        expect(typeof result.value.timedOut).toBe('boolean');
      }
    });

    it('respects size and from parameters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchLessons({
        query: 'fractions',
        size: 5,
        from: 10,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.results.length).toBeLessThanOrEqual(5);
      }
    });

    it('supports KS4-specific filters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchLessons({
        query: 'organic chemistry',
        subject: 'science',
        keyStage: 'ks4',
        tier: 'higher',
        examBoard: 'aqa',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('lessons');
      }
    });

    it('excludes scoring-only fields from _source to reduce payload size', async () => {
      const deps = createTestDeps();
      const sdk = createSearchSdk({ deps, config: createTestConfig() });
      await sdk.retrieval.searchLessons({ query: 'photosynthesis' });

      const excludes = extractSourceExcludes(deps.esClient);
      expect(excludes).toContain('lesson_content');
      expect(excludes).toContain('lesson_content_semantic');
      expect(excludes).toContain('lesson_structure');
      expect(excludes).toContain('lesson_structure_semantic');
    });
  });

  describe('searchUnits', () => {
    it('returns ok with a UnitsSearchResult containing scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchUnits({
        query: 'fractions',
        subject: 'maths',
        keyStage: 'ks2',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('units');
        expect(result.value.results).toBeInstanceOf(Array);
        expect(result.value.total).toBe(result.value.results.length);
      }
    });
  });

  describe('searchSequences', () => {
    it('returns ok with a SequencesSearchResult containing scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchSequences({
        query: 'secondary maths',
        phaseSlug: 'secondary',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('sequences');
        expect(result.value.results).toBeInstanceOf(Array);
        expect(result.value.total).toBe(result.value.results.length);
      }
    });

    it('supports includeFacets option', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchSequences({
        query: 'science',
        includeFacets: true,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('sequences');
      }
    });
  });

  describe('searchThreads', () => {
    it('returns ok with a ThreadsSearchResult containing scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchThreads({
        query: 'algebra equations progression',
        subject: 'maths',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('threads');
        expect(result.value.results).toBeInstanceOf(Array);
        expect(result.value.total).toBe(result.value.results.length);
        expect(typeof result.value.took).toBe('number');
        expect(typeof result.value.timedOut).toBe('boolean');
      }
    });

    it('works without a subject filter', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchThreads({
        query: 'geometry shapes',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('threads');
      }
    });
  });

  describe('suggest', () => {
    it('returns ok with a SuggestionResponse containing suggestions and cache metadata', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.suggest({
        prefix: 'expand',
        scope: 'lessons',
        subject: 'science',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.suggestions).toBeInstanceOf(Array);
        expect(result.value.cache).toBeDefined();
        expect(typeof result.value.cache.version).toBe('string');
        expect(typeof result.value.cache.ttlSeconds).toBe('number');
      }
    });
  });

  describe('fetchSequenceFacets', () => {
    it('returns ok with SearchFacets', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.fetchSequenceFacets();

      expect(result.ok).toBe(true);
    });

    it('accepts optional subject and keyStage filters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.fetchSequenceFacets({
        subject: 'maths',
        keyStage: 'ks3',
      });

      expect(result.ok).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Admin service tests
// ---------------------------------------------------------------------------

describe('AdminService', () => {
  function createSdk(): SearchSdk {
    return createSearchSdk({
      deps: createTestDeps(),
      config: createTestConfig(),
    });
  }

  describe('setup', () => {
    it('returns ok with a SetupResult containing synonym and index info', async () => {
      const { admin } = createSdk();

      const result = await admin.setup();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value.synonymsCreated).toBe('boolean');
        expect(typeof result.value.synonymCount).toBe('number');
        expect(result.value.indexResults).toBeInstanceOf(Array);
      }
    });
  });

  describe('reset', () => {
    it('returns ok with a SetupResult', async () => {
      const { admin } = createSdk();

      const result = await admin.reset({ verbose: true });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.indexResults).toBeInstanceOf(Array);
      }
    });
  });

  describe('verifyConnection', () => {
    it('returns ok with cluster name and version when connected', async () => {
      const { admin } = createSdk();

      const result = await admin.verifyConnection();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value.clusterName).toBe('string');
        expect(typeof result.value.version).toBe('string');
      }
    });
  });

  describe('listIndexes', () => {
    it('returns ok with an array of IndexInfo', async () => {
      const { admin } = createSdk();

      const result = await admin.listIndexes();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeInstanceOf(Array);
      }
    });
  });

  describe('updateSynonyms', () => {
    it('returns ok with a SynonymsResult containing count', async () => {
      const { admin } = createSdk();

      const result = await admin.updateSynonyms();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value.count).toBe('number');
      }
    });
  });

  describe('getIndexMeta', () => {
    it('returns ok with IndexMetaDoc or null', async () => {
      const { admin } = createSdk();

      const result = await admin.getIndexMeta();

      expect(result.ok).toBe(true);
    });
  });

  describe('setIndexMeta', () => {
    it('returns ok indicating success', async () => {
      const { admin } = createSdk();

      const result = await admin.setIndexMeta({
        version: 'v-test',
        ingested_at: new Date().toISOString(),
        subjects: ['maths'],
        key_stages: ['ks3'],
        duration_ms: 1000,
        doc_counts: {},
      });

      expect(result.ok).toBe(true);
    });
  });

  describe('verifyDocCounts', () => {
    it('returns a result when called through the admin service', async () => {
      const { admin } = createSdk();

      const result = await admin.verifyDocCounts({
        lessons: 1,
        unit_rollup: 1,
        units: 1,
        sequences: 1,
        sequence_facets: 1,
        threads: 1,
      });

      // The mock client returns empty cat.indices, so all counts are 0
      // and all expectations of 1 should fail
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
        expect(result.error.message).toContain('6 of 6');
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Observability service tests
// ---------------------------------------------------------------------------

describe('ObservabilityService', () => {
  function createSdk(): SearchSdk {
    return createSearchSdk({
      deps: createTestDeps(),
      config: {
        indexTarget: 'primary',
        indexVersion: 'v-test',
        zeroHit: { persistenceEnabled: false },
      },
    });
  }

  describe('recordZeroHit', () => {
    it('returns ok when recording a zero-hit event', async () => {
      const { observability } = createSdk();

      const result = await observability.recordZeroHit({
        scope: 'lessons',
        query: 'quantum computing ks2',
        filters: { subject: 'science', keyStage: 'ks2' },
        indexVersion: 'v-test',
      });

      expect(result.ok).toBe(true);
    });
  });

  describe('getRecentZeroHits', () => {
    it('returns an array of zero-hit events', () => {
      const { observability } = createSdk();

      const recent = observability.getRecentZeroHits(10);

      expect(recent).toBeInstanceOf(Array);
    });
  });

  describe('getZeroHitSummary', () => {
    it('returns a summary with total and per-scope breakdown', () => {
      const { observability } = createSdk();

      const summary = observability.getZeroHitSummary();

      expect(typeof summary.total).toBe('number');
      expect(summary.byScope).toBeDefined();
      expect(typeof summary.byScope.lessons).toBe('number');
      expect(typeof summary.byScope.units).toBe('number');
      expect(typeof summary.byScope.sequences).toBe('number');
    });
  });

  describe('persistZeroHitEvent', () => {
    it('returns ok when persistence is disabled', async () => {
      const { observability } = createSdk();

      const result = await observability.persistZeroHitEvent({
        timestamp: Date.now(),
        scope: 'lessons',
        query: 'test query',
        filters: { subject: 'maths' },
        indexVersion: 'v-test',
      });

      expect(result.ok).toBe(true);
    });
  });

  describe('fetchTelemetry', () => {
    it('returns ok with telemetry containing summary and recent events', async () => {
      const { observability } = createSdk();

      const result = await observability.fetchTelemetry({
        limit: 50,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.summary).toBeDefined();
        expect(result.value.recent).toBeInstanceOf(Array);
      }
    });
  });
});
