/**
 * Ingest swap-commit-rollback cycle (ADR-130).
 *
 * Handles the alias swap, metadata commit, and rollback-on-failure
 * logic for the versioned ingest operation. Extracted from
 * index-lifecycle-service.ts to separate orchestration from the
 * swap/commit/rollback mechanism.
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type { AliasTargetMap, IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import {
  buildSwapActions,
  buildRollbackSwaps,
  buildIngestMeta,
} from './lifecycle-swap-builders.js';
import { enforceMetadataAliasCoherence } from './lifecycle-meta-alias-coherence.js';

/**
 * Swap aliases to the new version, validate coherence, and write metadata.
 *
 * Rolls back aliases on metadata write failure.
 */
export async function swapAndCommit(
  deps: IndexLifecycleDeps,
  version: string,
  previousVersion: string | null,
  subjectFilter: readonly string[] | undefined,
  startTime: number,
): Promise<Result<void, AdminError>> {
  deps.logger?.info('Starting ingest alias swap and metadata commit', {
    version,
    previousVersion,
  });
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

/** Attempt to roll back aliases after a metadata write failure during ingest. */
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
