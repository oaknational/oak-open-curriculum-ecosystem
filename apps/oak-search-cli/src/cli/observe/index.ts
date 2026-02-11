/**
 * Observe subcommand group — zero-hit observability operations.
 *
 * Provides commands for fetching telemetry, purging old events,
 * and viewing zero-hit summaries via the Search SDK.
 *
 * @example
 * ```bash
 * oaksearch observe telemetry --limit 50
 * oaksearch observe summary
 * oaksearch observe purge --older-than-days 30 --target primary
 * ```
 */

import { Command } from 'commander';
import { createCliSdk, printJson, printError, registerPassThrough } from '../shared/index.js';
import { env } from '../../lib/env.js';
import { handleTelemetry, handleSummary } from './handlers.js';

/** Register the `observe telemetry` subcommand (SDK-mapped). */
function registerTelemetryCmd(parent: Command): void {
  parent
    .command('telemetry')
    .description('Fetch persisted zero-hit telemetry from Elasticsearch')
    .option('-l, --limit <n>', 'Maximum number of events to return', '50')
    .action(async (opts: { limit: string }) => {
      try {
        const sdk = createCliSdk(env());
        const result = await handleTelemetry(sdk.observability, {
          limit: parseInt(opts.limit, 10),
        });
        printJson(result);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/** Register the `observe summary` subcommand (SDK-mapped). */
function registerSummaryCmd(parent: Command): void {
  parent
    .command('summary')
    .description('Show aggregated zero-hit summary')
    .action(() => {
      try {
        const sdk = createCliSdk(env());
        const result = handleSummary(sdk.observability);
        printJson(result);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Create the `observe` subcommand group.
 *
 * @returns A Commander `Command` with observe subcommands registered
 */
export function observeCommand(): Command {
  const cmd = new Command('observe').description(
    'Zero-hit telemetry, event purging, and summaries',
  );

  registerTelemetryCmd(cmd);
  registerSummaryCmd(cmd);
  registerPassThrough(
    cmd,
    'purge',
    'Delete persisted zero-hit events older than retention window',
    'operations/observability/delete-zero-hit-events.ts',
  );

  return cmd;
}
