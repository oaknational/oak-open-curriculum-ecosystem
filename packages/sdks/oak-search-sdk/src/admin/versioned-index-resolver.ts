/**
 * Versioned index name resolver for blue/green index swapping (ADR-130).
 *
 * Creates an {@link IndexResolverFn} that returns versioned physical index
 * names (e.g. `oak_lessons_v2026-03-07-143022`) rather than alias names.
 *
 * This is an admin-layer concern only — the retrieval path never uses
 * versioned names. The resolver shares the {@link IndexResolverFn} type
 * with {@link createIndexResolver}, so `createAllIndexes` and `runIngest`
 * accept it without modification.
 *
 * @see {@link ../internal/index-resolver.ts} for the read-path resolver
 * @see {@link ../internal/index-resolver.ts#resolveVersionedIndexName} for the shared name formula
 */

import type { IndexResolverFn, SearchIndexKind, SearchIndexTarget } from '../internal/index.js';
import { BASE_INDEX_NAMES, resolveVersionedIndexName } from '../internal/index.js';

/**
 * Create an index resolver that returns versioned physical index names.
 *
 * @param version - Version string (e.g. `'v2026-03-07-143022'`)
 * @param target - Index target, defaults to `'primary'`
 * @returns An {@link IndexResolverFn} returning versioned names
 *
 * @example
 * ```typescript
 * const resolve = createVersionedIndexResolver('v2026-03-07-143022');
 * resolve('lessons');  // 'oak_lessons_v2026-03-07-143022'
 *
 * const sandboxResolve = createVersionedIndexResolver('v2026-03-07-143022', 'sandbox');
 * sandboxResolve('lessons');  // 'oak_lessons_sandbox_v2026-03-07-143022'
 * ```
 */
export function createVersionedIndexResolver(
  version: string,
  target: SearchIndexTarget = 'primary',
): IndexResolverFn {
  return (kind: SearchIndexKind) =>
    resolveVersionedIndexName(BASE_INDEX_NAMES[kind], target, version);
}
