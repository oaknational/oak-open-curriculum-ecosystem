import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { AdminError, IngestResult } from '../types/admin-types.js';
import type {
  AliasTargetMap,
  AliasLifecycleDeps,
  AliasLifecycleService,
  IndexLifecycleDeps,
  IndexLifecycleService,
  StageResult,
  VersionedIngestOptions,
  VersionedIngestResult,
} from '../types/index-lifecycle-types.js';
import {
  buildSwapActions,
  buildRollbackSwaps,
  buildIngestMeta,
} from './lifecycle-swap-builders.js';
import { cleanupOldGenerations, cleanupOrphanedIndexes } from './lifecycle-cleanup.js';
import { rollback, validateAliases } from './lifecycle-rollback.js';
import { promote } from './lifecycle-promote.js';
import { enforceMetadataAliasCoherence } from './lifecycle-meta-alias-coherence.js';

const DEFAULT_MIN_DOC_COUNT = 1;

export function createIndexLifecycleService(deps: IndexLifecycleDeps): IndexLifecycleService {
  return {
    versionedIngest: (options) => versionedIngest(deps, options),
    stage: (options) => stage(deps, options),
    promote: (version) => promote(deps, version),
    rollback: () => rollback(deps),
    validateAliases: () => validateAliases(deps),
  };
}

export function createAliasLifecycleService(deps: AliasLifecycleDeps): AliasLifecycleService {
  return {
    promote: (version) => promote(deps, version),
    rollback: () => rollback(deps),
    validateAliases: () => validateAliases(deps),
  };
}
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
  const version = deps.generateVersion();
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
async function stage(
  deps: IndexLifecycleDeps,
  options: VersionedIngestOptions,
): Promise<Result<StageResult, AdminError>> {
  const metaResult = await deps.readIndexMeta();
  if (!metaResult.ok) {
    return metaResult;
  }
  const previousVersion = metaResult.value?.version ?? null;
  const version = deps.generateVersion();
  deps.logger?.info('Starting staged ingest', { version, previousVersion });

  const createResult = await deps.createVersionedIndexes(version);
  if (!createResult.ok) {
    return createResult;
  }

  const ingestResult = await runIngestAndVerify(deps, version, options);
  if (!ingestResult.ok) {
    await cleanupOrphanedIndexes(deps, version);
    return ingestResult;
  }

  deps.logger?.info('Stage complete — indexes ready for promotion', { version });
  return ok({
    version,
    ingestResult: ingestResult.value,
    previousVersion,
  });
}
async function swapAndCommit(
  deps: IndexLifecycleDeps,
  version: string,
  previousVersion: string | null,
  subjectFilter: readonly string[] | undefined,
  startTime: number,
): Promise<Result<void, AdminError>> {
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }
  const coherenceResult = enforceMetadataAliasCoherence(
    previousVersion,
    aliasResult.value,
    'versioned-ingest',
  );
  if (!coherenceResult.ok) {
    return coherenceResult;
  }

  const swaps = buildSwapActions(aliasResult.value, version, deps.target);
  const swapResult = await deps.atomicAliasSwap(swaps);
  if (!swapResult.ok) {
    return swapResult;
  }

  const durationMs = Date.now() - startTime;
  const newMeta = buildIngestMeta(version, previousVersion, subjectFilter, durationMs);
  const writeResult = await deps.writeIndexMeta(newMeta);
  if (!writeResult.ok) {
    const rollbackResult = await attemptMetaFailureRollback(
      deps,
      aliasResult.value,
      version,
      writeResult.error.message,
    );
    if (!rollbackResult.ok) {
      return rollbackResult;
    }
    return writeResult;
  }
  return ok(undefined);
}
async function attemptMetaFailureRollback(
  deps: IndexLifecycleDeps,
  originalTargets: AliasTargetMap,
  version: string,
  metaErrorMessage: string,
): Promise<Result<void, AdminError>> {
  deps.logger?.error('Metadata write failed, rolling back aliases', { version });
  const swapsResult = buildRollbackSwaps(originalTargets, version, deps.target);
  if (!swapsResult.ok) {
    deps.logger?.error('Cannot build rollback swaps', { error: swapsResult.error.message });
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Metadata write failed and rollback swaps cannot be built. ` +
        `Aliases are pointing to version ${version}. Manual intervention required. ` +
        `Meta error: ${metaErrorMessage}. Build error: ${swapsResult.error.message}`,
    });
  }
  const rollbackSwapResult = await deps.atomicAliasSwap(swapsResult.value);
  if (!rollbackSwapResult.ok) {
    deps.logger?.error('Metadata write failed and rollback swap also failed', {
      version,
      metaError: metaErrorMessage,
      rollbackError: rollbackSwapResult.error.message,
    });
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Metadata write failed and alias rollback also failed. ` +
        `Aliases are pointing to version ${version}. Manual intervention required. ` +
        `Meta error: ${metaErrorMessage}. Rollback error: ${rollbackSwapResult.error.message}`,
    });
  }
  return ok(undefined);
}
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

  const committed = await swapAndCommit(
    deps,
    version,
    previousVersion,
    options.subjectFilter,
    startTime,
  );
  if (!committed.ok) {
    return committed;
  }

  const cleanupResult = await cleanupOldGenerations(deps);
  if (cleanupResult.failed > 0) {
    deps.logger?.warn('Some old indexes failed to delete during cleanup', {
      deleted: cleanupResult.deleted,
      failed: cleanupResult.failed,
    });
  }
  deps.logger?.info('Versioned ingest complete', {
    version,
    previousVersion,
    indexesCleanedUp: cleanupResult.deleted,
  });
  return ok({
    version,
    ingestResult,
    previousVersion,
    indexesCleanedUp: cleanupResult.deleted,
    cleanupFailures: cleanupResult.failed,
  });
}
