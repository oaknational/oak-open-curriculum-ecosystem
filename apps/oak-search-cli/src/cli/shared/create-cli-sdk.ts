/** Shared CLI helpers for building Elasticsearch clients from validated env. */

import { Client } from '@elastic/elasticsearch';

/**
 * Minimal environment shape required to create a CLI SDK instance.
 *
 * This is a subset of the full `Env` type from `src/lib/env.ts`,
 * containing only the fields needed for SDK creation. The consuming
 * code reads the full env and passes it here.
 */
export interface CliSdkEnv {
  /** Elasticsearch cluster URL. */
  readonly ELASTICSEARCH_URL: string;

  /** Elasticsearch API key for authentication. */
  readonly ELASTICSEARCH_API_KEY: string;

  /** Which index alias set to target: `'primary'` or `'sandbox'`. */
  readonly SEARCH_INDEX_TARGET: 'primary' | 'sandbox';

  /** Optional index version string for cache invalidation. */
  readonly SEARCH_INDEX_VERSION?: string;

  /** Zero-hit webhook URL, or `'none'` to disable. */
  readonly ZERO_HIT_WEBHOOK_URL?: string;

  /** Whether to persist zero-hit events to Elasticsearch. */
  readonly ZERO_HIT_PERSISTENCE_ENABLED?: boolean;

  /** Retention period (in days) for persisted zero-hit events. */
  readonly ZERO_HIT_INDEX_RETENTION_DAYS?: number;
}

/**
 * Create an Elasticsearch client from validated CLI environment configuration.
 *
 * @param cliEnv - Validated environment values with Elasticsearch connection details
 * @returns A configured Elasticsearch `Client` instance
 */
export function createEsClient(cliEnv: CliSdkEnv): Client {
  return new Client({
    node: cliEnv.ELASTICSEARCH_URL,
    auth: { apiKey: cliEnv.ELASTICSEARCH_API_KEY },
  });
}
