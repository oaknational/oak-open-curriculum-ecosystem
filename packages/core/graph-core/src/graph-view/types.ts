/**
 * Type-level result shapes for the `GraphView` query layer. See
 * `./interface.ts` for the `GraphView<TNode, TNodeId, TEdgeType>`
 * interface itself.
 */

/**
 * Subgraph traversal result — bounded nodes + edges from a BFS.
 *
 * Edge endpoints carry the graph's node-id type `TNodeId` and edge labels
 * carry `TEdgeType`, so a consumer's narrowed id/edge-type space flows to
 * the boundary without widening to `string`.
 */
export interface SubgraphResult<TNode, TNodeId extends string, TEdgeType extends string> {
  readonly nodes: readonly TNode[];
  readonly edges: readonly {
    readonly source: TNodeId;
    readonly type: TEdgeType;
    readonly target: TNodeId;
  }[];
}

/** Subgraph traversal failure variants. */
export type SubgraphError<TNodeId extends string> =
  | { readonly kind: 'SubgraphRootNotFound'; readonly rootId: TNodeId }
  | {
      readonly kind: 'SubgraphDepthExceeded';
      readonly depth: number;
      readonly limit: number;
    };
