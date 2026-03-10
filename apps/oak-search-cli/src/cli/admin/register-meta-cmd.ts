/**
 * Register the `admin meta` subcommand group.
 *
 * Provides `meta get` and `meta set` for reading and writing
 * the index metadata document stored in Elasticsearch.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { createSearchSdk } from '@oaknational/oak-search-sdk';
import { isIndexMetaDoc } from '@oaknational/sdk-codegen/search';
import {
  createEsClient,
  withEsClient,
  printJson,
  printError,
  printSuccess,
  type CliSdkEnv,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleGetMeta, handleSetMeta } from './handlers.js';
import { adminLogger } from '../../lib/logger.js';

/** Shared `withEsClient` deps for meta commands. */
const metaDeps = {
  logger: adminLogger,
  printError,
  setExitCode: (c: number) => {
    process.exitCode = c;
  },
};

/**
 * Register the `meta get` subcommand.
 *
 * @param parent - The meta Commander command group
 * @param cliEnv - Validated CLI environment values
 */
function registerMetaGetCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('get')
    .description('Read current index metadata from Elasticsearch')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const sdk = createSearchSdk({
            deps: { esClient },
            config: buildSearchSdkConfig(cliEnv),
          });
          const result = await handleGetMeta(sdk.admin);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printJson(result.value);
        },
        metaDeps,
      );
    });
}

/**
 * Register the `meta set` subcommand.
 *
 * Validates JSON input against the `IndexMetaDoc` schema before writing.
 *
 * @param parent - The meta Commander command group
 * @param cliEnv - Validated CLI environment values
 */
function registerMetaSetCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('set')
    .description('Write index metadata to Elasticsearch')
    .argument('<json>', 'JSON string of metadata to write')
    .action(async (json: string) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const sdk = createSearchSdk({
            deps: { esClient },
            config: buildSearchSdkConfig(cliEnv),
          });
          const parsed: unknown = JSON.parse(json);
          if (!isIndexMetaDoc(parsed)) {
            throw new Error('Invalid metadata JSON: does not match IndexMetaDoc schema.');
          }
          const result = await handleSetMeta(sdk.admin, parsed);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess('Index metadata written successfully.');
        },
        metaDeps,
      );
    });
}

/**
 * Register the `admin meta` subcommand group.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerMetaCmd(parent: Command, cliEnv: CliSdkEnv): void {
  const metaCmd = parent.command('meta').description('Read or write index metadata');
  registerMetaGetCmd(metaCmd, cliEnv);
  registerMetaSetCmd(metaCmd, cliEnv);
}
