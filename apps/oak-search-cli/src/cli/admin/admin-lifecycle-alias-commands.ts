/**
 * CLI commands for alias and metadata lifecycle operations (ADR-130).
 *
 * Provides promote, rollback, and validate-aliases commands that
 * delegate to the SDK lifecycle service. These commands only manage
 * aliases and metadata -- they do not perform ingestion.
 */

import type { Command } from 'commander';
import { err } from '@oaknational/result';
import {
  buildLifecycleDeps,
  createIndexLifecycleService,
  type IndexLifecycleService,
  type IndexLifecycleDeps,
} from '@oaknational/oak-search-sdk';
import {
  createEsClient,
  printSuccess,
  printError,
  printJson,
  printHeader,
  type CliSdkEnv,
} from '../shared/index.js';

/**
 * Build a lifecycle service with a no-op ingest stub.
 *
 * Used by commands that only manage aliases and metadata. The ingest
 * dependency is never called by these code paths, so a rejection stub
 * is sufficient.
 */
function buildLifecycleServiceBasic(cliEnv: CliSdkEnv): IndexLifecycleService {
  const client = createEsClient(cliEnv);
  const noOpIngest: IndexLifecycleDeps['runVersionedIngest'] = () =>
    Promise.resolve(
      err({
        type: 'validation_error' as const,
        message: 'Ingestion is not available in this command context',
      }),
    );
  const deps = buildLifecycleDeps(client, cliEnv.SEARCH_INDEX_TARGET, noOpIngest);
  return createIndexLifecycleService(deps);
}

/**
 * Register the `admin promote` subcommand.
 *
 * Promotes a previously staged version by swapping aliases,
 * writing metadata, and cleaning up old index generations.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerPromoteCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('promote')
    .description('Promote a staged version by swapping aliases to it')
    .requiredOption('--version <version>', 'Version string to promote (from stage output)')
    .action(async (opts: { version: string }) => {
      try {
        const service = buildLifecycleServiceBasic(cliEnv);
        const result = await service.promote(opts.version);
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printSuccess(`Promoted version ${result.value.version}`);
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `admin rollback` subcommand.
 *
 * Rolls back to the previous index version recorded in metadata.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerRollbackCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('rollback')
    .description('Roll back to the previous index version')
    .action(async () => {
      try {
        const service = buildLifecycleServiceBasic(cliEnv);
        const result = await service.rollback();
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printSuccess(
          `Rolled back from ${result.value.rolledBackFromVersion} ` +
            `to ${result.value.rolledBackToVersion}`,
        );
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `admin validate-aliases` subcommand.
 *
 * Checks health of all curriculum aliases and prints results.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerValidateAliasesCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('validate-aliases')
    .description('Validate health of all curriculum aliases')
    .action(async () => {
      try {
        const service = buildLifecycleServiceBasic(cliEnv);
        const result = await service.validateAliases();
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printHeader('Alias Health');
        printJson(result.value.entries);
        if (result.value.allHealthy) {
          printSuccess('All aliases are healthy.');
        } else {
          printError('Some aliases are unhealthy.');
          process.exitCode = 1;
        }
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}
