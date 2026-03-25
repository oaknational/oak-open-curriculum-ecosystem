import type { Result } from '@oaknational/result';
import { ok } from '@oaknational/result';
import type { AdminError, IngestResult } from '../types/admin-types.js';
import type {
  AliasLifecycleDeps,
  AliasLifecycleService,
  IndexLifecycleDeps,
  IndexLifecycleService,
  StageResult,
  VersionedIngestOptions,
  VersionedIngestResult,
} from '../types/index-lifecycle-types.js';
import { cleanupOldGenerations, cleanupOrphanedIndexes } from './lifecycle-cleanup.js';
import { resolveOrphanedVersions } from './lifecycle-orphan-detection.js';
import { swapAndCommit } from './lifecycle-ingest-swap.js';
import { rollback, validateAliases } from './lifecycle-rollback.js';
import { promote } from './lifecycle-promote.js';

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
  await warnIfOrphansExist(deps);
  deps.logger?.info('Starting staged ingest', { version, previousVersion });

  return stageCreateAndIngest(deps, version, previousVersion, options);
}
async function stageCreateAndIngest(
  deps: IndexLifecycleDeps,
  version: string,
  previousVersion: string | null,
  options: VersionedIngestOptions,
): Promise<Result<StageResult, AdminError>> {
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
  return ok({ version, ingestResult: ingestResult.value, previousVersion });
}
/** Warn if orphaned versions exist before starting a new stage. */
async function warnIfOrphansExist(deps: IndexLifecycleDeps): Promise<void> {
  const result = await resolveOrphanedVersions(deps);
  if (!result.ok || result.orphans.length === 0) {
    return;
  }
  const orphanVersions = result.orphans.map((o) => o.version);
  deps.logger?.warn('Orphaned versions detected — consider running cleanup-orphans', {
    orphanCount: orphanVersions.length,
    orphanVersions,
  });
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

  const protectedVersions = previousVersion ? new Set([previousVersion]) : undefined;
  const cleanupResult = await cleanupOldGenerations(deps, protectedVersions);
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
