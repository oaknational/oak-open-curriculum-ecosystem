/**
 * CLI commands for orphan detection and cleanup (ADR-130).
 *
 * Thin wrappers over SDK domain logic. Orphaned versions are those
 * not pointed to by any alias and not the metadata previous_version
 * (rollback target). Mutating commands acquire the lifecycle lease.
 *
 * @see ADR-130 Blue/green index lifecycle
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { ok } from '@oaknational/result';
import {
  buildAliasLifecycleDeps,
  cleanupOrphanedIndexes,
  resolveOrphanedVersions,
  withLifecycleLease,
} from '@oaknational/oak-search-sdk/admin';
import {
  createEsClient,
  withEsClient,
  printSuccess,
  printError,
  printInfo,
  printJson,
  printHeader,
  type CliSdkEnv,
} from '../shared/index.js';
import { ingestLogger } from '../../lib/logger.js';

/**
 * Register the `admin list-orphans` subcommand.
 *
 * Lists versioned index versions that are not pointed to by any alias
 * and are not the metadata previous_version (rollback target).
 * Read-only — does not acquire the lifecycle lease.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerListOrphansCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('list-orphans')
    .description('List orphaned versioned index versions')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const deps = buildAliasLifecycleDeps(esClient, cliEnv.SEARCH_INDEX_TARGET, ingestLogger);
          const result = await resolveOrphanedVersions(deps);
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }

          if (result.orphans.length === 0) {
            printSuccess('No orphaned versions found.');
            return;
          }

          printHeader(`Orphaned versions (${result.orphans.length})`);
          printJson(result.orphans);
        },
        {
          logger: ingestLogger,
          printError,
          setExitCode: (c: number) => {
            process.exitCode = c;
          },
        },
      );
    });
}

/**
 * Register the `admin cleanup-orphans` subcommand.
 *
 * Finds and deletes all orphaned versioned index versions.
 * Dry-run by default — use `--confirm` to actually delete.
 * Acquires the lifecycle lease when `--confirm` is set to prevent
 * concurrent mutations.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerCleanupOrphansCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('cleanup-orphans')
    .description('Find and delete orphaned versioned index versions (dry-run by default)')
    .option('--confirm', 'Actually delete orphaned indexes (default is dry-run)', false)
    .action(async (opts: { confirm: boolean }) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const deps = buildAliasLifecycleDeps(esClient, cliEnv.SEARCH_INDEX_TARGET, ingestLogger);

          if (!opts.confirm) {
            await listOrphansDryRun(deps);
            return;
          }

          const leaseResult = await withLifecycleLease(
            esClient,
            cliEnv.SEARCH_INDEX_TARGET,
            async () => {
              await deleteOrphans(deps);
              return ok(undefined);
            },
          );
          if (!leaseResult.ok) {
            ingestLogger.error(
              `${leaseResult.error.type}: ${leaseResult.error.message}`,
              leaseResult.error,
            );
            printError(`${leaseResult.error.type}: ${leaseResult.error.message}`);
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
    });
}

/** Dry-run: resolve and display orphans without deletion. */
async function listOrphansDryRun(
  deps: Parameters<typeof resolveOrphanedVersions>[0],
): Promise<void> {
  const result = await resolveOrphanedVersions(deps);
  if (!result.ok) {
    printError(`${result.error.type}: ${result.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (result.orphans.length === 0) {
    printSuccess('No orphaned versions found.');
    return;
  }
  printHeader(`Orphaned versions (${result.orphans.length})`);
  printJson(result.orphans);
  printInfo('Dry run. Use --confirm to delete orphaned versions.');
}

/** Resolve orphans inside the lease and delete them. */
async function deleteOrphans(deps: Parameters<typeof resolveOrphanedVersions>[0]): Promise<void> {
  const result = await resolveOrphanedVersions(deps);
  if (!result.ok) {
    printError(`${result.error.type}: ${result.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (result.orphans.length === 0) {
    printSuccess('No orphaned versions found.');
    return;
  }
  printHeader(`Orphaned versions (${result.orphans.length})`);
  printJson(result.orphans);
  for (const orphan of result.orphans) {
    await cleanupOrphanedIndexes(deps, orphan.version);
    printSuccess(`Deleted ${orphan.version}`);
  }
  printSuccess(`Cleaned up ${result.orphans.length} orphaned version(s).`);
}
