/** CLI commands for lifecycle ingestion operations (ADR-130). */
import { existsSync, readdirSync } from 'node:fs';
import { InvalidArgumentError, type Command } from 'commander';
import type { Client } from '@elastic/elasticsearch';
import { sanitiseForJson } from '@oaknational/observability';
import {
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
  validateIngestEnv,
  printSuccess,
  printError,
  printJson,
  APP_ROOT,
  type CliSdkEnv,
  type SearchCliEnvLoader,
} from '../shared/index.js';
import { resolveBulkDirFromInputs } from '../shared/resolve-bulk-dir.js';
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
const realFs = { existsSync, readdirSync: (p: string) => readdirSync(p) };
interface IngestPreconditionResult {
  readonly ok: boolean;
  readonly bulkDir?: string;
}

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

function validateIngestPreconditions(
  cliEnv: LifecycleIngestEnv,
  opts: ParsedLifecycleIngestOpts,
): IngestPreconditionResult {
  const bulkResult = resolveBulkDirFromInputs({
    bulkDirFlag: opts.bulkDir,
    bulkDirFromEnv: cliEnv.BULK_DOWNLOAD_DIR,
    appRoot: APP_ROOT,
    fs: realFs,
  });
  if (!bulkResult.ok) {
    ingestLogger.error(bulkResult.error.message, {
      error: sanitiseForJson(bulkResult.error),
    });
    printError(bulkResult.error.message);
    process.exitCode = 1;
    return { ok: false };
  }
  const envResult = validateIngestEnv({ oakApiKey: cliEnv.OAK_API_KEY });
  if (!envResult.ok) {
    ingestLogger.error(envResult.error.message, {
      error: sanitiseForJson(envResult.error),
    });
    printError(envResult.error.message);
    process.exitCode = 1;
    return { ok: false };
  }
  return { ok: true, bulkDir: bulkResult.value };
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
  const preconditions = validateIngestPreconditions(cliEnv, opts);
  if (!preconditions.ok || !preconditions.bulkDir) {
    return;
  }
  const bulkDir = preconditions.bulkDir;
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
}

async function runStageAction(
  cliEnv: LifecycleIngestEnv,
  opts: ParsedLifecycleIngestOpts,
): Promise<void> {
  const preconditions = validateIngestPreconditions(cliEnv, opts);
  if (!preconditions.ok || !preconditions.bulkDir) {
    return;
  }
  const bulkDir = preconditions.bulkDir;
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
    .action(
      withLoadedCliEnv(cliEnvLoader, async (cliEnv: LifecycleIngestEnv, rawOpts: unknown) =>
        runStageAction(cliEnv, parseLifecycleIngestOpts(rawOpts)),
      ),
    );
}
