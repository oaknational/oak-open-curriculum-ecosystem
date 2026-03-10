/**
 * Pure factory for Search SDK configuration.
 *
 * Normalises CLI environment values into the `SearchSdkConfig` shape
 * expected by `createSearchSdk`. Extracted from `createCliSdk` so
 * that callers who own the ES client externally (via `withEsClient`)
 * can still build a correctly configured SDK without duplicating the
 * webhook-URL normalisation logic.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { SearchSdkConfig } from '@oaknational/oak-search-sdk';
import type { CliSdkEnv } from './create-cli-sdk.js';

/**
 * Build a `SearchSdkConfig` from CLI environment values.
 *
 * Normalises `ZERO_HIT_WEBHOOK_URL` — the env var can be `'none'`
 * (meaning disabled), which must be mapped to `undefined` for the SDK.
 *
 * @param cliEnv - Validated CLI environment values
 * @returns A `SearchSdkConfig` suitable for `createSearchSdk`
 */
export function buildSearchSdkConfig(cliEnv: CliSdkEnv): SearchSdkConfig {
  const webhookUrl =
    cliEnv.ZERO_HIT_WEBHOOK_URL && cliEnv.ZERO_HIT_WEBHOOK_URL !== 'none'
      ? cliEnv.ZERO_HIT_WEBHOOK_URL
      : undefined;

  return {
    indexTarget: cliEnv.SEARCH_INDEX_TARGET,
    indexVersion: cliEnv.SEARCH_INDEX_VERSION,
    zeroHit: {
      webhookUrl,
      persistenceEnabled: cliEnv.ZERO_HIT_PERSISTENCE_ENABLED,
      retentionDays: cliEnv.ZERO_HIT_INDEX_RETENTION_DAYS,
    },
  };
}
