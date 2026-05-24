/**
 * Adjacency sub-path: node→node traversal primitives over a projected
 * `PropertyGraph`.
 *
 * Three free functions describe the property-graph adjacency surface:
 *
 * - `outgoing(graph, nodeId)` — every edge whose `source` equals `nodeId`.
 * - `incoming(graph, nodeId)` — every edge whose `target` equals `nodeId`.
 * - `neighbours(graph, nodeId)` — every distinct node id connected to
 *   `nodeId` by at least one edge in either direction (self included on
 *   self-loop), preserving first-appearance order.
 *
 * **Conceptual seam against `DatasetCore.match()`.** Adjacency is
 * node→node traversal over the property-graph projection produced by
 * `@oaknational/graph-project/projection`. Quad-pattern matching over
 * the canonical RDF dataset stays on `@oaknational/graph-core/dataset`
 * (research §10 fluent API on Dataset vs research §11 projection
 * adjacency on PropertyGraph; ADR-173 §Design Principles #3). Both
 * surfaces must be available because they answer different conceptual
 * questions — the Threads adapter (Inc.1b WS4.2) is free to choose
 * either for its inverse-edge lookup.
 *
 * Identity comparison uses the canonical `equals` free function from
 * `@oaknational/graph-core/term`, which dispatches on `termType` and
 * compares structurally by value. Two `BlankNode` terms with the same
 * `value` denote the same node within the property graph.
 *
 * **Shape choice.** Each function returns a `readonly` array rather
 * than an `Iterable`/`Generator`. The `PropertyGraph` is already a
 * fully materialised in-memory value carrying `readonly` arrays of
 * nodes and edges; returning arrays preserves that posture, composes
 * with `.length`/`Array.prototype` operators, and avoids introducing a
 * second iteration shape on the same surface.
 *
 * Adjacency is total: every well-formed `(graph, nodeId)` pair has a
 * well-defined answer (possibly an empty array). No `Result` is needed
 * — there is no failure mode to model.
 *
 * @example
 * ```typescript
 * import { namedNode } from '@oaknational/graph-core/data-factory';
 * import { toPropertyGraph } from '@oaknational/graph-project/projection';
 * import { neighbours } from '@oaknational/graph-project/adjacency';
 *
 * const alice = namedNode('http://example.test/alice');
 * const graph = toPropertyGraph(dataset);
 * for (const neighbour of neighbours(graph, alice)) {
 *   // ...
 * }
 * ```
 */

import { equals } from '@oaknational/graph-core/term';

import type {
  PropertyGraph,
  PropertyGraphEdge,
  PropertyGraphNodeId,
} from '../property-graph/index.js';

/**
 * Edges whose `source` matches `nodeId`, in edge-iteration order.
 *
 * Returns an empty array when no edge originates at `nodeId`, including
 * the case where `nodeId` is absent from the graph entirely.
 */
export function outgoing(
  graph: PropertyGraph,
  nodeId: PropertyGraphNodeId,
): readonly PropertyGraphEdge[] {
  return graph.edges.filter((candidate) => equals(candidate.source, nodeId));
}

/**
 * Edges whose `target` matches `nodeId`, in edge-iteration order.
 *
 * Returns an empty array when no edge terminates at `nodeId`, including
 * the case where `nodeId` is absent from the graph entirely.
 */
export function incoming(
  graph: PropertyGraph,
  nodeId: PropertyGraphNodeId,
): readonly PropertyGraphEdge[] {
  return graph.edges.filter((candidate) => equals(candidate.target, nodeId));
}

/**
 * Distinct node ids connected to `nodeId` by at least one edge in
 * either direction.
 *
 * Order is first-appearance under one pass over `graph.edges`: for each
 * edge whose `source` equals `nodeId`, the `target` is considered for
 * inclusion; for each edge whose `target` equals `nodeId`, the `source`
 * is considered. Each candidate is included only the first time it is
 * seen (structural equality via `equals`). Self-loops include `nodeId`
 * itself in the result.
 *
 * Returns an empty array when `nodeId` has no edges in either direction.
 */
export function neighbours(
  graph: PropertyGraph,
  nodeId: PropertyGraphNodeId,
): readonly PropertyGraphNodeId[] {
  const result: PropertyGraphNodeId[] = [];
  for (const candidate of graph.edges) {
    if (equals(candidate.source, nodeId)) {
      pushIfAbsent(result, candidate.target);
    }
    if (equals(candidate.target, nodeId)) {
      pushIfAbsent(result, candidate.source);
    }
  }
  return result;
}

function pushIfAbsent(collected: PropertyGraphNodeId[], candidate: PropertyGraphNodeId): void {
  if (collected.some((existing) => equals(existing, candidate))) {
    return;
  }
  collected.push(candidate);
}
