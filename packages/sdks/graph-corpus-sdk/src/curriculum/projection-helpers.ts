/**
 * Shared projection plumbing for the curriculum views.
 *
 * @remarks
 * Consolidated from the byte-similar copies the misconception and keyword
 * projections each carried (G4b c3 review wave): the corpus integrity lookup
 * (`mustGet`) and the generic edge-adjacency builder. Each projection keeps a
 * locally edge-type-narrowed wrapper over {@link buildEdgeAdjacency} so a
 * call site cannot pass an edge type its view does not traverse — the
 * narrowing is the projection's contract; the traversal body lives once here.
 */

import {
  graphCorpus,
  type GraphCorpusEdgeType,
  type GraphCorpusNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';

/** Looks up a known node, failing loudly if the corpus integrity invariant is breached. */
export function mustGet<TNode>(
  map: ReadonlyMap<GraphCorpusNodeId, TNode>,
  id: GraphCorpusNodeId,
): TNode {
  const node = map.get(id);
  if (node === undefined) {
    throw new Error(`graph corpus integrity breach: node id "${id}" has no emitted node`);
  }
  return node;
}

/** Groups resolved target nodes per source id for one edge type, id-sorted per group. */
export function buildEdgeAdjacency<TNode extends { readonly id: GraphCorpusNodeId }>(
  edgeType: GraphCorpusEdgeType,
  targetsById: ReadonlyMap<GraphCorpusNodeId, TNode>,
): ReadonlyMap<GraphCorpusNodeId, readonly TNode[]> {
  const adjacency = new Map<GraphCorpusNodeId, TNode[]>();
  for (const edge of graphCorpus.edges) {
    if (edge.type !== edgeType) {
      continue;
    }
    const target = mustGet(targetsById, edge.target);
    const existing = adjacency.get(edge.source);
    if (existing) {
      existing.push(target);
    } else {
      adjacency.set(edge.source, [target]);
    }
  }
  for (const targets of adjacency.values()) {
    targets.sort((a, b) => a.id.localeCompare(b.id));
  }
  return adjacency;
}
