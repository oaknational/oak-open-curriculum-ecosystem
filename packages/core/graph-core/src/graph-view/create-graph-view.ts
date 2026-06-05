/**
 * `createGraphView` — the domain-generic bounded-BFS factory backing the
 * `GraphView.subgraph` primitive.
 *
 * It builds an in-memory node index and outgoing-adjacency map once, then
 * serves bounded subgraph queries over them. The factory is domain-generic
 * (ADR-179): no EEF/MCP names; `TNodeId` and `TEdgeType` flow from the caller's
 * narrowed spaces (e.g. `EefStrandId` / `'related_strand'`) to the boundary
 * without widening to `string`.
 *
 * Construction is the failure boundary (the infallible-or-throw construction
 * contract). A duplicate node id, an edge whose endpoint is not a known node,
 * or a negative `maxDepth` is a data/programmer invariant violation on a fixed
 * input — it THROWS at construction rather than being smuggled into the
 * per-call error surface. For valid input construction is infallible, so the
 * only run-time failures are the two ratified per-call `SubgraphError` variants
 * (`SubgraphRootNotFound`, `SubgraphDepthExceeded`), returned as `Result` errors.
 */

import { err, ok } from '@oaknational/result';

import type { GraphView } from './interface.js';
import type { SubgraphError, SubgraphResult } from './types.js';

/** A typed directed edge: both endpoints carry `TNodeId`, the label carries `TEdgeType`. */
export interface GraphEdge<TNodeId extends string, TEdgeType extends string> {
  readonly source: TNodeId;
  readonly type: TEdgeType;
  readonly target: TNodeId;
}

/**
 * Input to {@link createGraphView}. `nodeId` MUST return `TNodeId` (never a
 * widened `string`) so the node-id type flows through traversal, edge
 * endpoints, and errors.
 */
export interface CreateGraphViewInput<TNode, TNodeId extends string, TEdgeType extends string> {
  readonly nodes: readonly TNode[];
  readonly edges: readonly GraphEdge<TNodeId, TEdgeType>[];
  readonly nodeId: (node: TNode) => TNodeId;
  /** The inclusive depth ceiling for this graph; a `subgraph` depth outside `[0, maxDepth]` is `SubgraphDepthExceeded`. */
  readonly maxDepth: number;
}

/** Build the node-id → node index; throws on a duplicate id. */
function indexNodesById<TNode, TNodeId extends string>(
  nodes: readonly TNode[],
  nodeId: (node: TNode) => TNodeId,
): Map<TNodeId, TNode> {
  const nodesById = new Map<TNodeId, TNode>();
  for (const node of nodes) {
    const id = nodeId(node);
    if (nodesById.has(id)) {
      throw new Error(`createGraphView: duplicate node id "${id}"`);
    }
    nodesById.set(id, node);
  }
  return nodesById;
}

/** Build the outgoing-adjacency map; throws on an edge endpoint that is not a known node. */
function buildOutgoingAdjacency<TNodeId extends string, TEdgeType extends string>(
  edges: readonly GraphEdge<TNodeId, TEdgeType>[],
  validIds: ReadonlySet<TNodeId>,
): Map<TNodeId, TNodeId[]> {
  const outgoing = new Map<TNodeId, TNodeId[]>();
  for (const edge of edges) {
    if (!validIds.has(edge.source)) {
      throw new Error(`createGraphView: edge source "${edge.source}" is not a known node`);
    }
    if (!validIds.has(edge.target)) {
      throw new Error(`createGraphView: edge target "${edge.target}" is not a known node`);
    }
    const adjacency = outgoing.get(edge.source);
    if (adjacency === undefined) {
      outgoing.set(edge.source, [edge.target]);
    } else {
      adjacency.push(edge.target);
    }
  }
  return outgoing;
}

/** Expand one BFS layer: add unseen outgoing targets of the frontier to `members`, returning the new frontier. */
function expandFrontier<TNodeId extends string>(
  frontier: readonly TNodeId[],
  outgoing: ReadonlyMap<TNodeId, readonly TNodeId[]>,
  members: Set<TNodeId>,
): TNodeId[] {
  const next: TNodeId[] = [];
  for (const id of frontier) {
    const adjacency = outgoing.get(id) ?? [];
    for (const target of adjacency) {
      if (!members.has(target)) {
        members.add(target);
        next.push(target);
      }
    }
  }
  return next;
}

/** Members = roots ∪ nodes reachable within `depth` outgoing hops. Insertion order is roots-first BFS-discovery order. */
function bfsMembers<TNodeId extends string>(
  rootIds: readonly TNodeId[],
  depth: number,
  outgoing: ReadonlyMap<TNodeId, readonly TNodeId[]>,
): Set<TNodeId> {
  const members = new Set<TNodeId>(rootIds);
  let frontier: readonly TNodeId[] = rootIds;
  for (let level = 0; level < depth && frontier.length > 0; level += 1) {
    frontier = expandFrontier(frontier, outgoing, members);
  }
  return members;
}

/** Resolve member ids to their nodes, preserving member insertion order. */
function collectMemberNodes<TNode, TNodeId extends string>(
  members: ReadonlySet<TNodeId>,
  nodesById: ReadonlyMap<TNodeId, TNode>,
): TNode[] {
  const memberNodes: TNode[] = [];
  for (const id of members) {
    // `members` only ever holds validated node ids (roots are checked present
    // and BFS targets are validated edge endpoints), so this lookup always
    // hits; the guard narrows `Map.get`'s `TNode | undefined` without `!`/`as`.
    const node = nodesById.get(id);
    if (node !== undefined) {
      memberNodes.push(node);
    }
  }
  return memberNodes;
}

/**
 * Build a bounded-BFS {@link GraphView} over a fixed node + edge set.
 *
 * @throws Error if `maxDepth < 0`, if two nodes share an id, or if any edge
 *   endpoint is not a known node id.
 */
export function createGraphView<TNode, TNodeId extends string, TEdgeType extends string>(
  input: CreateGraphViewInput<TNode, TNodeId, TEdgeType>,
): GraphView<TNode, TNodeId, TEdgeType> {
  const { nodes, edges, nodeId, maxDepth } = input;

  if (maxDepth < 0) {
    throw new Error(`createGraphView: maxDepth must be >= 0, received ${maxDepth}`);
  }

  const nodesById = indexNodesById(nodes, nodeId);
  const validIds = new Set<TNodeId>(nodesById.keys());
  const outgoing = buildOutgoingAdjacency(edges, validIds);

  return {
    subgraph(opts) {
      const { rootIds, depth } = opts;

      if (depth < 0 || depth > maxDepth) {
        const depthError: SubgraphError<TNodeId> = {
          kind: 'SubgraphDepthExceeded',
          depth,
          limit: maxDepth,
        };
        return err(depthError);
      }

      const missingRoot = rootIds.find((rootId) => !validIds.has(rootId));
      if (missingRoot !== undefined) {
        const rootError: SubgraphError<TNodeId> = {
          kind: 'SubgraphRootNotFound',
          rootId: missingRoot,
        };
        return err(rootError);
      }

      const members = bfsMembers(rootIds, depth, outgoing);
      const memberEdges = edges.filter(
        (edge) => members.has(edge.source) && members.has(edge.target),
      );
      const value: SubgraphResult<TNode, TNodeId, TEdgeType> = {
        nodes: collectMemberNodes(members, nodesById),
        edges: memberEdges,
      };
      return ok(value);
    },
  };
}
