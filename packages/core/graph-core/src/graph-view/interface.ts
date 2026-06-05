/**
 * The `GraphView<TNode, TNodeId, TEdgeType>` polymorphic query-layer interface.
 *
 * Adapters (EEF strands, prerequisites, misconceptions, ...) implement
 * this contract over their own typed node data, binding `TNodeId` and
 * `TEdgeType` to their own narrowed id and edge-type spaces. Consumers
 * compose against the interface, not against any one adapter's internal
 * shape.
 *
 * Placement in `graph-core` is dependency-direction permanent per
 * ADR-041: lib-tier and agent-graphs-tier consumers cannot import from
 * `packages/sdks/`, so a corpus-sdk-resident contract would be
 * inaccessible to non-corpus implementors. The contract stays
 * domain-generic — no EEF- or MCP-specific names — per ADR-179.
 *
 * Result discipline: `subgraph` is fallible and returns `Result<T, E>`
 * per `principles.md` §Code Design.
 *
 * **Implementor contract**: an adapter constructor MUST fail (return an
 * `err` Result at construction, or throw, before exposing the
 * `GraphView` reference) when its backing data is unavailable or
 * malformed, rather than exposing a partially-constructed view. The
 * interface cannot enforce this with the type system; documentation is
 * the load-bearing surface.
 *
 * The contract is a single operation, `subgraph()`: every operation is
 * implemented with real graph-derived logic and tests, or it is absent.
 *
 * @example
 * ```typescript
 * import {
 *   type GraphView,
 *   type SubgraphResult,
 * } from '@oaknational/graph-core/graph-view';
 *
 * function exploreNeighbourhood<TNode, TNodeId extends string, TEdge extends string>(
 *   view: GraphView<TNode, TNodeId, TEdge>,
 *   rootIds: readonly TNodeId[],
 * ): SubgraphResult<TNode, TNodeId, TEdge> | undefined {
 *   const result = view.subgraph({ rootIds, depth: 2 });
 *   if (result.ok) return result.value;
 *   return undefined;
 * }
 * ```
 */

import type { Result } from '@oaknational/result';

import type { SubgraphError, SubgraphResult } from './types.js';

/**
 * Polymorphic query-layer contract for a typed graph.
 *
 * @typeParam TNode - The node value type.
 * @typeParam TNodeId - The node-id type (an `extends string` literal union
 *   for a fixed corpus); flows through roots, edge endpoints, and errors.
 * @typeParam TEdgeType - The edge-label type (an `extends string` literal
 *   union); flows through edge `type` fields.
 */
export interface GraphView<TNode, TNodeId extends string, TEdgeType extends string> {
  subgraph(opts: {
    readonly rootIds: readonly TNodeId[];
    readonly depth: number;
  }): Result<SubgraphResult<TNode, TNodeId, TEdgeType>, SubgraphError<TNodeId>>;
}
