/**
 * Register the `admin meta` subcommand group.
 *
 * Provides `meta get` and `meta set` for reading and writing
 * the index metadata document stored in Elasticsearch.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import type { Command } from 'commander';
import { sanitiseForJson } from '@oaknational/logger';
import { err, ok, type Result } from '@oaknational/result';
import { createAdminService } from '@oaknational/oak-search-sdk/admin';
import { isIndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import {
  createEsClient,
  withEsClient,
  printJson,
  printError,
  printSuccess,
  type CliSdkEnv,
} from '../shared/index.js';
import { buildSearchSdkConfig } from '../shared/build-search-sdk-config.js';
import { handleGetMeta, handleSetMeta } from './handlers.js';
import { adminLogger } from '../../lib/logger.js';

/** Shared `withEsClient` deps for meta commands. */
const metaDeps = {
  logger: adminLogger,
  printError,
  setExitCode: (c: number) => {
    process.exitCode = c;
  },
};

/**
 * Parse and validate metadata JSON before any Elasticsearch resources are created.
 *
 * @param json - Raw JSON string from CLI argument
 * @returns Result containing parsed metadata or a typed validation error
 */
interface ParseMetaJsonError {
  readonly type: 'invalid_json' | 'schema_mismatch';
  readonly message: string;
}

export function parseMetaJson(json: string): Result<IndexMetaDoc, ParseMetaJsonError> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({
      type: 'invalid_json',
      message: `Invalid metadata JSON: ${message}`,
    });
  }
  if (!isIndexMetaDoc(parsed)) {
    return err({
      type: 'schema_mismatch',
      message: 'Invalid metadata JSON: does not match IndexMetaDoc schema.',
    });
  }
  return ok(parsed);
}

/**
 * Register the `meta get` subcommand.
 *
 * @param parent - The meta Commander command group
 * @param cliEnv - Validated CLI environment values
 */
function registerMetaGetCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('get')
    .description('Read current index metadata from Elasticsearch')
    .action(async () => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const admin = createAdminService(esClient, buildSearchSdkConfig(cliEnv));
          const result = await handleGetMeta(admin);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, {
              error: sanitiseForJson(result.error),
            });
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printJson(result.value);
        },
        metaDeps,
      );
    });
}

/**
 * Register the `meta set` subcommand.
 *
 * Validates JSON input against the `IndexMetaDoc` schema before writing.
 *
 * @param parent - The meta Commander command group
 * @param cliEnv - Validated CLI environment values
 */
function registerMetaSetCmd(parent: Command, cliEnv: CliSdkEnv): void {
  parent
    .command('set')
    .description('Write index metadata to Elasticsearch')
    .argument('<json>', 'JSON string of metadata to write')
    .action(async (json: string) => {
      const parsed = parseMetaJson(json);
      if (!parsed.ok) {
        adminLogger.error(parsed.error.message, {
          error: sanitiseForJson(parsed.error),
        });
        printError(parsed.error.message);
        process.exitCode = 1;
        return;
      }
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const admin = createAdminService(esClient, buildSearchSdkConfig(cliEnv));
          const result = await handleSetMeta(admin, parsed.value);
          if (!result.ok) {
            adminLogger.error(`${result.error.type}: ${result.error.message}`, {
              error: sanitiseForJson(result.error),
            });
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess('Index metadata written successfully.');
        },
        metaDeps,
      );
    });
}

/**
 * Register the `admin meta` subcommand group.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values
 */
export function registerMetaCmd(parent: Command, cliEnv: CliSdkEnv): void {
  const metaCmd = parent.command('meta').description('Read or write index metadata');
  registerMetaGetCmd(metaCmd, cliEnv);
  registerMetaSetCmd(metaCmd, cliEnv);
}
