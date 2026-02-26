import { Client } from '@elastic/elasticsearch';

/** Minimal config required to create an ES client. */
export interface EsClientConfig {
  readonly ELASTICSEARCH_URL: string;
  readonly ELASTICSEARCH_API_KEY: string;
}

/**
 * Singleton client for Node.js route handlers.
 * Must be initialized via {@link initializeEsClient} before first use.
 * Serverless Elastic works with normal node endpoint + ApiKey auth.
 */
let _client: Client | null = null;

/**
 * Initialize the ES client with validated config.
 * Call once at entry point before any code that uses {@link esClient}.
 */
export function initializeEsClient(config: EsClientConfig): void {
  if (_client) {
    return;
  }
  _client = new Client({
    node: config.ELASTICSEARCH_URL,
    auth: { apiKey: config.ELASTICSEARCH_API_KEY },
  });
}

/** Factory to create an ES client from config. Use when not using the singleton. */
export function createEsClient(config: EsClientConfig): Client {
  return new Client({
    node: config.ELASTICSEARCH_URL,
    auth: { apiKey: config.ELASTICSEARCH_API_KEY },
  });
}

export function esClient(): Client {
  if (!_client) {
    throw new Error(
      'ES client not initialized. Call initializeEsClient(config) at entry point before using esClient().',
    );
  }
  return _client;
}
