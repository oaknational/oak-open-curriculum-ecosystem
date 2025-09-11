import { Client } from '@elastic/elasticsearch';
import { env } from './env';

/**
 * Singleton client for Node.js route handlers.
 * Serverless Elastic works with normal node endpoint + ApiKey auth.
 */
let _client: Client | null = null;

export function esClient(): Client {
  if (_client) return _client;
  const e = env();
  _client = new Client({
    node: e.ELASTICSEARCH_URL,
    auth: { apiKey: e.ELASTICSEARCH_API_KEY },
  });
  return _client;
}
