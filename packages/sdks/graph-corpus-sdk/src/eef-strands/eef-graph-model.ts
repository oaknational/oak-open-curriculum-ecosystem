/**
 * Pure graph model and traversal for {@link EefStrandsGraphView}.
 *
 * Holds the side-effect-free construction, validation, and breadth-first
 * traversal logic the adapter composes. Keeping it separate from the
 * class keeps each unit small, individually testable, and free of the
 * `GraphView` interface ceremony. No I/O: the t2 Zod loader reads and
 * shape-validates the corpus; this module enforces the graph-level
 * invariants the loader cannot express.
 */

import { ok, err, type Result } from '@oaknational/result';
import type { SubgraphError, SubgraphResult } from '@oaknational/graph-core/graph-view';

import type { EefStrand } from './strand-schema.js';

/**
 * The EEF strand graph's single edge-type discriminant: strand-to-strand
 * relations derived from `related_strands`.
 */
export type EefStrandEdgeType = 'related_strand';

export const RELATED_STRAND: EefStrandEdgeType = 'related_strand';

/**
 * Upper bound on `subgraph` traversal depth. The EEF corpus is 30 nodes
 * with a small diameter, so any depth beyond a handful reaches the whole
 * connected component; this limit guards against pathological requests
 * rather than reflecting a data-driven ceiling.
 */
export const MAX_SUBGRAPH_DEPTH = 10;

/**
 * Construction failure variants. Both are graph-level invariants the
 * shape-level Zod loader (t2) cannot detect.
 */
export type EefStrandsGraphViewConstructionError =
  | { readonly kind: 'DuplicateStrandId'; readonly strandId: string }
  | {
      readonly kind: 'DanglingRelatedStrand';
      readonly source: string;
      readonly target: string;
    };

/** Immutable, validated graph index produced by {@link buildGraphIndex}. */
export interface EefGraphIndex {
  readonly nodesById: ReadonlyMap<string, EefStrand>;
  readonly orderedIds: readonly string[];
  readonly edgeCount: number;
  readonly sparseRelationsByNodeId: readonly string[];
}

function indexNodes(
  strands: readonly EefStrand[],
): Result<ReadonlyMap<string, EefStrand>, EefStrandsGraphViewConstructionError> {
  const nodesById = new Map<string, EefStrand>();
  for (const strand of strands) {
    if (nodesById.has(strand.id)) {
      return err({ kind: 'DuplicateStrandId', strandId: strand.id });
    }
    nodesById.set(strand.id, strand);
  }
  return ok(nodesById);
}

function summariseEdges(
  strands: readonly EefStrand[],
  nodesById: ReadonlyMap<string, EefStrand>,
): Result<
  { readonly edgeCount: number; readonly sparseRelationsByNodeId: readonly string[] },
  EefStrandsGraphViewConstructionError
> {
  let edgeCount = 0;
  const sparseRelationsByNodeId: string[] = [];
  for (const strand of strands) {
    const related = strand.related_strands ?? [];
    if (related.length === 0) {
      sparseRelationsByNodeId.push(strand.id);
      continue;
    }
    for (const target of related) {
      if (!nodesById.has(target)) {
        return err({ kind: 'DanglingRelatedStrand', source: strand.id, target });
      }
      edgeCount += 1;
    }
  }
  return ok({ edgeCount, sparseRelationsByNodeId });
}

/**
 * Build the validated graph index, enforcing strand-id uniqueness and
 * `related_strand` referential integrity. Returns `err` on the first
 * violation rather than producing a degraded index.
 */
export function buildGraphIndex(
  strands: readonly EefStrand[],
): Result<EefGraphIndex, EefStrandsGraphViewConstructionError> {
  const indexed = indexNodes(strands);
  if (!indexed.ok) {
    return indexed;
  }
  const edges = summariseEdges(strands, indexed.value);
  if (!edges.ok) {
    return edges;
  }
  return ok({
    nodesById: indexed.value,
    orderedIds: strands.map((strand) => strand.id),
    edgeCount: edges.value.edgeCount,
    sparseRelationsByNodeId: edges.value.sparseRelationsByNodeId,
  });
}

/**
 * Validate a `subgraph` request against the index. Returns the failing
 * {@link SubgraphError} variant, or `undefined` when the request is sound.
 */
export function validateSubgraphRequest(
  nodesById: ReadonlyMap<string, EefStrand>,
  rootIds: readonly string[],
  depth: number,
): SubgraphError | undefined {
  if (depth < 0 || depth > MAX_SUBGRAPH_DEPTH) {
    return { kind: 'SubgraphDepthExceeded', depth, limit: MAX_SUBGRAPH_DEPTH };
  }
  for (const rootId of rootIds) {
    if (!nodesById.has(rootId)) {
      return { kind: 'SubgraphRootNotFound', rootId };
    }
  }
  return undefined;
}

interface MutableSubgraphEdge {
  readonly source: string;
  readonly type: string;
  readonly target: string;
}

function collectOutgoingEdges(
  sourceId: string,
  nodesById: ReadonlyMap<string, EefStrand>,
  visited: Set<string>,
  edges: MutableSubgraphEdge[],
): string[] {
  const newlyVisited: string[] = [];
  for (const target of nodesById.get(sourceId)?.related_strands ?? []) {
    edges.push({ source: sourceId, type: RELATED_STRAND, target });
    if (!visited.has(target)) {
      visited.add(target);
      newlyVisited.push(target);
    }
  }
  return newlyVisited;
}

/**
 * Breadth-first traversal over `related_strand` edges from the roots,
 * bounded to `depth` hops. Collects every node reached and every edge
 * traversed. Insertion order is deterministic: roots first, then nodes in
 * discovery order. Assumes the request has already passed
 * {@link validateSubgraphRequest}.
 */
export function traverseSubgraph(
  nodesById: ReadonlyMap<string, EefStrand>,
  rootIds: readonly string[],
  depth: number,
): SubgraphResult<EefStrand> {
  const visited = new Set<string>(rootIds);
  const edges: MutableSubgraphEdge[] = [];
  let frontier: readonly string[] = [...visited];

  for (let hop = 0; hop < depth && frontier.length > 0; hop += 1) {
    const next: string[] = [];
    for (const sourceId of frontier) {
      next.push(...collectOutgoingEdges(sourceId, nodesById, visited, edges));
    }
    frontier = next;
  }

  const nodes: EefStrand[] = [];
  for (const id of visited) {
    const node = nodesById.get(id);
    if (node !== undefined) {
      nodes.push(node);
    }
  }
  return { nodes, edges };
}
