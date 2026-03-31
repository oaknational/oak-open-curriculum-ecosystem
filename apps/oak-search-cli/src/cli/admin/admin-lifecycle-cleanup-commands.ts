/**
 * CLI command for targeted version deletion (ADR-130).
 *
 * Thin wrapper over SDK domain logic. The safety guard and deletion
 * are handled by the SDK's `validateVersionDeletion` and
 * `cleanupOrphanedIndexes`. Acquires lifecycle lease to prevent
 * concurrent mutations.
 *
 * @see ADR-130 Blue/green index lifecycle
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { ok } from '@oaknational/result';
import {
  buildAliasLifecycleDeps,
  cleanupOrphanedIndexes,
  validateVersionDeletion,
  withLifecycleLease,
} from '@oaknational/oak-search-sdk/admin';
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
import { ingestLogger } from '../../lib/logger.js';

async function runDeleteVersionCommand(
  cliEnv: CliSdkEnv,
  version: string,
  opts: { force: boolean },
): Promise<void> {
  const esClient = createEsClient(cliEnv);
  await withEsClient(
    esClient,
    async () => {
      const deps = buildAliasLifecycleDeps(esClient, cliEnv.SEARCH_INDEX_TARGET, ingestLogger);
      const result = await withLifecycleLease(esClient, cliEnv.SEARCH_INDEX_TARGET, async () => {
        const validation = await validateVersionDeletion(deps, version, opts.force);
        if (validation.blocked) {
          printError(validation.message);
          process.exitCode = 1;
          return ok(undefined);
        }

        printHeader(`Deleting version ${version}`);
        await cleanupOrphanedIndexes(deps, version);
        printSuccess(`Deleted versioned indexes for ${version}`);
        printJson({ version, target: cliEnv.SEARCH_INDEX_TARGET });
        return ok(undefined);
      });
      if (!result.ok) {
        ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
        printError(`${result.error.type}: ${result.error.message}`);
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
}

/**
 * Register the `admin delete-version` subcommand.
 *
 * Deletes all 6 versioned indexes for a given version string.
 * Acquires the lifecycle lease to prevent concurrent mutations.
 * Refuses if the version is currently serving live aliases.
 * Blocks if deleting the rollback target, unless `--force` is passed.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerDeleteVersionCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('delete-version <version>')
    .description('Delete all 6 versioned indexes for a specific version')
    .option('--force', 'Delete even if the version is the rollback target', false)
    .action(
      withLoadedCliEnv(
        cliEnvLoader,
        async (cliEnv: CliSdkEnv, version: string, opts: { force: boolean }) =>
          runDeleteVersionCommand(cliEnv, version, opts),
      ),
    );
}
