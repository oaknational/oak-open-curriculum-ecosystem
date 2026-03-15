import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type {
  AliasTargetMap,
  AliasLifecycleDeps,
  PromoteResult,
} from '../types/index-lifecycle-types.js';
import type { SearchIndexKind, SearchIndexTarget } from '../internal/index.js';
import {
  SEARCH_INDEX_KINDS,
  BASE_INDEX_NAMES,
  resolveVersionedIndexName,
} from '../internal/index.js';
import {
  buildSwapActions,
  buildRollbackSwaps,
  buildPromoteMeta,
} from './lifecycle-swap-builders.js';
import { cleanupOldGenerations } from './lifecycle-cleanup.js';
import { enforceMetadataAliasCoherence } from './lifecycle-meta-alias-coherence.js';
const PROMOTE_MIN_DOC_COUNT = 1;

/** Verify staged indexes exist and resolve the previous version from metadata. */
async function verifyAndResolvePrevious(
  deps: AliasLifecycleDeps,
  version: string,
): Promise<Result<{ previousVersion: string | null; targets: AliasTargetMap }, AdminError>> {
  const existsResult = await deps.verifyDocCounts(version, PROMOTE_MIN_DOC_COUNT);
  if (!existsResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `Cannot promote version ${version}: ` +
        `indexes do not exist or are empty. ${existsResult.error.message}`,
    });
  }

  const metaResult = await deps.readIndexMeta();
  if (!metaResult.ok) {
    return metaResult;
  }
  const previousVersion = metaResult.value?.version ?? null;
  const targetsResult = await resolvePromoteTargets(deps, previousVersion);
  if (!targetsResult.ok) {
    return targetsResult;
  }
  return ok({ previousVersion, targets: targetsResult.value });
}

async function resolvePromoteTargets(
  deps: AliasLifecycleDeps,
  previousVersion: string | null,
): Promise<Result<AliasTargetMap, AdminError>> {
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }
  const coherenceResult = enforceMetadataAliasCoherence(
    previousVersion,
    aliasResult.value,
    'promote',
  );
  if (!coherenceResult.ok) {
    return coherenceResult;
  }
  return ok(aliasResult.value);
}

/** Run cleanup and log the outcome. */
async function cleanupAndLog(
  deps: AliasLifecycleDeps,
  version: string,
  previousVersion: string | null,
): Promise<{ deleted: number; failed: number }> {
  const cleanupResult = await cleanupOldGenerations(deps);
  if (cleanupResult.failed > 0) {
    deps.logger?.warn('Some old indexes failed to delete during cleanup', {
      deleted: cleanupResult.deleted,
      failed: cleanupResult.failed,
    });
  }
  deps.logger?.info('Promote complete', {
    version,
    previousVersion,
    indexesCleanedUp: cleanupResult.deleted,
  });
  return cleanupResult;
}

/** Promote a staged version: verify existence, swap aliases, write metadata, cleanup. */
export async function promote(
  deps: AliasLifecycleDeps,
  version: string,
): Promise<Result<PromoteResult, AdminError>> {
  const verified = await verifyAndResolvePrevious(deps, version);
  if (!verified.ok) {
    return verified;
  }
  const { previousVersion, targets } = verified.value;

  const swapResult = await promoteSwapAndCommit(deps, targets, version, previousVersion);
  if (!swapResult.ok) {
    return swapResult;
  }

  const cleanupResult = await cleanupAndLog(deps, version, previousVersion);
  return ok({
    version,
    previousVersion,
    indexesCleanedUp: cleanupResult.deleted,
    cleanupFailures: cleanupResult.failed,
  });
}

