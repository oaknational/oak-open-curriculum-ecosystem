/**
 * CLI commands for alias and metadata lifecycle operations (ADR-130).
 *
 * Provides promote, rollback, and validate-aliases commands that
 * delegate to the SDK lifecycle service. These commands only manage
 * aliases and metadata — they do not perform ingestion.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @see ADR-130 Blue/green index lifecycle
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { InvalidArgumentError } from 'commander';
import { withLifecycleLease } from '@oaknational/oak-search-sdk/admin';
import {
  createEsClient,
  withEsClient,
  withLoadedCliEnv,
  printSuccess,
  printError,
  printJson,
  printHeader,
  type CliSdkEnv,
  type SearchCliEnvLoader,
} from '../shared/index.js';
import { buildAliasLifecycleService } from './shared/build-lifecycle-service.js';
import { ingestLogger } from '../../lib/logger.js';

function parseVersionOption(rawOpts: unknown): string {
  if (!rawOpts || typeof rawOpts !== 'object' || !('targetVersion' in rawOpts)) {
    throw new InvalidArgumentError('Missing required --target-version option.');
  }
  const candidate = rawOpts.targetVersion;
  if (typeof candidate !== 'string' || candidate.length === 0) {
    throw new InvalidArgumentError('--target-version must be a non-empty string.');
  }
  return candidate;
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
export function registerPromoteCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('promote')
    .description('Promote a staged version by swapping aliases to it')
    .requiredOption('--target-version <version>', 'Version string to promote (from stage output)')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv, rawOpts: unknown) => {
        const version = parseVersionOption(rawOpts);
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const service = buildAliasLifecycleService(
              esClient,
              cliEnv.SEARCH_INDEX_TARGET,
              ingestLogger,
            );
            const result = await withLifecycleLease(esClient, cliEnv.SEARCH_INDEX_TARGET, () =>
              service.promote(version),
            );
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printSuccess(`Promoted version ${result.value.version}`);
            printJson(result.value);
          },
          {
            logger: ingestLogger,
            printError,
            setExitCode: (c: number) => {
              process.exitCode = c;
            },
          },
        );
      }),
    );
}

/**
 * Register the `admin rollback` subcommand.
 *
 * Rolls back to the previous index version recorded in metadata.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerRollbackCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('rollback')
    .description('Roll back to the previous index version')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const service = buildAliasLifecycleService(
              esClient,
              cliEnv.SEARCH_INDEX_TARGET,
              ingestLogger,
            );
            const result = await withLifecycleLease(esClient, cliEnv.SEARCH_INDEX_TARGET, () =>
              service.rollback(),
            );
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printSuccess(
              `Rolled back from ${result.value.rolledBackFromVersion} ` +
                `to ${result.value.rolledBackToVersion}`,
            );
            printJson(result.value);
          },
          {
            logger: ingestLogger,
            printError,
            setExitCode: (c: number) => {
              process.exitCode = c;
            },
          },
        );
      }),
    );
}

/**
 * Register the `admin validate-aliases` subcommand.
 *
 * Checks health of all curriculum aliases and prints results.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerValidateAliasesCmd(
  parent: Command,
  cliEnvLoader: SearchCliEnvLoader,
): void {
  parent
    .command('validate-aliases')
    .description('Validate health of all curriculum aliases')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const service = buildAliasLifecycleService(
              esClient,
              cliEnv.SEARCH_INDEX_TARGET,
              ingestLogger,
            );
            const result = await service.validateAliases();
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
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
          },
          {
            logger: ingestLogger,
            printError,
            setExitCode: (c: number) => {
              process.exitCode = c;
            },
          },
        );
      }),
    );
}
