/**
 * `@oaknational/graph-corpus-sdk` root barrel.
 *
 * Re-exports the foundational types `GraphView` (from
 * `@oaknational/graph-core`) and the `Result<T, E>` generic (from
 * `@oaknational/result`) for convenience and discovery. Domain
 * surfaces live on their sub-path entrypoints and are imported
 * directly — `@oaknational/graph-corpus-sdk/eef-strands` is the typed
 * EEF raw-corpus foundation (strand identity and lookup, raw vocabulary
 * domains, the declared-vs-observed divergence, related-strand edges,
 * and corpus provenance).
 */

export type { GraphView } from '@oaknational/graph-core/graph-view';
export type { Result } from '@oaknational/result';
