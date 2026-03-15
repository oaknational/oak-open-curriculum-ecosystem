import { createRetrievalService, type RetrievalService } from '@oaknational/oak-search-sdk/read';
import type { CliSdkEnv } from '../../src/cli/shared/create-cli-sdk.js';
import { createEsClient } from '../../src/cli/shared/create-cli-sdk.js';
import { buildSearchSdkConfig } from '../../src/cli/shared/build-search-sdk-config.js';

/**
 * Create a retrieval service for evaluation scripts with explicit ES client cleanup.
 *
 * @param env - Validated CLI environment
 * @param run - Callback executed with the created retrieval service
 * @returns Callback result
 */
export async function withEvaluationSearchSdk<TResult>(
  env: CliSdkEnv,
  run: (retrieval: RetrievalService) => Promise<TResult>,
): Promise<TResult> {
  const esClient = createEsClient(env);
  const retrieval = createRetrievalService(esClient, buildSearchSdkConfig(env));
  try {
    return await run(retrieval);
  } finally {
    await esClient.close();
  }
}
