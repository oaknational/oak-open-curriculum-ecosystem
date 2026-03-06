/**
 * CLI SDK factory — the single place where environment configuration
 * becomes an SDK instance.
 *
 * This module reads validated environment values and creates an
 * Elasticsearch client and Search SDK. All downstream CLI handlers
 * receive the SDK as an injected dependency.
 *
 * @example
 * ```typescript
 * import { createCliSdk } from './create-cli-sdk.js';
 *
 * const sdk = createCliSdk(config.env);
 * const results = await sdk.retrieval.searchLessons({ query: 'fractions' });
 * ```
 */

import { Client } from '@elastic/elasticsearch';
import { createSearchSdk } from '@oaknational/oak-search-sdk';
import type { SearchSdk } from '@oaknational/oak-search-sdk';

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
 * Create a Search SDK instance from validated environment configuration.
 *
 * This is the single place where environment values are translated into
 * SDK dependencies and configuration. All CLI handlers receive the
 * returned SDK as a parameter — they never read env directly.
 *
 * @param cliEnv - Validated environment values (from `loadRuntimeConfig()` or test fixture)
 * @returns A fully wired `SearchSdk` instance
 */
export function createCliSdk(cliEnv: CliSdkEnv): SearchSdk {
  const esClient = new Client({
    node: cliEnv.ELASTICSEARCH_URL,
    auth: { apiKey: cliEnv.ELASTICSEARCH_API_KEY },
  });

  const webhookUrl =
    cliEnv.ZERO_HIT_WEBHOOK_URL && cliEnv.ZERO_HIT_WEBHOOK_URL !== 'none'
      ? cliEnv.ZERO_HIT_WEBHOOK_URL
      : undefined;

  return createSearchSdk({
    deps: { esClient },
    config: {
      indexTarget: cliEnv.SEARCH_INDEX_TARGET,
      indexVersion: cliEnv.SEARCH_INDEX_VERSION,
      zeroHit: {
        webhookUrl,
        persistenceEnabled: cliEnv.ZERO_HIT_PERSISTENCE_ENABLED,
        retentionDays: cliEnv.ZERO_HIT_INDEX_RETENTION_DAYS,
      },
    },
  });
}
