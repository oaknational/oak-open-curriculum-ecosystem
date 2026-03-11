/**
 * Register the `search threads` CLI subcommand.
 *
 * Threads are conceptual progression strands that connect units across
 * years, showing how ideas build over time. They are programme-agnostic.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * Extracted from `index.ts` to keep that file within the max-lines limit.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { createSearchSdk } from '@oaknational/oak-search-sdk';
import {
  createEsClient,
  withEsClient,
  type CliSdkEnv,
  printJson,
  validateSubject,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleSearchThreads } from './handlers.js';
import { searchDeps } from './search-deps.js';

/**
 * Register the `search threads` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated environment configuration
 */
export function registerThreadsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('threads')
    .description('Search threads (conceptual progression strands)')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(async (query: string, opts: { subject?: string; size: string }) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const sdk = createSearchSdk({
            deps: { esClient },
            config: buildSearchSdkConfig(cliEnv),
          });
          const result = await handleSearchThreads(sdk.retrieval, {
            query,
            subject: validateSubject(opts.subject),
            size: parseInt(opts.size, 10),
          });
          if (!result.ok) {
            searchDeps.logger.error(`${result.error.type}: ${result.error.message}`, result.error);
            searchDeps.printError(`${result.error.type}: ${result.error.message}`);
            searchDeps.setExitCode(1);
            return;
          }
          printJson(result.value);
        },
        searchDeps,
      );
    });
}
