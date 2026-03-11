import { createSearchSdk, type SearchSdk } from '@oaknational/oak-search-sdk';
import type { CliSdkEnv } from '../../src/cli/shared/create-cli-sdk.js';
import { createEsClient } from '../../src/cli/shared/create-cli-sdk.js';
import { buildSearchSdkConfig } from '../../src/cli/shared/build-search-sdk-config.js';

/**
 * Create a Search SDK for evaluation scripts with explicit ES client cleanup.
 *
 * @param env - Validated CLI environment
 * @param run - Callback executed with the created SDK
 * @returns Callback result
 */
export async function withEvaluationSearchSdk<TResult>(
  env: CliSdkEnv,
  run: (sdk: SearchSdk) => Promise<TResult>,
): Promise<TResult> {
  const esClient = createEsClient(env);
  const sdk = createSearchSdk({
    deps: { esClient },
    config: buildSearchSdkConfig(env),
  });
  try {
    return await run(sdk);
  } finally {
    await esClient.close();
  }
}
