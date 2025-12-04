/**
 * E2E Test: Elasticsearch Connection
 *
 * This test verifies connectivity to the Elasticsearch Serverless instance.
 * It is designed to FAIL (RED phase) until:
 * 1. ES Serverless project is provisioned via Elastic Cloud
 * 2. API keys are generated with appropriate scopes
 * 3. Environment variables are configured in .env.local
 *
 * Run with: DOTENV_CONFIG_PATH=.env.local pnpm test:e2e -- es-connection
 *
 * Prerequisites:
 * - ELASTICSEARCH_URL: Serverless HTTPS endpoint
 * - ELASTICSEARCH_API_KEY: API key with manage + search privileges
 *
 * @see .agent/plans/semantic-search/semantic-search-overview.md Phase 0.2
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { Client } from '@elastic/elasticsearch';

describe('Elasticsearch Connection E2E', () => {
  let client: Client;
  let esUrl: string | undefined;
  let esApiKey: string | undefined;

  beforeAll(() => {
    // Read from environment (not mocked in E2E tests)
    esUrl = process.env.ELASTICSEARCH_URL;
    esApiKey = process.env.ELASTICSEARCH_API_KEY;
  });

  it('should have ELASTICSEARCH_URL configured', () => {
    expect(esUrl).toBeDefined();
    expect(esUrl).toMatch(/^https:\/\//);
  });

  it('should have ELASTICSEARCH_API_KEY configured', () => {
    expect(esApiKey).toBeDefined();
    expect(esApiKey?.length).toBeGreaterThan(10);
  });

  it('should connect to Elasticsearch cluster', async () => {
    if (!esUrl || !esApiKey) {
      throw new Error(
        'ES configuration missing. Set ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY in .env.local',
      );
    }

    client = new Client({
      node: esUrl,
      auth: { apiKey: esApiKey },
    });

    // Attempt to get cluster info
    const info = await client.info();

    expect(info.cluster_name).toBeDefined();
    expect(info.version).toBeDefined();
    expect(info.tagline).toBe('You Know, for Search');
  });

  it('should have proper API key permissions (can list indices)', async () => {
    if (!esUrl || !esApiKey) {
      throw new Error(
        'ES configuration missing. Set ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY in .env.local',
      );
    }

    client = new Client({
      node: esUrl,
      auth: { apiKey: esApiKey },
    });

    // Attempt to list indices (requires manage or read permissions)
    const indices = await client.cat.indices({ format: 'json' });

    // Should not throw - permissions are sufficient
    expect(Array.isArray(indices)).toBe(true);
  });

  describe('Index Availability (requires Phase 0.3 complete)', () => {
    /**
     * Expected index names that should exist after initial setup.
     */
    const expectedIndexes = [
      'oak_lessons',
      'oak_units',
      'oak_unit_rollup',
      'oak_sequences',
    ] as const;

    it.each(expectedIndexes)('should have %s index', async (indexName) => {
      if (!esUrl || !esApiKey) {
        throw new Error('ES configuration missing');
      }
      client = new Client({
        node: esUrl,
        auth: { apiKey: esApiKey },
      });
      const exists = await client.indices.exists({ index: indexName });
      expect(exists).toBe(true);
    });
  });

  describe('Search Capability (requires Phase 0.3 complete)', () => {
    it.skip('should return results for basic search', async () => {
      if (!client) return;

      const response = await client.search({
        index: 'oak_lessons',
        size: 1,
        query: {
          match_all: {},
        },
      });

      expect(response.hits.total).toBeDefined();
      // Should have at least one document after ingestion
      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : (response.hits.total?.value ?? 0);
      expect(total).toBeGreaterThan(0);
    });
  });
});
