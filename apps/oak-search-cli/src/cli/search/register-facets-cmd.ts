/**
 * Register the `search facets` CLI subcommand.
 *
 * Fetches sequence facets for navigation filtering.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * Extracted from `index.ts` to keep that file within the max-lines limit.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { createRetrievalService } from '@oaknational/oak-search-sdk/read';
import {
  createEsClient,
  withEsClient,
  withLoadedCliEnv,
  type CliSdkEnv,
  type SearchCliEnvLoader,
  printJson,
  validateSubject,
  validateKeyStage,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleFetchFacets } from './handlers.js';
import { searchDeps } from './search-deps.js';

/**
 * Register the `search facets` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerFacetsCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('facets')
    .description('Fetch sequence facets for navigation')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage')
    .action(
      withLoadedCliEnv(
        cliEnvLoader,
        async (cliEnv: CliSdkEnv, opts: { subject?: string; keyStage?: string }) => {
          const esClient = createEsClient(cliEnv);
          await withEsClient(
            esClient,
            async () => {
              const retrieval = createRetrievalService(esClient, buildSearchSdkConfig(cliEnv));
              const result = await handleFetchFacets(retrieval, {
                subject: validateSubject(opts.subject),
                keyStage: validateKeyStage(opts.keyStage),
              });
              if (!result.ok) {
                searchDeps.logger.error(
                  `${result.error.type}: ${result.error.message}`,
                  result.error,
                );
                searchDeps.printError(`${result.error.type}: ${result.error.message}`);
                searchDeps.setExitCode(1);
                return;
              }
              printJson(result.value);
            },
            searchDeps,
          );
        },
      ),
    );
}
