/**
 * The `GraphView<TNode, TEdgeType>` polymorphic query-layer interface.
 *
 * Adapters (Threads, EEF strands, prerequisites, misconceptions, ...)
 * implement this contract over their own typed node and edge data.
 * Consumers compose against the interface, not against any one
 * adapter's internal shape.
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
 * Stub-operation discipline: at graph-stack Inc.1d, five of the six
 * fallible operations ship as `Result.err(NotImplementedYet)` stubs
 * from the EEF adapter (WS4.5). The interface widens their error
 * unions to include `NotImplementedYet`. This is additive and
 * backward-compatible at Inc.3 when real implementations land.
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
 *   view: GraphView<TStrand, 'related_strand' | 'related_guidance_report'>,
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

import type {
  EnumerateNodesError,
  EnumerateNodesResult,
  FindByTagError,
  GraphManifest,
  GraphSummary,
  GraphSummaryError,
  NeighbourResult,
  NodeFilter,
  NodeNotFoundError,
  NodeProjection,
  NotImplementedYet,
  SubgraphError,
  SubgraphResult,
} from './types.js';

/**
 * Polymorphic query-layer contract for a typed graph.
 *
 * @typeParam TNode - The node value type.
 * @typeParam TEdgeType - String-literal-union of edge-type discriminants.
 */
export interface GraphView<TNode, TEdgeType extends string> {
  manifest(): GraphManifest;

  summary(): Result<GraphSummary, GraphSummaryError>;

  getNode(opts: {
    readonly nodeId: string;
    readonly projection?: NodeProjection<TNode>;
  }): Result<TNode, NodeNotFoundError | NotImplementedYet>;

  enumerateNodes(opts: {
    readonly filter?: NodeFilter<TNode>;
    readonly projection?: NodeProjection<TNode>;
    readonly pageIndex: number;
    readonly pageSize: number;
  }): Result<EnumerateNodesResult<TNode>, EnumerateNodesError | NotImplementedYet>;

  neighbours(opts: {
    readonly nodeId: string;
    readonly edgeType?: TEdgeType;
    readonly direction?: 'in' | 'out' | 'both';
    readonly projection?: NodeProjection<TNode>;
  }): Result<NeighbourResult<TNode>, NodeNotFoundError | NotImplementedYet>;

  subgraph(opts: {
    readonly rootIds: readonly string[];
    readonly depth: number;
    readonly projection?: NodeProjection<TNode>;
  }): Result<SubgraphResult<TNode>, SubgraphError>;

  findByTag(
    tag: string,
    projection?: NodeProjection<TNode>,
  ): Result<readonly TNode[], FindByTagError>;
}
