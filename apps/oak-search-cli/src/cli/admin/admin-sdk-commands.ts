/**
 * SDK-mapped admin commands — setup, status, synonyms, and metadata.
 *
 * Each command creates an SDK instance, calls the appropriate handler,
 * and applies the CLI error boundary pattern: check `result.ok`,
 * print error type and message on failure, set `process.exitCode = 1`.
 */

import type { Command } from 'commander';
import { isIndexMetaDoc } from '@oaknational/curriculum-sdk/public/search.js';
import {
  createCliSdk,
  printJson,
  printError,
  printSuccess,
  printHeader,
  type CliSdkEnv,
} from '../shared/index.js';
import {
  handleSetup,
  handleReset,
  handleStatus,
  handleSynonyms,
  handleGetMeta,
  handleSetMeta,
} from './handlers.js';

/**
 * Register the `admin setup` subcommand.
 *
 * Wires the `--reset` and `--verbose` flags to the SDK admin service.
 * When `--reset` is passed, all indexes are deleted before re-creation.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerSetupCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('setup')
    .description('Create synonyms and all search indexes (idempotent)')
    .option('--reset', 'Delete and recreate all indexes (destructive)')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (opts: { reset?: boolean; verbose?: boolean }) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const options = opts.verbose ? { verbose: true } : undefined;

        if (opts.reset) {
          const result = await handleReset(sdk.admin, options);
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess(
            `Reset complete. ${result.value.synonymCount} synonyms, ${result.value.indexResults.length} indexes.`,
          );
          printJson(result.value);
        } else {
          const result = await handleSetup(sdk.admin, options);
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess(
            `Setup complete. ${result.value.synonymCount} synonyms, ${result.value.indexResults.length} indexes.`,
          );
          printJson(result.value);
        }
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `admin status` subcommand.
 *
 * Displays Elasticsearch connection info and current index listing
 * as two separate JSON sections.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerStatusCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('status')
    .description('Show Elasticsearch connection status and index listing')
    .action(async () => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleStatus(sdk.admin);
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printHeader('Connection');
        printJson(result.value.connection);
        printHeader('Indexes');
        printJson(result.value.indexes);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `admin synonyms` subcommand.
 *
 * Upserts the curriculum synonym set into Elasticsearch and prints
 * the count of synonyms created.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerSynonymsCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('synonyms')
    .description('Update the synonym set in Elasticsearch')
    .action(async () => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleSynonyms(sdk.admin);
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printSuccess(`Synonyms updated: ${result.value.count} synonyms.`);
        printJson(result.value);
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}

/**
 * Register the `admin meta` subcommand group.
 *
 * Provides `meta get` and `meta set` for reading and writing
 * the index metadata document stored in Elasticsearch. The `set`
 * command validates JSON input against the `IndexMetaDoc` schema
 * before writing.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerMetaCmd(parent: Command, cliEnv: CliSdkEnv): void {
  const metaCmd = parent.command('meta').description('Read or write index metadata');

  metaCmd
    .command('get')
    .description('Read current index metadata from Elasticsearch')
    .action(async () => {
      try {
        const sdk = createCliSdk(cliEnv);
        const result = await handleGetMeta(sdk.admin);
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

  metaCmd
    .command('set')
    .description('Write index metadata to Elasticsearch')
    .argument('<json>', 'JSON string of metadata to write')
    .action(async (json: string) => {
      try {
        const sdk = createCliSdk(cliEnv);
        const parsed: unknown = JSON.parse(json);
        if (!isIndexMetaDoc(parsed)) {
          throw new Error('Invalid metadata JSON: does not match IndexMetaDoc schema.');
        }
        const result = await handleSetMeta(sdk.admin, parsed);
        if (!result.ok) {
          printError(`${result.error.type}: ${result.error.message}`);
          process.exitCode = 1;
          return;
        }
        printSuccess('Index metadata written successfully.');
      } catch (error) {
        printError(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    });
}
