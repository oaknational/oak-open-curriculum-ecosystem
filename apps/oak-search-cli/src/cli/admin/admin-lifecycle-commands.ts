/** CLI commands for lifecycle ingestion operations (ADR-130). */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { InvalidArgumentError, type Command } from 'commander';
import type { Client } from '@elastic/elasticsearch';
import { sanitiseForJson } from '@oaknational/observability';
import {
  enforceRestrictedInclusionBoundary,
  withLifecycleLease,
  type AdminError,
  type IndexLifecycleService,
} from '@oaknational/oak-search-sdk/admin';
import type { BulkDataEnv } from '@oaknational/env';
import type { Result } from '@oaknational/result';
import {
  createEsClient,
  withEsClient,
  withLoadedCliEnv,
  printSuccess,
  printError,
  printInfo,
  printJson,
  APP_ROOT,
  type CliSdkEnv,
  type SearchCliEnvLoader,
} from '../shared/index.js';
import { withVerifiedBulkData } from './shared/with-verified-bulk-data.js';
import { buildLifecycleService } from './shared/build-lifecycle-service.js';
import {
  parseLifecycleIngestOpts,
  type ParsedLifecycleIngestOpts,
} from './shared/parse-lifecycle-ingest-opts.js';
import type { OakClientEnv } from '../../adapters/oak-adapter.js';
import { createIngestionClient } from '../../lib/elasticsearch/setup/ingest-client-factory.js';
import { createRunVersionedIngest } from '../../lib/indexing/run-versioned-ingest.js';
import { ingestLogger } from '../../lib/logger.js';

type LifecycleIngestEnv = CliSdkEnv & OakClientEnv & BulkDataEnv;

function validateMinDocCount(rawCount: string): number {
  const parsed = Number.parseInt(rawCount, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new InvalidArgumentError('--min-doc-count must be a non-negative integer.');
  }
  return parsed;
}

const ingestDeps = {
  logger: ingestLogger,
  printError,
  setExitCode: (c: number) => (process.exitCode = c),
};
const realGateFs = {
  existsSync,
  readdirSync: (p: string) => readdirSync(p),
  readFileSync: (p: string) => readFileSync(p, 'utf8'),
};
const gateDeps = {
  logger: ingestLogger,
  printError,
  printInfo,
  setExitCode: (c: number) => (process.exitCode = c),
};

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

async function disconnectOakClient(oakClient: { disconnect(): Promise<void> }): Promise<void> {
  try {
    await oakClient.disconnect();
  } catch (disconnectErr: unknown) {
    ingestLogger.warn('OakClient disconnect failed', {
      error: sanitiseForJson(disconnectErr),
    });
  }
}

/** The gate inputs every ingest command builds at entry (ADR-078 clock). */
function gateInputFor(cliEnv: LifecycleIngestEnv, opts: ParsedLifecycleIngestOpts) {
  return {
    bulkDirFlag: opts.bulkDir,
    bulkDirFromEnv: cliEnv.BULK_DOWNLOAD_DIR,
    oakApiKey: cliEnv.OAK_API_KEY,
    appRoot: APP_ROOT,
    now: new Date(),
    fs: realGateFs,
  };
}

function handleLifecycleResult<T>(
  result: Result<T, AdminError>,
  onSuccess: (value: T) => void,
): void {
  if (!result.ok) {
    ingestLogger.error(`${result.error.type}: ${result.error.message}`, {
      error: sanitiseForJson(result.error),
    });
    printError(`${result.error.type}: ${result.error.message}`);
    process.exitCode = 1;
    return;
  }
  onSuccess(result.value);
}

async function runVersionedIngestAction(
  cliEnv: LifecycleIngestEnv,
  opts: ParsedLifecycleIngestOpts,
): Promise<void> {
  const restrictedGuard = enforceRestrictedInclusionBoundary(opts);
  if (!restrictedGuard.ok) {
    handleLifecycleResult(restrictedGuard, () => undefined);
    return;
  }
  await withVerifiedBulkData(
    gateInputFor(cliEnv, opts),
    async (bulkDir) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const { service, oakClient } = await buildIngestService(esClient, cliEnv);
          try {
            const result = await withLifecycleLease(esClient, cliEnv.SEARCH_INDEX_TARGET, () =>
              service.versionedIngest({ ...opts, bulkDir }),
            );
            handleLifecycleResult(result, (value) => {
              printSuccess(`Versioned ingest complete: version ${value.version}`);
              printJson(value);
            });
          } finally {
            await disconnectOakClient(oakClient);
          }
        },
        ingestDeps,
      );
    },
    gateDeps,
  );
}

async function runStageAction(
  cliEnv: LifecycleIngestEnv,
  opts: ParsedLifecycleIngestOpts,
): Promise<void> {
  const restrictedGuard = enforceRestrictedInclusionBoundary(opts);
  if (!restrictedGuard.ok) {
    handleLifecycleResult(restrictedGuard, () => undefined);
    return;
  }
  await withVerifiedBulkData(
    gateInputFor(cliEnv, opts),
    async (bulkDir) => {
      const esClient = createEsClient(cliEnv);
      await withEsClient(
        esClient,
        async () => {
          const { service, oakClient } = await buildIngestService(esClient, cliEnv);
          try {
            const result = await withLifecycleLease(esClient, cliEnv.SEARCH_INDEX_TARGET, () =>
              service.stage({ ...opts, bulkDir }),
            );
            handleLifecycleResult(result, (value) => {
              printSuccess(
                `Staged version ${value.version}. Promote with: admin promote --target-version ${value.version}`,
              );
              printJson(value);
            });
          } finally {
            await disconnectOakClient(oakClient);
          }
        },
        ingestDeps,
      );
    },
    gateDeps,
  );
}

export function registerVersionedIngestCmd(
  parent: Command,
  cliEnvLoader: SearchCliEnvLoader,
): void {
  parent
    .command('versioned-ingest')
    .description('Run a versioned blue/green ingest cycle (ADR-130)')
    .option(
      '--bulk-dir <path>',
      'Path to bulk download data directory (overrides BULK_DOWNLOAD_DIR)',
    )
    .option('--subject-filter <subjects...>', 'Ingest only specific subjects')
    .option('--min-doc-count <count>', 'Minimum docs per index', validateMinDocCount)
    .option('-v, --verbose', 'Enable verbose output')
    .option(
      '--include-restricted',
      'Retain restricted lessons instead of excluding them (default: exclude; rejected for index-producing runs until restricted lessons are labelled in results — ADR-224)',
    )
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: LifecycleIngestEnv, rawOpts: unknown) =>
        runVersionedIngestAction(cliEnv, parseLifecycleIngestOpts(rawOpts)),
      ),
    );
}

export function registerStageCmd(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  parent
    .command('stage')
    .description('Stage versioned indexes without promoting (create, ingest, verify)')
    .option(
      '--bulk-dir <path>',
      'Path to bulk download data directory (overrides BULK_DOWNLOAD_DIR)',
    )
    .option('--subject-filter <subjects...>', 'Ingest only specific subjects')
    .option('--min-doc-count <count>', 'Minimum docs per index', validateMinDocCount)
    .option('-v, --verbose', 'Enable verbose output')
    .option(
      '--include-restricted',
      'Retain restricted lessons instead of excluding them (default: exclude; rejected for index-producing runs until restricted lessons are labelled in results — ADR-224)',
    )
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: LifecycleIngestEnv, rawOpts: unknown) =>
        runStageAction(cliEnv, parseLifecycleIngestOpts(rawOpts)),
      ),
    );
}
