/**
 * Rollback and alias validation for blue/green index lifecycle (ADR-130).
 *
 * Extracted from the index lifecycle service to keep each file within
 * the max-lines limit. These functions handle rollback to a previous
 * version and alias health validation.
 *
 * @see {@link ./index-lifecycle-service.ts} for the ingest orchestrator
 * @see {@link ./lifecycle-swap-builders.ts} for pure swap-building helpers
 */

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import type { AdminError } from '../types/admin-types.js';
import type {
  AliasTargetMap,
  AliasValidationResult,
  IndexLifecycleDeps,
  RollbackResult,
} from '../types/index-lifecycle-types.js';
import { SEARCH_INDEX_KINDS, BASE_INDEX_NAMES, resolveAliasName } from '../internal/index.js';
import {
  buildVersionSwapActions,
  assessAliasHealth,
  validateRollbackMeta,
} from './lifecycle-swap-builders.js';

/** Roll back to the previous version recorded in index metadata. */
export async function rollback(
  deps: IndexLifecycleDeps,
): Promise<Result<RollbackResult, AdminError>> {
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
    return attemptRollbackReversal(deps, currentVersion, metaWriteResult.error.message);
  }
  deps.logger?.info('Rollback complete', { from: currentVersion, to: previousVersion });
  return ok({ rolledBackToVersion: previousVersion, rolledBackFromVersion: currentVersion });
}

/** Execute the alias swap portion of a rollback, verifying the target version exists first. */
async function executeRollbackSwap(
  deps: IndexLifecycleDeps,
  toVersion: string,
): Promise<Result<void, AdminError>> {
  const existsResult = await deps.verifyDocCounts(toVersion, 1);
  if (!existsResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `Cannot rollback to version ${toVersion}: ` +
        `indexes do not exist or are empty. ${existsResult.error.message}`,
    });
  }
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return aliasResult;
  }
  const validationError = validateAliasState(aliasResult.value);
  if (!validationError.ok) {
    return validationError;
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
export async function validateAliases(
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

/**
 * Validate that all aliases are in a consistent state for rollback.
 *
 * Each alias must exist (isAlias=true) and point to a physical index.
 * Bare indexes or null targets indicate corruption that prevents
 * a safe rollback — fail fast with a clear error.
 */
function validateAliasState(targets: AliasTargetMap): Result<void, AdminError> {
  for (const kind of SEARCH_INDEX_KINDS) {
    const info = targets[kind];
    if (!info.isAlias) {
      return err({
        type: 'validation_error',
        message:
          `Cannot rollback: '${kind}' is a bare index, not an alias. ` +
          `Run validate-aliases for details.`,
      });
    }
    if (info.targetIndex === null) {
      return err({
        type: 'validation_error',
        message:
          `Cannot rollback: alias for '${kind}' has no target index. ` +
          `Run validate-aliases for details.`,
      });
    }
  }
  return ok(undefined);
}

/**
 * Attempt to reverse the alias swap after a rollback metadata write failure.
 *
 * Symmetric with `attemptMetaFailureRollback` in `index-lifecycle-service.ts`.
 * If the reversal also fails, returns a CRITICAL error.
 */
async function attemptRollbackReversal(
  deps: IndexLifecycleDeps,
  currentVersion: string,
  metaErrorMessage: string,
): Promise<Result<RollbackResult, AdminError>> {
  deps.logger?.error('Rollback metadata write failed, reversing alias swap', { currentVersion });
  const aliasResult = await deps.resolveCurrentAliasTargets();
  if (!aliasResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Rollback metadata write failed and alias state cannot be read. ` +
        `Manual intervention required. Meta error: ${metaErrorMessage}`,
    });
  }
  const swaps = buildVersionSwapActions(aliasResult.value, currentVersion, deps.target);
  const reversalResult = await deps.atomicAliasSwap(swaps);
  if (!reversalResult.ok) {
    return err({
      type: 'validation_error',
      message:
        `CRITICAL: Rollback metadata write failed and alias reversal also failed. ` +
        `Manual intervention required. ` +
        `Meta error: ${metaErrorMessage}. Reversal error: ${reversalResult.error.message}`,
    });
  }
  return err({
    type: 'es_error',
    message:
      `Rollback metadata write failed. Aliases were reversed back to ${currentVersion}. ` +
      `Original error: ${metaErrorMessage}`,
  });
}
