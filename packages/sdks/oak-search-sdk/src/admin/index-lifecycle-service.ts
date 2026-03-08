/**
 * Index lifecycle service for blue/green index management (ADR-130).
 *
 * Orchestrates versioned index creation, alias swapping, rollback,
 * and alias validation. All IO operations are injected via
 * `IndexLifecycleDeps` for testability (ADR-078).
 *
 * @see {@link ./lifecycle-swap-builders.ts} for pure swap-building helpers
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { AdminError, IngestResult } from '../types/admin-types.js';
import type {
  AliasTargetMap,
  IndexLifecycleDeps,
  IndexLifecycleService,
  VersionedIngestOptions,
  VersionedIngestResult,
  RollbackResult,
  AliasValidationResult,
} from '../types/index-lifecycle-types.js';
import { SEARCH_INDEX_KINDS, BASE_INDEX_NAMES, resolveAliasName } from '../internal/index.js';
import {
  buildSwapActions,
  buildRollbackSwaps,
  buildVersionSwapActions,
  assessAliasHealth,
  buildIngestMeta,
  validateRollbackMeta,
} from './lifecycle-swap-builders.js';
import { cleanupOldGenerations } from './lifecycle-cleanup.js';

const DEFAULT_MIN_DOC_COUNT = 1;

/** Create an index lifecycle service with injected dependencies. */
export function createIndexLifecycleService(deps: IndexLifecycleDeps): IndexLifecycleService {
  return {
    versionedIngest: (options) => versionedIngest(deps, options),
    rollback: () => rollback(deps),
    validateAliases: () => validateAliases(deps),
  };
}

/** Prepare phase: read metadata, create indexes, ingest, verify. */
async function prepareVersionedIndexes(
  deps: IndexLifecycleDeps,
  options: VersionedIngestOptions,
): Promise<
  Result<
    { version: string; previousVersion: string | null; ingestResult: IngestResult },
    AdminError
  >
> {
  const metaResult = await deps.readIndexMeta();
  if (!metaResult.ok) {
    return metaResult;
  }
  const previousVersion = metaResult.value?.version ?? null;
  const version = options.version ?? deps.generateVersion();
  deps.logger?.info('Starting versioned ingest', { version, previousVersion });

  const createResult = await deps.createVersionedIndexes(version);
  if (!createResult.ok) {
    return createResult;
  }

  const ingestResult = await runIngestAndVerify(deps, version, options);
  if (!ingestResult.ok) {
    return ingestResult;
  }
  return ok({ version, previousVersion, ingestResult: ingestResult.value });
}

/** Run bulk ingest and verify doc counts meet threshold. */
async function runIngestAndVerify(
  deps: IndexLifecycleDeps,
  version: string,
  options: VersionedIngestOptions,
): Promise<Result<IngestResult, AdminError>> {
  const ingestResult = await deps.runVersionedIngest(version, {
    bulkDir: options.bulkDir,
    subjectFilter: options.subjectFilter,
    verbose: options.verbose,
  });
  if (!ingestResult.ok) {
    return ingestResult;
  }
  const minDocCount = options.minDocCount ?? DEFAULT_MIN_DOC_COUNT;
  const verifyResult = await deps.verifyDocCounts(version, minDocCount);
  if (!verifyResult.ok) {
    return verifyResult;
  }
  return ok(ingestResult.value);
}

/** Swap phase: resolve aliases, swap, write metadata. Rolls back on metadata failure. */
async function swapAndCommit(
  deps: IndexLifecycleDeps,
  version: string,
  previousVersion: string | null,
  subjectFilter: readonly string[] | undefined,
  durationMs: number,
): Promise<Result<void, AdminError>> {
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }

  const swaps = buildSwapActions(aliasResult.value, version, deps.target);
  const swapResult = await deps.atomicAliasSwap(swaps);
  if (!swapResult.ok) {
    return swapResult;
  }

  const newMeta = buildIngestMeta(version, previousVersion, subjectFilter, durationMs);
  const writeResult = await deps.writeIndexMeta(newMeta);
  if (!writeResult.ok) {
    await attemptMetaFailureRollback(deps, aliasResult.value, version, writeResult.error.message);
    return writeResult;
  }
  return ok(undefined);
}

