/**
 * CLI commands for lifecycle lease operations (ADR-130).
 *
 * Provides inspect-lease and release-lease commands for diagnosing
 * and managing lifecycle lease state. These are operational commands
 * separate from alias management.
 *
 * @see ADR-130 Blue/green index lifecycle
 */

import type { Command } from 'commander';
import { forceReleaseLease, inspectLease } from '@oaknational/oak-search-sdk/admin';
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

/**
 * Register the `admin inspect-lease` subcommand.
 *
 * Shows the current lifecycle lease state for the target.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerInspectLeaseCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('inspect-lease')
    .description('Show current lifecycle lease status')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const result = await inspectLease(esClient, cliEnv.SEARCH_INDEX_TARGET);
            if (!result.ok) {
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printHeader('Lease Status');
            printJson(result.value);
            if (!result.value.held) {
              printSuccess('No lease is currently held.');
            } else if (result.value.expired) {
              printError(
                `Lease held by ${result.value.holder} has EXPIRED (${result.value.expiresAt}). ` +
                  `Use 'admin release-lease' to clear it.`,
              );
            } else {
              printSuccess(`Lease is actively held by ${result.value.holder}.`);
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

/**
 * Register the `admin release-lease` subcommand.
 *
 * Force-releases any lifecycle lease for the target, regardless of
 * holder or expiry. Use when a process has died and left a stale lease.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerReleaseLeaseCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('release-lease')
    .description('Force-release a stuck lifecycle lease')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const status = await inspectLease(esClient, cliEnv.SEARCH_INDEX_TARGET);
            if (status.ok && !status.value.held) {
              printSuccess('No lease is currently held — nothing to release.');
              return;
            }
            if (status.ok) {
              ingestLogger.info('Releasing lease', {
                holder: status.value.holder,
                runId: status.value.runId,
                expired: status.value.expired,
              });
            }
            const result = await forceReleaseLease(esClient, cliEnv.SEARCH_INDEX_TARGET);
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printSuccess('Lifecycle lease released.');
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
