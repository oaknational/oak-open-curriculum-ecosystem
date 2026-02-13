/**
 * Register the `search threads` CLI subcommand.
 *
 * Threads are conceptual progression strands that connect units across
 * years, showing how ideas build over time. They are programme-agnostic.
 *
 * Extracted from `index.ts` to keep that file within the max-lines limit.
 */

import type { Command } from 'commander';
import { createCliSdk, printJson, printError, validateSubject } from '../shared/index.js';
import { env } from '../../lib/env.js';
import { handleSearchThreads } from './handlers.js';

/**
 * Register the `search threads` subcommand.
 *
 * @param parent - The parent Commander command to register under
 */
export function registerThreadsCmd(parent: Command): void {
  parent
    .command('threads')
    .description('Search threads (conceptual progression strands)')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(async (query: string, opts: { subject?: string; size: string }) => {
      try {
        const sdk = createCliSdk(env());
        const result = await handleSearchThreads(sdk.retrieval, {
          text: query,
          subject: validateSubject(opts.subject),
          size: parseInt(opts.size, 10),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}
