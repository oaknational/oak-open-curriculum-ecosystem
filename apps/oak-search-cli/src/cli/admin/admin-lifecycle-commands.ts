/**
 * CLI commands for lifecycle ingestion operations (ADR-130).
 *
 * Provides versioned-ingest and stage commands that delegate to the
 * SDK lifecycle service. These commands require Oak API credentials
 * for data acquisition.
 *
 * Alias-only commands (promote, rollback, validate-aliases) live in
 * `admin-lifecycle-alias-commands.ts`.
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
  type CliSdkEnv,
} from '../shared/index.js';
import type { OakClientEnv } from '../../adapters/oak-adapter.js';
import { createIngestionClient } from '../../lib/elasticsearch/setup/ingest-client-factory.js';
import { createRunVersionedIngest } from '../../lib/indexing/run-versioned-ingest.js';
import { ingestLogger } from '../../lib/logger.js';

/**
 * Extended environment for lifecycle commands that perform ingestion.
 *
 * Includes Oak API credentials on top of the base CLI SDK environment.
 */
export type LifecycleIngestEnv = CliSdkEnv & OakClientEnv;

/**
 * Build a lifecycle service wired with the real ingest closure.
 *
 * @param cliEnv - Validated CLI environment values including Oak API credentials
 * @returns A wired {@link IndexLifecycleService}
 */
async function buildLifecycleServiceForIngest(
  cliEnv: LifecycleIngestEnv,
): Promise<IndexLifecycleService> {
  const esClient = createEsClient(cliEnv);
  const oakClient = await createIngestionClient({ env: cliEnv });
  const runVersionedIngest = createRunVersionedIngest({
    oakClient,
    esTransport: esClient,
    target: cliEnv.SEARCH_INDEX_TARGET,
    logger: ingestLogger,
  });
  const deps = buildLifecycleDeps(
    esClient,
    cliEnv.SEARCH_INDEX_TARGET,
    runVersionedIngest,
    ingestLogger,
  );
  return createIndexLifecycleService(deps);
}

/**
 * Register the `admin versioned-ingest` subcommand.
 *
 * Runs a full blue/green ingest cycle: create versioned indexes,
 * ingest data, verify counts, swap aliases, and clean up.
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
    .action(
      async (opts: {
        bulkDir: string;
        subjectFilter?: string[];
        minDocCount?: number;
        verbose?: boolean;
      }) => {
        try {
          const service = await buildLifecycleServiceForIngest(cliEnv);
          const result = await service.versionedIngest({
            bulkDir: opts.bulkDir,
            subjectFilter: opts.subjectFilter,
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
 * Register the `admin stage` subcommand.
 *
 * Creates and populates versioned indexes without swapping aliases.
 * The returned version can later be promoted via `admin promote`.
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
    .action(
      async (opts: {
        bulkDir: string;
        subjectFilter?: string[];
        minDocCount?: number;
        verbose?: boolean;
      }) => {
        try {
          const service = await buildLifecycleServiceForIngest(cliEnv);
          const result = await service.stage({
            bulkDir: opts.bulkDir,
            subjectFilter: opts.subjectFilter,
            minDocCount: opts.minDocCount,
            verbose: opts.verbose,
          });
          if (!result.ok) {
            printError(`${result.error.type}: ${result.error.message}`);
            process.exitCode = 1;
            return;
          }
          printSuccess(
            `Staged version ${result.value.version}. ` +
              `Promote with: admin promote --version ${result.value.version}`,
          );
          printJson(result.value);
        } catch (error) {
          printError(error instanceof Error ? error.message : String(error));
          process.exitCode = 1;
        }
      },
    );
}
