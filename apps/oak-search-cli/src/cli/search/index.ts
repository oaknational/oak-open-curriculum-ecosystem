/**
 * Search subcommand group — retrieval operations.
 *
 * Provides commands for querying lessons, units, sequences, threads,
 * type-ahead suggestions, and sequence facets via the Search SDK.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 *
 * @example
 * ```bash
 * oaksearch search lessons "expanding brackets" --subject maths --key-stage ks3
 * oaksearch search units "fractions" --size 5
 * ```
 */

import { Command } from 'commander';
import { createRetrievalService } from '@oaknational/oak-search-sdk/read';
import type { CliObservability } from '../../observability/index.js';
import {
  createEsClient,
  withEsClient,
  withLoadedCliEnv,
  type CliSdkEnv,
  type SearchCliEnvLoader,
  printJson,
  printError,
  validateSubject,
  validateKeyStage,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleSearchLessons, handleSearchUnits, handleSearchSequences } from './handlers.js';
import { registerThreadsCmd } from './register-threads-cmd.js';
import { registerSuggestCmd } from './register-suggest-cmd.js';
import { registerFacetsCmd } from './register-facets-cmd.js';
import { searchDeps } from './search-deps.js';
import { searchLogger } from '../../lib/logger.js';

/**
 * Common CLI option shape for commands with subject, key stage, and size.
 */
interface SubjectKeyStageOpts {
  readonly subject?: string;
  readonly keyStage?: string;
  readonly size: string;
}

/**
 * Register the `search lessons` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
function registerLessonsCmd(
  parent: Command,
  cliEnvLoader: SearchCliEnvLoader,
  observability?: CliObservability,
): void {
  parent
    .command('lessons')
    .description('Search lessons using hybrid BM25 + ELSER retrieval')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage (ks1-ks4)')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(
      withLoadedCliEnv(
        cliEnvLoader,
        async (cliEnv: CliSdkEnv, query: string, opts: SubjectKeyStageOpts) => {
          const esClient = createEsClient(cliEnv);
          await withEsClient(
            esClient,
            async () => {
              const retrieval = createRetrievalService(esClient, buildSearchSdkConfig(cliEnv));
              const result = await handleSearchLessons(retrieval, {
                query,
                subject: validateSubject(opts.subject),
                keyStage: validateKeyStage(opts.keyStage),
                size: parseInt(opts.size, 10),
              });
              if (!result.ok) {
                searchLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
                printError(`${result.error.type}: ${result.error.message}`);
                searchDeps.setExitCode(1);
                return;
              }
              printJson(result.value);
            },
            searchDeps,
          );
        },
        observability,
      ),
    );
}

/**
 * Register the `search units` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
function registerUnitsCmd(
  parent: Command,
  cliEnvLoader: SearchCliEnvLoader,
  observability?: CliObservability,
): void {
  parent
    .command('units')
    .description('Search units using hybrid BM25 + ELSER retrieval')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('-k, --key-stage <keyStage>', 'Filter by key stage (ks1-ks4)')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(
      withLoadedCliEnv(
        cliEnvLoader,
        async (cliEnv: CliSdkEnv, query: string, opts: SubjectKeyStageOpts) => {
          const esClient = createEsClient(cliEnv);
          await withEsClient(
            esClient,
            async () => {
              const retrieval = createRetrievalService(esClient, buildSearchSdkConfig(cliEnv));
              const result = await handleSearchUnits(retrieval, {
                query,
                subject: validateSubject(opts.subject),
                keyStage: validateKeyStage(opts.keyStage),
                size: parseInt(opts.size, 10),
              });
              if (!result.ok) {
                searchLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
                printError(`${result.error.type}: ${result.error.message}`);
                searchDeps.setExitCode(1);
                return;
              }
              printJson(result.value);
            },
            searchDeps,
          );
        },
        observability,
      ),
    );
}

/**
 * Register the `search sequences` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
function registerSequencesCmd(
  parent: Command,
  cliEnvLoader: SearchCliEnvLoader,
  observability?: CliObservability,
): void {
  parent
    .command('sequences')
    .description('Search sequences (subject-phase programmes)')
    .argument('<query>', 'Search query text')
    .option('-s, --subject <subject>', 'Filter by subject slug')
    .option('--size <n>', 'Maximum results to return', '25')
    .action(
      withLoadedCliEnv(
        cliEnvLoader,
        async (cliEnv: CliSdkEnv, query: string, opts: { subject?: string; size: string }) => {
          const esClient = createEsClient(cliEnv);
          await withEsClient(
            esClient,
            async () => {
              const retrieval = createRetrievalService(esClient, buildSearchSdkConfig(cliEnv));
              const result = await handleSearchSequences(retrieval, {
                query,
                subject: validateSubject(opts.subject),
                size: parseInt(opts.size, 10),
              });
              if (!result.ok) {
                searchLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
                printError(`${result.error.type}: ${result.error.message}`);
                searchDeps.setExitCode(1);
                return;
              }
              printJson(result.value);
            },
            searchDeps,
          );
        },
        observability,
      ),
    );
}

/**
 * Create the `search` subcommand group.
 *
 * @param cliEnv - Validated CLI environment values
 * @returns A Commander `Command` with search subcommands registered
 */
export function searchCommand(
  cliEnvLoader: SearchCliEnvLoader,
  observability?: CliObservability,
): Command {
  const cmd = new Command('search').description(
    'Query lessons, units, sequences, threads, and suggestions',
  );

  registerLessonsCmd(cmd, cliEnvLoader, observability);
  registerUnitsCmd(cmd, cliEnvLoader, observability);
  registerSequencesCmd(cmd, cliEnvLoader, observability);
  registerThreadsCmd(cmd, cliEnvLoader);
  registerSuggestCmd(cmd, cliEnvLoader);
  registerFacetsCmd(cmd, cliEnvLoader);

  return cmd;
}
