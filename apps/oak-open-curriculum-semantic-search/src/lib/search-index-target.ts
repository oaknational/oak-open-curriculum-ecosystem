import { optionalEnv } from './env';
import type { BulkOperations } from './indexing/bulk-operation-types';

export const SEARCH_INDEX_TARGETS = ['primary', 'sandbox'] as const;
export type SearchIndexTarget = (typeof SEARCH_INDEX_TARGETS)[number];

export const ZERO_HIT_INDEX_BASE = 'oak_zero_hit_events';

export const SEARCH_INDEX_KINDS = [
  'lessons',
  'unit_rollup',
  'units',
  'sequences',
  'sequence_facets',
  'threads',
] as const;
export type SearchIndexKind = (typeof SEARCH_INDEX_KINDS)[number];

const BASE_INDEX_NAMES: Record<SearchIndexKind, string> = {
  lessons: 'oak_lessons',
  unit_rollup: 'oak_unit_rollup',
  units: 'oak_units',
  sequences: 'oak_sequences',
  sequence_facets: 'oak_sequence_facets',
  threads: 'oak_threads',
};

const BASE_INDEX_TO_KIND = new Map<string, SearchIndexKind>([
  ['oak_lessons', 'lessons'],
  ['oak_unit_rollup', 'unit_rollup'],
  ['oak_units', 'units'],
  ['oak_sequences', 'sequences'],
  ['oak_sequence_facets', 'sequence_facets'],
  ['oak_threads', 'threads'],
]);

/** Resolve the Elasticsearch index name for the supplied kind/target pair. */
export function resolveSearchIndexName(kind: SearchIndexKind, target: SearchIndexTarget): string {
  const baseName = BASE_INDEX_NAMES[kind];
  if (!baseName) {
    throw new Error(`Unknown search index kind: ${kind}`);
  }
  return target === 'primary' ? baseName : `${baseName}_sandbox`;
}

/** Resolve the canonical index name for the primary (production) target. */
export function resolvePrimarySearchIndexName(kind: SearchIndexKind): string {
  return resolveSearchIndexName(kind, 'primary');
}

/** Return the configured search index target from the current environment. */
export function currentSearchIndexTarget(): SearchIndexTarget {
  return optionalEnv()?.SEARCH_INDEX_TARGET ?? 'primary';
}

/** Resolve the index name for the current environment configuration. */
export function resolveCurrentSearchIndexName(kind: SearchIndexKind): string {
  return resolveSearchIndexName(kind, currentSearchIndexTarget());
}

/** Resolve the zero-hit telemetry index name for the given target. */
export function resolveZeroHitIndexName(target: SearchIndexTarget): string {
  return target === 'primary' ? ZERO_HIT_INDEX_BASE : `${ZERO_HIT_INDEX_BASE}_sandbox`;
}

/**
 * Coerce an arbitrary string (e.g. CLI flag value) into a known search index target.
 * Returns `null` when the value is not recognised.
 */
export function coerceSearchIndexTarget(value: string | undefined): SearchIndexTarget | null {
  if (!value) {
    return null;
  }
  return value === 'primary' || value === 'sandbox' ? value : null;
}

/** Rewrite bulk operations so `_index` entries align with the selected target. */
export function rewriteBulkOperations(
  operations: BulkOperations,
  target: SearchIndexTarget,
): BulkOperations {
  if (target === 'primary') {
    // Primary target already matches canonical index names; return original operations.
    return [...operations];
  }

  return operations.map((entry) => {
    if (!isIndexAction(entry)) {
      return entry;
    }
    const currentIndex = entry.index._index;
    const kind = BASE_INDEX_TO_KIND.get(currentIndex);
    if (!kind) {
      return entry;
    }
    const nextIndex = resolveSearchIndexName(kind, target);
    if (nextIndex === currentIndex) {
      return entry;
    }
    const nextAction: IndexAction = {
      index: {
        ...entry.index,
        _index: nextIndex,
      },
    };
    return nextAction;
  });
}

/**
 * Shape of an ES bulk index action's metadata.
 * Used only for bulk operation rewriting - not a general-purpose type.
 */
interface IndexMetadata {
  readonly _index: string;
}

/**
 * Shape of an ES bulk index action used in bulk operations.
 * Used only for bulk operation rewriting - not a general-purpose type.
 */
interface IndexAction {
  readonly index: IndexMetadata;
}

/**
 * Type guard to check if a value is a bulk index action.
 * Narrows directly to IndexAction without intermediate generic types.
 */
function isIndexAction(value: unknown): value is IndexAction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('index' in value)) {
    return false;
  }
  const indexProp = value.index;
  if (typeof indexProp !== 'object' || indexProp === null) {
    return false;
  }
  if (!('_index' in indexProp)) {
    return false;
  }
  return typeof indexProp._index === 'string' && indexProp._index.length > 0;
}
