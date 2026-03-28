/**
 * Observe subcommand group — zero-hit observability operations.
 *
 * Provides commands for fetching telemetry, purging old events,
 * and viewing zero-hit summaries via the Search SDK.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 *
 * @example
 * ```bash
 * oaksearch observe telemetry --limit 50
 * oaksearch observe summary
 * oaksearch observe purge --older-than-days 30 --target primary
 * ```
 */

import { Command } from 'commander';
import { createObservabilityService } from '@oaknational/oak-search-sdk/read';
import {
  createEsClient,
  withEsClient,
  withLoadedCliEnv,
  printJson,
  printError,
  registerPassThrough,
  type CliSdkEnv,
  type SearchCliEnvLoader,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import type { WithEsClientDeps } from '../shared/with-es-client.js';
import { handleTelemetry, handleSummary } from './handlers.js';
import { observeLogger } from '../../lib/logger.js';

/** Shared `withEsClient` deps for observe commands. */
const observeDeps: WithEsClientDeps = {
  logger: observeLogger,
  printError,
  setExitCode: (c) => {
    process.exitCode = c;
  },
};

/**
 * Register the `observe telemetry` subcommand (SDK-mapped).
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
function registerTelemetryCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('telemetry')
    .description('Fetch persisted zero-hit telemetry from Elasticsearch')
    .option('-l, --limit <n>', 'Maximum number of events to return', '50')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv, opts: { limit: string }) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const observability = createObservabilityService(
              esClient,
              buildSearchSdkConfig(cliEnv),
            );
            const result = await handleTelemetry(observability, {
              limit: parseInt(opts.limit, 10),
            });
            if (!result.ok) {
              observeLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              observeDeps.setExitCode(1);
              return;
            }
            printJson(result.value);
          },
          observeDeps,
        );
      }),
    );
}

/**
 * Register the `observe summary` subcommand (SDK-mapped).
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
function registerSummaryCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('summary')
    .description('Show aggregated zero-hit summary')
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: CliSdkEnv) => {
        const esClient = createEsClient(cliEnv);
        await withEsClient(
          esClient,
          async () => {
            const observability = createObservabilityService(
              esClient,
              buildSearchSdkConfig(cliEnv),
            );
            // handleSummary is a sync in-memory operation — cannot fail, no Result wrapping needed
            const result = handleSummary(observability);
            printJson(result);
          },
          observeDeps,
        );
      }),
    );
}

/**
 * Create the `observe` subcommand group.
 *
 * @param cliEnv - Validated CLI environment values
 * @returns A Commander `Command` with observe subcommands registered
 */
export function observeCommand(cliEnvLoader: SearchCliEnvLoader): Command {
  const cmd = new Command('observe').description(
    'Zero-hit telemetry, event purging, and summaries',
  );

  registerTelemetryCmd(cmd, cliEnvLoader);
  registerSummaryCmd(cmd, cliEnvLoader);
  registerPassThrough(
    cmd,
    'purge',
    'Delete persisted zero-hit events older than retention window',
    'operations/observability/delete-zero-hit-events.ts',
    { cliEnvLoader },
  );

  return cmd;
}
