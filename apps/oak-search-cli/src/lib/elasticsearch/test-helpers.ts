/**
 * Test helpers for Elasticsearch-related unit tests.
 * Uses a real Client instance so tests can vi.spyOn(client, 'get'|'index') without type assertions.
 */

import { Client } from '@elastic/elasticsearch';

/**
 * Creates a real ES Client for index metadata tests.
 * Tests should use vi.spyOn(client, 'get') and vi.spyOn(client, 'index') to mock responses.
 */
export function createFakeEsClient(): Client {
  return new Client({ node: 'http://localhost:9200' });
}