async function validatePostSwapAliases(
  deps: AliasLifecycleDeps,
  version: string,
): Promise<Result<void, AdminError>> {
  const postSwapResult = await deps.resolveCurrentAliasTargets();
  if (!postSwapResult.ok) {
    return err({
      type: 'es_error',
      message:
        `Post-swap alias validation failed: could not resolve alias targets. ` +
        postSwapResult.error.message,
    });
  }
  const mismatches = collectAliasMismatches(postSwapResult.value, version, deps.target);
  if (mismatches.length > 0) {
    const details = mismatches.map(
      (m) => `  ${m.kind}: expected=${m.expected}, actual=${m.actual}`,
    );
    return err({
      type: 'validation_error',
      message:
        `Post-swap alias validation failed: ${mismatches.length} of 6 aliases ` +
        `do not point to the expected versioned index for version ${version}.\n` +
        details.join('\n'),
    });
  }
  return ok(undefined);
}

/** Collect mismatches between actual alias targets and expected versioned index names. */
function collectAliasMismatches(
  actualTargets: AliasTargetMap,
  version: string,
  target: SearchIndexTarget,
): readonly { kind: SearchIndexKind; expected: string; actual: string }[] {
  const mismatches: { kind: SearchIndexKind; expected: string; actual: string }[] = [];
  for (const kind of SEARCH_INDEX_KINDS) {
    const expected = resolveVersionedIndexName(BASE_INDEX_NAMES[kind], target, version);
    const info = actualTargets[kind];
    const actual = info.isAlias ? info.targetIndex : '<not an alias>';
    if (actual !== expected) {
      mismatches.push({ kind, expected, actual });
    }
  }
  return mismatches;
}

/** Swap aliases, validate, and write metadata. Rolls back on metadata write failure. */
async function promoteSwapAndCommit(
  deps: AliasLifecycleDeps,
  currentTargets: AliasTargetMap,
  version: string,
  previousVersion: string | null,
): Promise<Result<void, AdminError>> {
  const swaps = buildSwapActions(currentTargets, version, deps.target);
  const swapResult = await deps.atomicAliasSwap(swaps);
  if (!swapResult.ok) {
    return swapResult;
  }

  const validationResult = await validatePostSwapAliases(deps, version);
  if (!validationResult.ok) {
    const rollbackResult = await attemptPromoteRollback(
      deps,
      currentTargets,
      version,
      validationResult.error.message,
      'post-swap alias validation',
    );
    if (!rollbackResult.ok) {
      return rollbackResult;
    }
    return validationResult;
  }

  const newMeta = buildPromoteMeta(version, previousVersion);
  const writeResult = await deps.writeIndexMeta(newMeta);
  if (!writeResult.ok) {
    const rollbackResult = await attemptPromoteRollback(
      deps,
      currentTargets,
      version,
      writeResult.error.message,
      'metadata write',
    );
    if (!rollbackResult.ok) {
      return rollbackResult;
    }
    return err({
      type: 'es_error',
      message: `Promote metadata write failed. Aliases rolled back. Original error: ${writeResult.error.message}`,
    });
  }
  return ok(undefined);
}

/**
 * Attempt to roll back aliases after a promote metadata write failure.
 *
 * Returns the original write error if rollback succeeds,
 * or a CRITICAL compound error if rollback also fails.
 */
async function attemptPromoteRollback(
  deps: AliasLifecycleDeps,
  originalTargets: AliasTargetMap,
  version: string,
  failureMessage: string,
  failurePhase: 'metadata write' | 'post-swap alias validation',
): Promise<Result<void, AdminError>> {
  deps.logger?.error('Promote phase failed, rolling back aliases', {
    version,
    failurePhase,
  });
  const swapsResult = buildRollbackSwaps(originalTargets, version, deps.target);
  if (!swapsResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Promote ${failurePhase} failed and rollback swaps cannot be built. ` +
        `Aliases are pointing to version ${version}. Manual intervention required. ` +
        `Failure: ${failureMessage}. Build error: ${swapsResult.error.message}`,
    });
  }
  const rollbackSwapResult = await deps.atomicAliasSwap(swapsResult.value);
  if (!rollbackSwapResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Promote ${failurePhase} failed and alias rollback also failed. ` +
        `Aliases are pointing to version ${version}. Manual intervention required. ` +
        `Failure: ${failureMessage}. Rollback error: ${rollbackSwapResult.error.message}`,
    });
  }
  return ok(undefined);
}
