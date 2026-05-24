/**
 * `@oaknational/graph-corpus-sdk` root barrel.
 *
 * Re-exports each sub-path module's public surface. Direct sub-path
 * imports (e.g. `@oaknational/graph-corpus-sdk/eef-strands`) remain the
 * preferred entrypoint; the root barrel exists for convenience and
 * discovery.
 *
 * The foundational types `GraphView` (from `@oaknational/graph-core`)
 * and the `Result<T, E>` generic (from `@oaknational/result`) are
 * re-exported here so consumers can adopt the corpus-adapter surface
 * contract from this one entry point. Sub-path barrels ship empty
 * until their adapter cycles land — see the sub-path files for the
 * named workstream pointers.
 */

export type { GraphView } from '@oaknational/graph-core/graph-view';
export type { Result } from '@oaknational/result';
