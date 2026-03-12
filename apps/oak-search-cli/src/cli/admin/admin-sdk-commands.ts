/**
 * SDK-mapped admin commands — setup, status, and synonyms.
 *
 * Each command creates an ES client, wraps the handler with
 * `withEsClient` for guaranteed cleanup, and calls the appropriate
 * SDK admin handler.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * Meta commands are in `register-meta-cmd.ts` (extracted for max-lines).
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { createAdminService } from '@oaknational/oak-search-sdk/admin';
import {
  createEsClient,
  withEsClient,
  printJson,
  printError,
  printSuccess,
  printHeader,
  type CliSdkEnv,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleSetup, handleReset, handleStatus, handleSynonyms } from './handlers.js';
import { adminLogger } from '../../lib/logger.js';

export { registerMetaCmd } from './register-meta-cmd.js';

/** Shared `withEsClient` deps for admin SDK commands. */
const adminDeps = {
  logger: adminLogger,
  printError,
  setExitCode: (c: number) => {
    process.exitCode = c;
  },
};

/**
 * Register the `admin setup` subcommand.
 *
 * When `--reset` is passed, all indexes are deleted before re-creation.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerSetupCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('setup')
    .description('Create synonyms and all search indexes (idempotent)')
    .option('--reset', 'Delete and recreate all indexes (destructive)')
    .action(async (opts: { reset?: boolean }) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const admin = createAdminService(esClient, buildSearchSdkConfig(cliEnv));
          const result = await (opts.reset ? handleReset(admin) : handleSetup(admin));
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          const verb = opts.reset ? 'Reset' : 'Setup';
          printSuccess(
            `${verb} complete. ${result.value.synonymCount} synonyms, ${result.value.indexResults.length} indexes.`,
          );
          printJson(result.value);
        },
        adminDeps,
      );
    });
}

/**
 * Register the `admin status` subcommand.
 *
 * Displays Elasticsearch connection info and current index listing.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerStatusCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('status')
    .description('Show Elasticsearch connection status and index listing')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const admin = createAdminService(esClient, buildSearchSdkConfig(cliEnv));
          const result = await handleStatus(admin);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printHeader('Connection');
          printJson(result.value.connection);
          printHeader('Indexes');
          printJson(result.value.indexes);
        },
        adminDeps,
      );
    });
}

/**
 * Register the `admin synonyms` subcommand.
 *
 * Upserts the curriculum synonym set into Elasticsearch.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerSynonymsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('synonyms')
    .description('Update the synonym set in Elasticsearch')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const admin = createAdminService(esClient, buildSearchSdkConfig(cliEnv));
          const result = await handleSynonyms(admin);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess(`Synonyms updated: ${result.value.count} synonyms.`);
          printJson(result.value);
        },
        adminDeps,
      );
    });
}
