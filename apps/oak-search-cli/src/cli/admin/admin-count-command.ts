/**
 * CLI command for true parent document counts.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @remarks
 * Reports counts from the ES `_count` API, which excludes internal
 * nested documents created by `semantic_text` field chunking. This
 * gives the actual number of indexed documents, unlike `_cat/indices`
 * which inflates the count for ELSER-enabled indexes.
 *
 * @see handle-count.ts for the handler implementation
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import {
  createEsClient,
  withEsClient,
  printError,
  printHeader,
  printJson,
  type CliSdkEnv,
} from '../shared/index.js';
import { handleCount } from './handle-count.js';
import { adminLogger } from '../../lib/logger.js';

/**
 * Register the `admin count` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerCountCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('count')
    .description('Show true parent document counts (excludes ELSER chunk inflation)')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const result = await handleCount(esClient, cliEnv.SEARCH_INDEX_TARGET);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printHeader('Document Counts (true parent documents)');
          const total = result.value.reduce((sum, entry) => sum + entry.count, 0);
          printJson([...result.value, { kind: 'TOTAL', index: '—', count: total }]);
        },
        {
          logger: adminLogger,
          printError,
          setExitCode: (c) => {
            process.exitCode = c;
          },
        },
      );
    });
}
