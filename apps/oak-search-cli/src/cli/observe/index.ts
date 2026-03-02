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
import {
  createCliSdk,
  printJson,
  printError,
  registerPassThrough,
  type CliSdkEnv,
} from '../shared/index.js';
import { handleTelemetry, handleSummary } from './handlers.js';

/**
 * Register the `observe telemetry` subcommand (SDK-mapped).
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerTelemetryCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('telemetry')
    .description('Fetch persisted zero-hit telemetry from Elasticsearch')
    .option('-l, --limit <n>', 'Maximum number of events to return', '50')
    .action(async (opts: { limit: string }) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleTelemetry(sdk.observability, {
          limit: parseInt(opts.limit, 10),
        });
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `observe summary` subcommand (SDK-mapped).
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
function registerSummaryCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('summary')
    .description('Show aggregated zero-hit summary')
    .action(() => {
      try {
        const sdk = createCliSdk(cliEnv);
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
 *
 * @example
 * ```typescript
 * const program = new Command();
 * program.addCommand(observeCommand());
 * ```
 */
export function observeCommand(cliEnv: CliSdkEnv): Command {
  const cmd = new Command('observe').description(
    'Zero-hit telemetry, event purging, and summaries',
  );

  registerTelemetryCmd(cmd, cliEnv);
  registerSummaryCmd(cmd, cliEnv);
  registerPassThrough(
    cmd,
    'purge',
    'Delete persisted zero-hit events older than retention window',
    'operations/observability/delete-zero-hit-events.ts',
    { cliEnv },
  );

  return cmd;
}
