/**
 * Promote orchestration for blue/green lifecycle (ADR-130).
 *
 * Coordinates verification, alias swap, metadata commit, and cleanup
 * for promoting a staged version to live. The atomic swap/commit/rollback
 * mechanism is in lifecycle-promote-swap.ts.
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type {
  AliasTargetMap,
  AliasLifecycleDeps,
  PromoteResult,
} from '../types/index-lifecycle-types.js';
import { cleanupOldGenerations } from './lifecycle-cleanup.js';
import { enforceMetadataAliasCoherence } from './lifecycle-meta-alias-coherence.js';
import { promoteSwapAndCommit } from './lifecycle-promote-swap.js';

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

/** Resolve and validate current alias targets for promote. */
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
  const cleanupResult = await cleanupOldGenerations(
    deps,
    previousVersion ? new Set([previousVersion]) : undefined,
  );
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
  deps.logger?.info('Starting search index promote', { version });
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
