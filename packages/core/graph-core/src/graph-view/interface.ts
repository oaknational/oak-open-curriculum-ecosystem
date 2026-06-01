/**
 * The `GraphView<TNode>` polymorphic query-layer interface.
 *
 * Adapters (EEF strands, prerequisites, misconceptions, ...) implement
 * this contract over their own typed node data. Consumers compose against
 * the interface, not against any one adapter's internal shape.
 *
 * Placement in `graph-core` is dependency-direction permanent per
 * ADR-041: lib-tier and agent-graphs-tier consumers cannot import from
 * `packages/sdks/`, so a corpus-sdk-resident contract would be
 * inaccessible to non-corpus implementors.
 *
 * Result discipline: every fallible operation returns `Result<T, E>`
 * per `principles.md` §Code Design. `manifest()` returns a plain value
 * because the manifest is metadata produced at adapter construction
 * time — the load step is the failure boundary, not the per-call
 * boundary.
 *
 * **Implementor contract**: an adapter constructor MUST fail (return
 * an `err` Result at construction or throw before exposing the
 * `GraphView` reference) when its backing data is unavailable, rather
 * than returning a degraded manifest. The interface cannot enforce
 * this with the type system; documentation is the load-bearing
 * surface.
 *
 * The contract is `manifest()` + `subgraph()`: every operation is
 * implemented with real graph-derived logic and tests, or it is absent.
 *
 * @example
 * ```typescript
 * import {
 *   type GraphView,
 *   type NodeProjection,
 *   type SubgraphResult,
 * } from '@oaknational/graph-core/graph-view';
 *
 * async function exploreEvidence<TStrand>(
 *   view: GraphView<TStrand>,
 *   rootIds: readonly string[],
 *   projection?: NodeProjection<TStrand>,
 * ): Promise<SubgraphResult<TStrand> | undefined> {
 *   const result = view.subgraph({ rootIds, depth: 2, projection });
 *   if (result.ok) return result.value;
 *   return undefined;
 * }
 * ```
 */

import type { Result } from '@oaknational/result';

import type { GraphManifest, NodeProjection, SubgraphError, SubgraphResult } from './types.js';

/**
 * Polymorphic query-layer contract for a typed graph.
 *
 * @typeParam TNode - The node value type.
 */
export interface GraphView<TNode> {
  manifest(): GraphManifest;

  subgraph(opts: {
    readonly rootIds: readonly string[];
    readonly depth: number;
    readonly projection?: NodeProjection<TNode>;
  }): Result<SubgraphResult<TNode>, SubgraphError>;
}
