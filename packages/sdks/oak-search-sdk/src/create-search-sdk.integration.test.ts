/**
 * Integration tests for the Search SDK factory and service interfaces.
 *
 * These tests form the TDD RED phase for Checkpoint A — they specify
 * the contract that will be implemented during Checkpoints B–D.
 *
 * Each test constructs the SDK with simple mock dependencies and
 * exercises the service methods, asserting correct result shapes
 * and dependency interaction.
 *
 * **Expected state**: ALL tests FAIL (RED) because `createSearchSdk`
 * is not yet implemented. They will turn GREEN as services are built.
 */

import { describe, it, expect, vi } from 'vitest';
import { createSearchSdk } from './create-search-sdk.js';
import type {
  SearchSdk,
  SearchSdkDeps,
  SearchSdkConfig,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
  SetupResult,
  ConnectionStatus,
  IngestResult,
  SynonymsResult,
} from './types/index.js';
import { Client } from '@elastic/elasticsearch';
import type {
  SearchFacets,
  ZeroHitTelemetry,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

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
    it('returns a LessonsSearchResult with scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result: LessonsSearchResult = await retrieval.searchLessons({
        text: 'expanding brackets',
        subject: 'maths',
        keyStage: 'ks3',
      });

      expect(result.scope).toBe('lessons');
      expect(result.results).toBeInstanceOf(Array);
      expect(typeof result.total).toBe('number');
      expect(typeof result.took).toBe('number');
      expect(typeof result.timedOut).toBe('boolean');
    });

    it('respects size and from parameters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchLessons({
        text: 'fractions',
        size: 5,
        from: 10,
      });

      expect(result.results.length).toBeLessThanOrEqual(5);
    });

    it('supports KS4-specific filters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchLessons({
        text: 'organic chemistry',
        subject: 'science',
        keyStage: 'ks4',
        tier: 'higher',
        examBoard: 'aqa',
      });

      expect(result.scope).toBe('lessons');
    });
  });

  describe('searchUnits', () => {
    it('returns a UnitsSearchResult with scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result: UnitsSearchResult = await retrieval.searchUnits({
        text: 'fractions',
        subject: 'maths',
        keyStage: 'ks2',
      });

      expect(result.scope).toBe('units');
      expect(result.results).toBeInstanceOf(Array);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('searchSequences', () => {
    it('returns a SequencesSearchResult with scope, results, and metadata', async () => {
      const { retrieval } = createSdk();

      const result: SequencesSearchResult = await retrieval.searchSequences({
        text: 'secondary maths',
        phaseSlug: 'secondary',
      });

      expect(result.scope).toBe('sequences');
      expect(result.results).toBeInstanceOf(Array);
      expect(typeof result.total).toBe('number');
    });

    it('supports includeFacets option', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.searchSequences({
        text: 'science',
        includeFacets: true,
      });

      expect(result.scope).toBe('sequences');
    });
  });

  describe('suggest', () => {
    it('returns a SuggestionResponse with suggestions and cache metadata', async () => {
      const { retrieval } = createSdk();

      const result: SuggestionResponse = await retrieval.suggest({
        prefix: 'expand',
        scope: 'lessons',
      });

      expect(result.suggestions).toBeInstanceOf(Array);
      expect(result.cache).toBeDefined();
      expect(typeof result.cache.version).toBe('string');
      expect(typeof result.cache.ttlSeconds).toBe('number');
    });
  });

  describe('fetchSequenceFacets', () => {
    it('returns SearchFacets', async () => {
      const { retrieval } = createSdk();

      const result: SearchFacets = await retrieval.fetchSequenceFacets();

      expect(result).toBeDefined();
    });

    it('accepts optional subject and keyStage filters', async () => {
      const { retrieval } = createSdk();

      const result = await retrieval.fetchSequenceFacets({
        subject: 'maths',
        keyStage: 'ks3',
      });

      expect(result).toBeDefined();
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
    it('returns a SetupResult with synonym and index info', async () => {
      const { admin } = createSdk();

      const result: SetupResult = await admin.setup();

      expect(typeof result.synonymsCreated).toBe('boolean');
      expect(typeof result.synonymCount).toBe('number');
      expect(result.indexResults).toBeInstanceOf(Array);
    });
  });

  describe('reset', () => {
    it('returns a SetupResult', async () => {
      const { admin } = createSdk();

      const result: SetupResult = await admin.reset({ verbose: true });

      expect(result.indexResults).toBeInstanceOf(Array);
    });
  });

  describe('verifyConnection', () => {
    it('returns a ConnectionStatus', async () => {
      const { admin } = createSdk();

      const result: ConnectionStatus = await admin.verifyConnection();

      expect(typeof result.connected).toBe('boolean');
    });
  });

  describe('listIndexes', () => {
    it('returns an array of IndexInfo', async () => {
      const { admin } = createSdk();

      const result = await admin.listIndexes();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('updateSynonyms', () => {
    it('returns a SynonymsResult', async () => {
      const { admin } = createSdk();

      const result: SynonymsResult = await admin.updateSynonyms();

      expect(typeof result.success).toBe('boolean');
      expect(typeof result.count).toBe('number');
    });
  });

  describe('ingest', () => {
    it('returns an IngestResult with document counts', async () => {
      const { admin } = createSdk();

      const result: IngestResult = await admin.ingest({
        bulkDir: '/tmp/test-bulk-data',
      });

      expect(typeof result.lessonsIndexed).toBe('number');
      expect(typeof result.unitsIndexed).toBe('number');
      expect(typeof result.sequencesIndexed).toBe('number');
    });
  });

  describe('getIndexMeta', () => {
    it('returns a Result with IndexMetaDoc or null', async () => {
      const { admin } = createSdk();

      const result = await admin.getIndexMeta();

      // Result type: either ok with value or err with error
      expect(typeof result.ok).toBe('boolean');
    });
  });

  describe('setIndexMeta', () => {
    it('returns a Result indicating success or failure', async () => {
      const { admin } = createSdk();

      const result = await admin.setIndexMeta({
        version: 'v-test',
        ingested_at: new Date().toISOString(),
        subjects: ['maths'],
        key_stages: ['ks3'],
        duration_ms: 1000,
        doc_counts: {},
      });

      expect(typeof result.ok).toBe('boolean');
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
    it('records a zero-hit event without throwing', async () => {
      const { observability } = createSdk();

      await expect(
        observability.recordZeroHit({
          scope: 'lessons',
          text: 'quantum computing ks2',
          filters: { subject: 'science', keyStage: 'ks2' },
          indexVersion: 'v-test',
        }),
      ).resolves.toBeUndefined();
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
    it('persists without throwing when persistence is disabled', async () => {
      const { observability } = createSdk();

      await expect(
        observability.persistZeroHitEvent({
          timestamp: Date.now(),
          scope: 'lessons',
          text: 'test query',
          filters: { subject: 'maths' },
          indexVersion: 'v-test',
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('fetchTelemetry', () => {
    it('returns telemetry with summary and recent events', async () => {
      const { observability } = createSdk();

      const telemetry: ZeroHitTelemetry = await observability.fetchTelemetry({
        limit: 50,
      });

      expect(telemetry.summary).toBeDefined();
      expect(telemetry.recent).toBeInstanceOf(Array);
    });
  });
});
