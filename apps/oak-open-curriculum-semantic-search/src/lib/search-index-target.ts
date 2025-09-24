import { env } from './env';

export const SEARCH_INDEX_TARGETS = ['primary', 'sandbox'] as const;
export type SearchIndexTarget = (typeof SEARCH_INDEX_TARGETS)[number];

export const SEARCH_INDEX_KINDS = [
  'lessons',
  'unit_rollup',
  'units',
  'sequences',
  'sequence_facets',
] as const;
export type SearchIndexKind = (typeof SEARCH_INDEX_KINDS)[number];

const BASE_INDEX_NAMES: Record<SearchIndexKind, string> = {
  lessons: 'oak_lessons',
  unit_rollup: 'oak_unit_rollup',
  units: 'oak_units',
  sequences: 'oak_sequences',
  sequence_facets: 'oak_sequence_facets',
};

const BASE_INDEX_TO_KIND = new Map<string, SearchIndexKind>([
  ['oak_lessons', 'lessons'],
  ['oak_unit_rollup', 'unit_rollup'],
  ['oak_units', 'units'],
  ['oak_sequences', 'sequences'],
  ['oak_sequence_facets', 'sequence_facets'],
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
  return env().SEARCH_INDEX_TARGET;
}

/** Resolve the index name for the current environment configuration. */
export function resolveCurrentSearchIndexName(kind: SearchIndexKind): string {
  return resolveSearchIndexName(kind, currentSearchIndexTarget());
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
  operations: readonly unknown[],
  target: SearchIndexTarget,
): unknown[] {
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

interface UnknownObject {
  [key: string]: unknown;
}

interface IndexMetadata extends UnknownObject {
  _index: string;
}

type IndexAction = { index: IndexMetadata };

function isIndexAction(value: unknown): value is IndexAction {
  if (!isUnknownObject(value)) {
    return false;
  }
  const action = value.index;
  if (!isUnknownObject(action)) {
    return false;
  }
  return typeof action._index === 'string' && action._index.length > 0;
}

function isUnknownObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}
