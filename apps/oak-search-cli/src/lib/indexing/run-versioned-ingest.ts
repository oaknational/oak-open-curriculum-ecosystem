/**
 * CLI-layer closure bridging the bulk ingestion pipeline to the
 * SDK lifecycle service's `runVersionedIngest` dependency.
 *
 * Replaces the broken SDK-internal `ingest.ts` with the proven
 * CLI pipeline (Phase 2 of the unified versioned ingestion plan).
 *
 * @see ADR-130 Blue/Green Index Lifecycle
 * @see ADR-093 Bulk-First Ingestion Strategy
 */

import { ok, err, type Result } from '@oaknational/result';
import type { Logger } from '@oaknational/logger';
import { createVersionedIndexResolver } from '@oaknational/oak-search-sdk';
import type {
  IngestOptions,
  IngestResult,
  AdminError,
  SearchIndexTarget,
} from '@oaknational/oak-search-sdk';
import type { OakClient } from '../../adapters/oak-adapter';
import type { EsTransport, BulkUploadResult } from './ingest-harness-ops';
import {
  prepareBulkIngestion as defaultPrepareBulkIngestion,
  type BulkIngestionResult,
  type BulkIngestionStats,
  type BulkIngestionOptions,
} from './bulk-ingestion';
import { dispatchBulk as defaultDispatchBulk } from './ingest-harness-ops';
import type { BulkOperations } from './bulk-operation-types';

/** Callable type for preparing bulk ingestion. */
type PrepareBulkIngestionFn = (options: BulkIngestionOptions) => Promise<BulkIngestionResult>;

/** Callable type for dispatching bulk operations. */
type DispatchBulkFn = (
  es: EsTransport,
  operations: BulkOperations,
  logger?: Logger,
) => Promise<BulkUploadResult>;

/**
 * Dependencies for creating the versioned ingest closure.
 *
 * @param oakClient - Oak Curriculum API client for data acquisition
 * @param esTransport - Elasticsearch transport for bulk upload
 * @param target - Index alias target (`'primary'` or `'sandbox'`)
 * @param logger - Optional structured logger
 * @param prepareBulkIngestion - Override for testing
 * @param dispatchBulk - Override for testing
 */
export interface RunVersionedIngestDeps {
  readonly oakClient: OakClient;
  readonly esTransport: EsTransport;
  readonly target: SearchIndexTarget;
  readonly logger?: Logger;
  readonly prepareBulkIngestion?: PrepareBulkIngestionFn;
  readonly dispatchBulk?: DispatchBulkFn;
}

/**
 * Convert {@link BulkIngestionStats} to {@link IngestResult}.
 *
 * Drops `vocabularyStats` which is a CLI-only concern.
 */
function toIngestResult(stats: BulkIngestionStats): IngestResult {
  return {
    filesProcessed: stats.filesProcessed,
    lessonsIndexed: stats.lessonsIndexed,
    unitsIndexed: stats.unitsIndexed,
    rollupsIndexed: stats.rollupsIndexed,
    threadsIndexed: stats.threadsIndexed,
    sequencesIndexed: stats.sequencesIndexed,
    sequenceFacetsIndexed: stats.sequenceFacetsIndexed,
  };
}

/** Extract error message from an unknown thrown value. */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Prepare bulk operations, returning a data_source_error on failure. */
async function prepareOperations(
  prepare: PrepareBulkIngestionFn,
  options: BulkIngestionOptions,
): Promise<Result<BulkIngestionResult, AdminError>> {
  try {
    return ok(await prepare(options));
  } catch (error: unknown) {
    return err({
      type: 'data_source_error',
      message: `Bulk ingestion preparation failed: ${errorMessage(error)}`,
    });
  }
}

/** Dispatch operations to Elasticsearch, returning an es_error on failure. */
async function dispatchOperations(
  dispatch: DispatchBulkFn,
  esTransport: EsTransport,
  operations: BulkOperations,
  logger: Logger | undefined,
): Promise<Result<void, AdminError>> {
  try {
    await dispatch(esTransport, operations, logger);
    return ok(undefined);
  } catch (error: unknown) {
    return err({
      type: 'es_error',
      message: `Versioned ingest dispatch failed: ${errorMessage(error)}`,
    });
  }
}

/** Resolved dependencies ready for execution. */
interface ResolvedDeps {
  readonly oakClient: OakClient;
  readonly esTransport: EsTransport;
  readonly target: SearchIndexTarget;
  readonly logger: Logger | undefined;
  readonly prepare: PrepareBulkIngestionFn;
  readonly dispatch: DispatchBulkFn;
}

/** Execute a single versioned ingest run. */
async function executeVersionedIngest(
  deps: ResolvedDeps,
  version: string,
  options: IngestOptions,
): Promise<Result<IngestResult, AdminError>> {
  const { oakClient, esTransport, target, logger, prepare, dispatch } = deps;
  logger?.info('Versioned ingest: starting', { version, target, bulkDir: options.bulkDir });

  if (options.dryRun) {
    return err({
      type: 'validation_error',
      message:
        'dryRun is not supported for versioned ingest — ' +
        'versioned indexes must be fully populated before promotion',
    });
  }

  const resolver = createVersionedIndexResolver(version, target);
  const prepareResult = await prepareOperations(prepare, {
    bulkDir: options.bulkDir,
    client: oakClient,
    subjectFilter: options.subjectFilter,
    indexes: [],
    resolveIndex: resolver,
  });
  if (!prepareResult.ok) {
    return prepareResult;
  }

  const prepared = prepareResult.value;
  logger?.info('Versioned ingest: preparation complete', {
    version,
    documents: Math.floor(prepared.operations.length / 2),
    ...prepared.stats,
  });

  const dispatchResult = await dispatchOperations(
    dispatch,
    esTransport,
    prepared.operations,
    logger,
  );
  if (!dispatchResult.ok) {
    return dispatchResult;
  }

  const ingestResult = toIngestResult(prepared.stats);
  logger?.info('Versioned ingest: complete', { version, ...ingestResult });
  return ok(ingestResult);
}

/**
 * Create a closure matching `IndexLifecycleDeps.runVersionedIngest`.
 *
 * @param deps - Injected dependencies (Oak client, ES transport, target)
 * @returns Async function compatible with `IndexLifecycleDeps.runVersionedIngest`
 */
export function createRunVersionedIngest(
  deps: RunVersionedIngestDeps,
): (version: string, options: IngestOptions) => Promise<Result<IngestResult, AdminError>> {
  const resolved: ResolvedDeps = {
    oakClient: deps.oakClient,
    esTransport: deps.esTransport,
    target: deps.target,
    logger: deps.logger,
    prepare: deps.prepareBulkIngestion ?? defaultPrepareBulkIngestion,
    dispatch: deps.dispatchBulk ?? defaultDispatchBulk,
  };
  return (version, options) => executeVersionedIngest(resolved, version, options);
}
