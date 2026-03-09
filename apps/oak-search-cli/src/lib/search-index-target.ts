/**
 * CLI-specific index target helpers.
 *
 * Foundation types and constants are re-exported from the SDK
 * (single source of truth per ADR-030). This file adds CLI-only
 * concerns: config resolution, CLI flag coercion, and index
 * resolver factory.
 */

// ---------------------------------------------------------------------------
// Re-exports from SDK — single source of truth (ADR-030)
// ---------------------------------------------------------------------------

export {
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  BASE_INDEX_NAMES,
  resolveSearchIndexName,
  resolveZeroHitIndexName,
} from '@oaknational/oak-search-sdk';

export type {
  SearchIndexTarget,
  SearchIndexKind,
  IndexResolverFn,
} from '@oaknational/oak-search-sdk';

// ---------------------------------------------------------------------------
// CLI-only helpers
// ---------------------------------------------------------------------------

import { resolveSearchIndexName as resolveIndexName } from '@oaknational/oak-search-sdk';

import type {
  SearchIndexTarget as Target,
  SearchIndexKind as Kind,
  IndexResolverFn,
} from '@oaknational/oak-search-sdk';

/**
 * Create an index resolver function bound to a specific target.
 *
 * @param target - The index target to bind (`'primary'` or `'sandbox'`)
 * @returns A function that resolves index names for the bound target
 */
export function createIndexResolver(target: Target): IndexResolverFn {
  return (kind: Kind) => resolveIndexName(kind, target);
}

/** Resolve the canonical index name for the primary (production) target. */
export function resolvePrimarySearchIndexName(kind: Kind): string {
  return resolveIndexName(kind, 'primary');
}

/** Config shape for resolving search index target. */
export interface SearchIndexTargetConfig {
  readonly SEARCH_INDEX_TARGET?: Target;
}

/**
 * Return the configured search index target.
 *
 * Pass a target explicitly, or pass config with SEARCH_INDEX_TARGET.
 * Callers must provide one or the other — no env fallback.
 */
export function currentSearchIndexTarget(
  targetOrConfig?: Target | SearchIndexTargetConfig,
): Target {
  if (targetOrConfig === 'primary' || targetOrConfig === 'sandbox') {
    return targetOrConfig;
  }
  if (targetOrConfig && typeof targetOrConfig === 'object' && targetOrConfig.SEARCH_INDEX_TARGET) {
    return targetOrConfig.SEARCH_INDEX_TARGET;
  }
  return 'primary';
}

/** Resolve the index name for the given target or config. */
export function resolveCurrentSearchIndexName(
  kind: Kind,
  targetOrConfig?: Target | SearchIndexTargetConfig,
): string {
  return resolveIndexName(kind, currentSearchIndexTarget(targetOrConfig));
}

/**
 * Coerce an arbitrary string (e.g. CLI flag value) into a known search index target.
 * Returns `null` when the value is not recognised.
 */
export function coerceSearchIndexTarget(value: string | undefined): Target | null {
  if (!value) {
    return null;
  }
  return value === 'primary' || value === 'sandbox' ? value : null;
}
