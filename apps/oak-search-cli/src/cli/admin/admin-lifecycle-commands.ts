/**
 * CLI commands for lifecycle ingestion operations (ADR-130).
 *
 * Provides versioned-ingest and stage commands that delegate to the
 * SDK lifecycle service. These commands require Oak API credentials
 * for data acquisition.
 *
 * Resource ownership pattern:
 * - ES client: created by handler, cleaned up by `withEsClient`
 * - OakClient: created inside handler, cleaned up in local `finally`
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import { existsSync, readdirSync } from 'node:fs';
import type { Command } from 'commander';
import type { Client } from '@elastic/elasticsearch';
import type { IndexLifecycleService } from '@oaknational/oak-search-sdk';
import {
  createEsClient,
  withEsClient,
  buildLifecycleService,
  resolveBulkDir,
  validateIngestEnv,
  printSuccess,
  printError,
  printJson,
  APP_ROOT,
  type CliSdkEnv,
} from '../shared/index.js';
import type { OakClientEnv } from '../../adapters/oak-adapter.js';
import { createIngestionClient } from '../../lib/elasticsearch/setup/ingest-client-factory.js';
import { createRunVersionedIngest } from '../../lib/indexing/run-versioned-ingest.js';
import { ingestLogger } from '../../lib/logger.js';

/**
 * Extended environment for lifecycle commands that perform ingestion.
 */
export type LifecycleIngestEnv = CliSdkEnv & OakClientEnv;

/** Shared `withEsClient` deps for lifecycle ingest commands. */
const ingestDeps = {
  logger: ingestLogger,
  printError,
  setExitCode: (c: number) => {
    process.exitCode = c;
  },
};

/** Real filesystem predicates for `resolveBulkDir`. */
const realFs = { existsSync, readdirSync: (p: string) => readdirSync(p) };

/** Options shared by versioned-ingest and stage commands. */
interface LifecycleIngestOpts {
  readonly bulkDir: string;
  readonly subjectFilter?: string[];
  readonly minDocCount?: number;
  readonly verbose?: boolean;
}

/**
 * Wire up ingestion resources and return the lifecycle service.
 *
 * OakClient cleanup is the caller's responsibility (via `finally`).
 */
async function buildIngestService(
  esClient: Client,
  cliEnv: LifecycleIngestEnv,
): Promise<{ service: IndexLifecycleService; oakClient: { disconnect(): Promise<void> } }> {
  const oakClient = await createIngestionClient({ env: cliEnv });
  const runVersionedIngest = createRunVersionedIngest({
    oakClient,
    esTransport: esClient,
    target: cliEnv.SEARCH_INDEX_TARGET,
    logger: ingestLogger,
  });
  const service = buildLifecycleService(
    esClient,
    cliEnv.SEARCH_INDEX_TARGET,
    runVersionedIngest,
    ingestLogger,
  );
  return { service, oakClient };
}

/** Safely disconnect the OakClient, logging warnings on failure. */
async function disconnectOakClient(oakClient: { disconnect(): Promise<void> }): Promise<void> {
  try {
    await oakClient.disconnect();
  } catch (disconnectErr: unknown) {
    ingestLogger.warn('OakClient disconnect failed', disconnectErr);
  }
}

/**
 * Register the `admin versioned-ingest` subcommand.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values including Oak API credentials
 */
export function registerVersionedIngestCmd(parent: Command, cliEnv: LifecycleIngestEnv): void {
  parent
    .command('versioned-ingest')
    .description('Run a versioned blue/green ingest cycle (ADR-130)')
    .requiredOption('--bulk-dir <path>', 'Path to bulk download data directory')
    .option('--subject-filter <subjects...>', 'Ingest only specific subjects')
    .option('--min-doc-count <count>', 'Minimum docs per index', parseInt)
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (opts: LifecycleIngestOpts) => {
      const bulkResult = resolveBulkDir(opts.bulkDir, APP_ROOT, realFs);
      if (!bulkResult.ok) {
        ingestLogger.error(bulkResult.error.message, bulkResult.error);
        printError(bulkResult.error.message);
        process.exitCode = 1;
        return;
      }
      const envResult = validateIngestEnv({ oakApiKey: cliEnv.OAK_API_KEY });
      if (!envResult.ok) {
        ingestLogger.error(envResult.error.message, envResult.error);
        printError(envResult.error.message);
        process.exitCode = 1;
        return;
      }
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const { service, oakClient } = await buildIngestService(esClient, cliEnv);
          try {
            const result = await service.versionedIngest({
              ...opts,
              bulkDir: bulkResult.value,
            });
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printSuccess(`Versioned ingest complete: version ${result.value.version}`);
            printJson(result.value);
          } finally {
            await disconnectOakClient(oakClient);
          }
        },
        ingestDeps,
      );
    });
}

/**
 * Register the `admin stage` subcommand.
 *
 * Creates and populates versioned indexes without swapping aliases.
 *
 * @param parent - The parent Commander command to register under
 * @param cliEnv - Validated CLI environment values including Oak API credentials
 */
export function registerStageCmd(parent: Command, cliEnv: LifecycleIngestEnv): void {
  parent
    .command('stage')
    .description('Stage versioned indexes without promoting (create, ingest, verify)')
    .requiredOption('--bulk-dir <path>', 'Path to bulk download data directory')
    .option('--subject-filter <subjects...>', 'Ingest only specific subjects')
    .option('--min-doc-count <count>', 'Minimum docs per index', parseInt)
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (opts: LifecycleIngestOpts) => {
      const bulkResult = resolveBulkDir(opts.bulkDir, APP_ROOT, realFs);
      if (!bulkResult.ok) {
        ingestLogger.error(bulkResult.error.message, bulkResult.error);
        printError(bulkResult.error.message);
        process.exitCode = 1;
        return;
      }
      const envResult = validateIngestEnv({ oakApiKey: cliEnv.OAK_API_KEY });
      if (!envResult.ok) {
        ingestLogger.error(envResult.error.message, envResult.error);
        printError(envResult.error.message);
        process.exitCode = 1;
        return;
      }
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const { service, oakClient } = await buildIngestService(esClient, cliEnv);
          try {
            const result = await service.stage({ ...opts, bulkDir: bulkResult.value });
            if (!result.ok) {
              ingestLogger.error(`${result.error.type}: ${result.error.message}`, result.error);
              printError(`${result.error.type}: ${result.error.message}`);
              process.exitCode = 1;
              return;
            }
            printSuccess(
              `Staged version ${result.value.version}. ` +
                `Promote with: admin promote --version ${result.value.version}`,
            );
            printJson(result.value);
          } finally {
            await disconnectOakClient(oakClient);
          }
        },
        ingestDeps,
      );
    });
}
