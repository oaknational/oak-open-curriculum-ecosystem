/**
 * CLI commands for the index lifecycle service (ADR-130).
 *
 * Provides versioned-ingest, rollback, and validate-aliases commands
 * that delegate to the SDK lifecycle service.
 */

import type { Command } from 'commander';
import {
  buildLifecycleDeps,
  createIndexLifecycleService,
  type IndexLifecycleService,
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
 * Build a lifecycle service from CLI environment configuration.
 *
 * @param cliEnv - Validated CLI environment values
 * @returns A wired {@link IndexLifecycleService}
 */
function buildLifecycleService(cliEnv: CliSdkEnv): IndexLifecycleService {
  const client = createEsClient(cliEnv);
  const deps = buildLifecycleDeps(client, cliEnv.SEARCH_INDEX_TARGET);
  return createIndexLifecycleService(deps);
}

/**
 * Register the `admin versioned-ingest` subcommand.
 *
 * Runs a full blue/green ingest cycle: create versioned indexes,
 * ingest data, verify counts, swap aliases, and clean up.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerVersionedIngestCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('versioned-ingest')
    .description('Run a versioned blue/green ingest cycle (ADR-130)')
    .requiredOption('--bulk-dir <path>', 'Path to bulk download data directory')
    .option('--subject-filter <subjects...>', 'Ingest only specific subjects')
    .option('--version <version>', 'Explicit version string override')
    .option('--min-doc-count <count>', 'Minimum docs per index', parseInt)
    .option('-v, --verbose', 'Enable verbose output')
    .action(
      async (opts: {
        bulkDir: string;
        subjectFilter?: string[];
        version?: string;
        minDocCount?: number;
        verbose?: boolean;
      }) => {
        try {
          const service = buildLifecycleService(cliEnv);
          const result = await service.versionedIngest({
            bulkDir: opts.bulkDir,
            subjectFilter: opts.subjectFilter,
            version: opts.version,
            minDocCount: opts.minDocCount,
            verbose: opts.verbose,
          });
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess(`Versioned ingest complete: version ${result.value.version}`);
          printJson(result.value);
        } catch (error) {
          printError(error instanceof Error ? error.message : String(error));
          process.exitCode = 1;
        }
      },
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
export function registerRollbackCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('rollback')
    .description('Roll back to the previous index version')
    .action(async () => {
      try {
        const service = buildLifecycleService(cliEnv);
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
        const service = buildLifecycleService(cliEnv);
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
