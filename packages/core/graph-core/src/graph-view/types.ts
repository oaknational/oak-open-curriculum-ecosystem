/**
 * Type-level utilities for the `GraphView` query layer: projection paths
 * and the subgraph return shapes. See `./interface.ts` for the
 * `GraphView<TNode, TNodeId, TEdgeType>` interface itself.
 */

/**
 * Tuple-indexed depth-decrement for bounded recursive types.
 * `Prev[D]` produces `D - 1` for `D ∈ {1..8}`; `Prev[0]` is `never`.
 * The eight-level ceiling covers the deepest realistic projection path
 * (EEF strands: depth 3) with five levels of headroom.
 */
type Prev = readonly [never, 0, 1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Primitive leaf types — `DeepKeyPath` recursion stops at these. The
 * union is enumerated explicitly because the workspace ESLint config
 * forbids both bare `object` and the indexed-record idiom as type-level
 * constraint checks per the no-type-shortcuts discipline in
 * `principles.md`.
 */
type DeepKeyPathLeaf = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Recursive deep-path type producing literal-string path unions over an
 * object type, bounded by `D`. Implements the array-stop constraint: a
 * field that satisfies `readonly X[]` or `X[]` emits the field name as a
 * leaf and does NOT recurse into the element type. Element-index paths
 * like `'tags.0'` or `'tags[number]'` are structurally excluded from the
 * union, at every level of recursion.
 *
 * Function-typed fields are also leaves, preventing recursion into a
 * function value's own properties (`length`, `name`, ...). Graph node
 * types should not carry function fields; the guard is defensive.
 */
export type DeepKeyPath<T, D extends number> = D extends 0
  ? never
  : T extends DeepKeyPathLeaf
    ? never
    : T extends readonly unknown[]
      ? never
      : T extends (...args: never[]) => unknown
        ? never
        : {
            [K in keyof T & string]: T[K] extends DeepKeyPathLeaf
              ? K
              : T[K] extends readonly unknown[]
                ? K
                : T[K] extends (...args: never[]) => unknown
                  ? K
                  : K | `${K}.${DeepKeyPath<T[K], Prev[D]>}`;
          }[keyof T & string];

/**
 * Projection key list for `GraphView` operations. Default depth `4`
 * provides one level of headroom over the deepest realistic projection
 * path. A node type whose path-set produces a TypeScript-recursion
 * overflow at depth `D` is a design signal that the type is too deep
 * to be a useful projection target.
 */
export type NodeProjection<TNode, Depth extends number = 4> = readonly DeepKeyPath<TNode, Depth>[];

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
