/**
 * Type-level utilities for the `GraphView` query layer: projection paths,
 * filter predicates, and return shapes. See `./interface.ts` for the
 * `GraphView<TNode, TEdgeType>` interface itself.
 */

/**
 * Tuple-indexed depth-decrement for bounded recursive types.
 * `Prev[D]` produces `D - 1` for `D ∈ {1..8}`; `Prev[0]` is `never`.
 * The eight-level ceiling covers the deepest realistic projection path
 * (EEF strands: depth 3) with five levels of headroom.
 */
type Prev = readonly [never, 0, 1, 2, 3, 4, 5, 6, 7, 8];

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
/**
 * Primitive leaf types — `DeepKeyPath` recursion stops at these. The
 * union is enumerated explicitly because the workspace ESLint config
 * forbids both bare `object` and the indexed-record idiom as type-level
 * constraint checks per the no-type-shortcuts discipline in
 * `principles.md`.
 */
type DeepKeyPathLeaf = string | number | boolean | bigint | symbol | null | undefined;

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
 * Field-level filter predicate over a single field's value type.
 *
 * The `contains` arm has a known semantic collision between the string
 * shape `{ contains: string }` (substring match) and the array shape
 * `{ contains: T }` (element membership). The two arms never fire
 * simultaneously for a single `TFieldValue` (a value cannot be both
 * `string` and an array). A generic dispatcher inspects the field's
 * runtime value to disambiguate.
 */
export type FieldPredicate<TFieldValue> =
  | { readonly equals: TFieldValue }
  | { readonly oneOf: readonly TFieldValue[] }
  | (TFieldValue extends string
      ? { readonly contains: string } | { readonly startsWith: string }
      : never)
  | (TFieldValue extends number ? { readonly gte: number } | { readonly lte: number } : never)
  | (TFieldValue extends readonly (infer U)[] ? { readonly contains: U } : never);

/**
 * Node-level filter — a partial map from field key to field predicate.
 * `NonNullable<TNode[K]>` is load-bearing: without it, `FieldPredicate`
 * arms whose constraints require `extends number` or `extends string`
 * collapse to `never` for fields whose declared type admits `null`.
 */
export type NodeFilter<TNode> = {
  readonly [K in keyof TNode]?: FieldPredicate<NonNullable<TNode[K]>>;
};

/**
 * Adapter manifest — graph-level truth-telling produced once at adapter
 * construction time.
 *
 * `sparseRelationsByNodeId` carries the identifiers of nodes whose
 * outgoing edge sets are empty by data (not by traversal limits). For
 * the EEF corpus this surfaces the 13 strands out of 30 that have no
 * `related_strands` entry.
 */
export interface GraphManifest {
  readonly nodeCount: number;
  readonly edgeTypes: readonly string[];
  readonly edgeCount: number;
  readonly version: string;
  readonly lastUpdated: string;
  readonly schemaHash: string;
  readonly sparseRelationsByNodeId: readonly string[];
}

/** Adapter summary — tag taxonomy + edge-type statistics. */
export interface GraphSummary {
  readonly tagTaxonomy: readonly string[] | null;
  readonly edgeTypeCounts: ReadonlyMap<string, number>;
  readonly nodeTypeCounts: ReadonlyMap<string, number> | null;
}

/** Subgraph traversal result — bounded nodes + edges from a BFS. */
export interface SubgraphResult<TNode> {
  readonly nodes: readonly TNode[];
  readonly edges: readonly {
    readonly source: string;
    readonly type: string;
    readonly target: string;
  }[];
}

/** Neighbour traversal result for a single root node. */
export interface NeighbourResult<TNode> {
  readonly neighbours: readonly {
    readonly node: TNode;
    readonly edgeType: string;
    readonly direction: 'in' | 'out';
  }[];
}

/** Paginated enumeration result. */
export interface EnumerateNodesResult<TNode> {
  readonly nodes: readonly TNode[];
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}

/**
 * Stub error variant for operations not yet implemented at the current
 * sequencing point. The `operation` field uses a literal union of the
 * five operations that may stub at Inc.1d. `subgraph` is excluded
 * because it ships as a real implementation there.
 */
export interface NotImplementedYet {
  readonly kind: 'NotImplementedYet';
  readonly operation: 'summary' | 'getNode' | 'enumerateNodes' | 'neighbours' | 'findByTag';
}

/** Subgraph traversal failure variants. */
export type SubgraphError =
  | { readonly kind: 'SubgraphRootNotFound'; readonly rootId: string }
  | {
      readonly kind: 'SubgraphDepthExceeded';
      readonly depth: number;
      readonly limit: number;
    };

/** Generic node-not-found variant used by `getNode` and `neighbours`. */
export interface NodeNotFoundError {
  readonly kind: 'NodeNotFoundError';
  readonly nodeId: string;
}

/**
 * `findByTag` rejects tags that fall outside an adapter's tag taxonomy.
 * Adapters whose tags are unconstrained never produce this variant.
 */
export interface InvalidTagFormat {
  readonly kind: 'InvalidTagFormat';
  readonly tag: string;
}

/**
 * Composite error union for `findByTag`. Empty matches inside the
 * taxonomy remain `Ok([])`; out-of-taxonomy tags become
 * `Err(InvalidTagFormat)`.
 */
export type FindByTagError = NotImplementedYet | InvalidTagFormat;

/**
 * Stub-only error types for the four operations that ship
 * `Result.err(NotImplementedYet)` at Inc.1d. At Inc.3 these expand
 * additively to include real implementation failures.
 */
export type GraphSummaryError = NotImplementedYet;
export type EnumerateNodesError = NotImplementedYet;
