/**
 * Promote swap-commit-rollback cycle (ADR-130).
 *
 * Handles the atomic alias swap, post-swap validation, metadata commit,
 * and rollback-on-failure logic for the promote operation. Extracted
 * from lifecycle-promote.ts to separate orchestration from the
 * swap/commit/rollback mechanism.
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { AdminError } from '../types/admin-types.js';
import type { AliasTargetMap, AliasLifecycleDeps } from '../types/index-lifecycle-types.js';
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

/** Validate that all aliases point to the expected versioned indexes after a swap. */
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

/**
 * Swap aliases, validate, and write metadata. Rolls back on failure.
 *
 * @param deps - Alias lifecycle deps for swap and metadata operations
 * @param currentTargets - Current alias targets (used for rollback)
 * @param version - Version being promoted
 * @param previousVersion - Previous version from metadata (written to new meta)
 * @returns `ok` on success, or `err` with rollback details on failure
 */
export async function promoteSwapAndCommit(
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
