/**
 * Factory for creating the SearchRetrievalService when ES credentials are present.
 *
 * Extracted from handlers.ts to keep that file within the max-lines limit.
 */

import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { Client } from '@elastic/elasticsearch';
import { createSearchSdk } from '@oaknational/oak-search-sdk';

/**
 * Creates a SearchRetrievalService when Elasticsearch credentials are present.
 *
 * @param env - Environment variables containing optional ES credentials
 * @param logger - Logger for startup messages
 * @returns SearchRetrievalService if credentials present, undefined otherwise
 */
export function createSearchRetrieval(
  env: { ELASTICSEARCH_URL?: string; ELASTICSEARCH_API_KEY?: string },
  logger: { info: (msg: string) => void },
): SearchRetrievalService | undefined {
  if (!env.ELASTICSEARCH_URL || !env.ELASTICSEARCH_API_KEY) {
    logger.info(
      'Search retrieval service not configured — ELASTICSEARCH_URL or ELASTICSEARCH_API_KEY missing. Search tools will return "not configured" errors.',
    );
    return undefined;
  }

  const esClient = new Client({
    node: env.ELASTICSEARCH_URL,
    auth: { apiKey: env.ELASTICSEARCH_API_KEY },
  });
  const searchSdk = createSearchSdk({ deps: { esClient }, config: { indexTarget: 'primary' } });
  logger.info('Search retrieval service configured (Elasticsearch connected)');
  return searchSdk.retrieval;
}