/** Attempt to roll back aliases after a metadata write failure. Logs on compound failure. */
async function attemptMetaFailureRollback(
  deps: IndexLifecycleDeps,
  originalTargets: AliasTargetMap,
  version: string,
  metaErrorMessage: string,
): Promise<void> {
  deps.logger?.error('Metadata write failed, rolling back aliases', { version });
  const swapsResult = buildRollbackSwaps(originalTargets, version, deps.target);
  if (!swapsResult.ok) {
    deps.logger?.error('Cannot build rollback swaps', { error: swapsResult.error.message });
    return;
  }
  const rollbackResult = await deps.atomicAliasSwap(swapsResult.value);
  if (!rollbackResult.ok) {
    deps.logger?.error('Metadata write failed and rollback swap also failed', {
      version,
      metaError: metaErrorMessage,
      rollbackError: rollbackResult.error.message,
    });
  }
}

/** Full versioned ingest: prepare, swap, cleanup. */
async function versionedIngest(
  deps: IndexLifecycleDeps,
  options: VersionedIngestOptions,
): Promise<Result<VersionedIngestResult, AdminError>> {
  const startTime = Date.now();
  const prepared = await prepareVersionedIndexes(deps, options);
  if (!prepared.ok) {
    return prepared;
  }
  const { version, previousVersion, ingestResult } = prepared.value;
  const durationMs = Date.now() - startTime;

  const committed = await swapAndCommit(
    deps,
    version,
    previousVersion,
    options.subjectFilter,
    durationMs,
  );
  if (!committed.ok) {
    return committed;
  }

  const indexesCleanedUp = await cleanupOldGenerations(deps);
  deps.logger?.info('Versioned ingest complete', { version, previousVersion, indexesCleanedUp });
  return ok({ version, ingestResult, previousVersion, indexesCleanedUp });
}

/** Roll back to the previous version recorded in index metadata. */
async function rollback(deps: IndexLifecycleDeps): Promise<Result<RollbackResult, AdminError>> {
  const metaResult = await deps.readIndexMeta();
  if (!metaResult.ok) {
    return metaResult;
  }
  const meta = metaResult.value;
  if (meta === null) {
    return err({ type: 'not_found', message: 'No index metadata found; rollback not available' });
  }

  const validatedMeta = validateRollbackMeta(meta);
  if (!validatedMeta.ok) {
    return validatedMeta;
  }
  const { currentVersion, previousVersion } = validatedMeta.value;
  deps.logger?.info('Starting rollback', { from: currentVersion, to: previousVersion });

  const swapResult = await executeRollbackSwap(deps, previousVersion);
  if (!swapResult.ok) {
    return swapResult;
  }

  const metaWriteResult = await writeRollbackMeta(deps, meta, currentVersion, previousVersion);
  if (!metaWriteResult.ok) {
    return metaWriteResult;
  }
  deps.logger?.info('Rollback complete', { from: currentVersion, to: previousVersion });
  return ok({ rolledBackToVersion: previousVersion, rolledBackFromVersion: currentVersion });
}

/** Execute the alias swap portion of a rollback. */
async function executeRollbackSwap(
  deps: IndexLifecycleDeps,
  toVersion: string,
): Promise<Result<void, AdminError>> {
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }
  const swaps = buildVersionSwapActions(aliasResult.value, toVersion, deps.target);
  return deps.atomicAliasSwap(swaps);
}

/** Write updated metadata after a successful rollback. */
async function writeRollbackMeta(
  deps: IndexLifecycleDeps,
  originalMeta: IndexMetaDoc,
  currentVersion: string,
  previousVersion: string,
): Promise<Result<void, AdminError>> {
  return deps.writeIndexMeta({
    ...originalMeta,
    version: previousVersion,
    ingested_at: new Date().toISOString(),
    previous_version: currentVersion,
  });
}

/** Check health of all curriculum aliases. */
async function validateAliases(
  deps: IndexLifecycleDeps,
): Promise<Result<AliasValidationResult, AdminError>> {
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }
  const entries = SEARCH_INDEX_KINDS.map((kind) => {
    const alias = resolveAliasName(BASE_INDEX_NAMES[kind], deps.target);
    return assessAliasHealth(alias, aliasResult.value[kind]);
  });
  return ok({ allHealthy: entries.every((e) => e.healthy), entries });
}
