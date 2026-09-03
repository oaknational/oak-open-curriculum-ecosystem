/**
 * Prior-knowledge view (G1b) — bounded anchored PREDECESSOR retrieval over the
 * one curriculum graph corpus.
 *
 * @deprecated MCP-671 (2026-09-03). Nothing serves this view. Its
 * `prerequisiteFor` edges are SYNTHESISED at corpus emission from consecutive
 * year-ordered thread pairs, with an arbitrary tie-break between units taught
 * in the same year, so they assert a prerequisite relation the curriculum data
 * does not record. `get-prior-knowledge-graph` now serves
 * `priorKnowledgeStatements` — each unit's own stated prior knowledge. Do not
 * build a new surface on this view. See ADR-195's MCP-671 amendment.
 *
 * "Prior knowledge of unit X" is the set of units that are (transitively, up to
 * a bounded depth) prerequisites of X — X's PREDECESSORS. The corpus edges are
 * oriented prerequisite (the `source`) to dependent (the `target`): the
 * generator emits one edge per consecutive thread-ordering pair, where the
 * earlier unit is `prerequisiteFor` the later unit, so the earlier unit is the
 * prerequisite. `createGraphView` does OUTGOING-only BFS (from `source` to
 * `target`); to reach a unit's predecessors this view constructs the
 * `GraphView` over REVERSED edges, so an outgoing BFS over the reversed edges
 * is an incoming traversal over the corpus — exactly the prior-knowledge set.
 * Result edges are re-oriented back to the true `prerequisiteFor` direction
 * (prerequisite then dependent) before they leave this module, so consumers
 * see the edges as the corpus stores them — which is not the same as a
 * relation the curriculum data records; see the deprecation note above.
 *
 * Bounded retrieval — depth default 2, caller-adjustable up to
 * {@link MAX_PREREQUISITE_DEPTH}. Predecessor-direction neighbourhood sizes,
 * re-measured over the emitted corpus (2026-06-10, sourceVersion 2026-05-21):
 *
 * | depth | median | p90 | max |
 * | ----- | ------ | --- | --- |
 * | 1     | 2      | 4   | 8   |
 * | 2     | 4      | 9   | 21  | ← the bounded default
 * | 3     | 8      | 18  | 42  | ← ceiling (≤ 2.6% of the corpus)
 *
 * A depth beyond the ceiling is `SubgraphDepthExceeded`: bounded retrieval is
 * the contract, and no whole-corpus traversal path is offered.
 *
 * Construction runs once at module load (the EEF `eef-graph.ts` precedent). For
 * the valid emitted corpus it is infallible — G1a integrity resolution
 * guarantees zero dangling endpoints and no duplicate ids — so the only
 * run-time failure is the caller-driven `SubgraphDepthExceeded`. The startup
 * cost is sub-millisecond at corpus scale (≈1.6k nodes / ≈3.5k edges); the view
 * test pins a generous bound on it.
 */

import {
  createGraphView,
  type GraphEdge,
  type GraphView,
  type SubgraphError,
} from '@oaknational/graph-core/graph-view';
import { ok, err, type Result } from '@oaknational/result';
import {
  graphCorpus,
  type GraphCorpusEdge,
  type GraphCorpusNodeId,
  type GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';

/** Default prerequisite-traversal depth — the bounded, empirically-validated default (see the module table). */
export const DEFAULT_PREREQUISITE_DEPTH = 2;

/** Inclusive depth ceiling; a deeper query is `SubgraphDepthExceeded` (bounded-retrieval contract). */
export const MAX_PREREQUISITE_DEPTH = 3;

/**
 * The curriculum prior-knowledge graph view: `TNode = GraphCorpusUnitNode`,
 * `TNodeId = GraphCorpusNodeId`, `TEdgeType = 'prerequisiteFor'`. Outgoing BFS
 * over its (reversed) edges is a predecessor traversal over the corpus.
 */
export type CurriculumPriorKnowledgeView = GraphView<
  GraphCorpusUnitNode,
  GraphCorpusNodeId,
  'prerequisiteFor'
>;

/**
 * Builds the direction-aware prior-knowledge view over the one graph corpus.
 *
 * The corpus edges are reversed (`source`/`target` swapped, type re-pinned
 * `as const` so it does not widen to `string`) and fed to the outgoing-only
 * `createGraphView`, so a `subgraph` query traverses predecessors — a unit's
 * prior knowledge. This is the sole construction path for the curriculum graph
 * (G1b retired the forward-only G1a bridge; prior knowledge is the consumed
 * direction).
 *
 * @param maxDepth - Inclusive depth ceiling; defaults to {@link MAX_PREREQUISITE_DEPTH}.
 * @returns A `GraphView` whose outgoing BFS is predecessor traversal over the corpus.
 * @throws Error if the corpus has a duplicate node id or a dangling edge endpoint
 *   (it does not — G1a integrity resolution guarantees neither).
 */
export function createCurriculumPriorKnowledgeView(
  maxDepth: number = MAX_PREREQUISITE_DEPTH,
): CurriculumPriorKnowledgeView {
  // Per-view selection (the settled substrate mechanism): this view includes
  // exactly the unit nodes and the prerequisiteFor edges — the G2 chain kinds
  // (thread/lesson/misconception nodes, containsUnit/containsLesson/
  // addressesMisconception edges) live in the same corpus but are not part of
  // the prior-knowledge traversal.
  const reversedPrerequisiteEdges: readonly GraphEdge<GraphCorpusNodeId, 'prerequisiteFor'>[] =
    graphCorpus.edges
      .filter((edge) => edge.type === 'prerequisiteFor')
      .map((edge) => ({
        source: edge.target,
        type: 'prerequisiteFor' as const,
        target: edge.source,
      }));

  return createGraphView<GraphCorpusUnitNode, GraphCorpusNodeId, 'prerequisiteFor'>({
    nodes: corpusUnitNodes,
    edges: reversedPrerequisiteEdges,
    nodeId: (node) => node.id,
    maxDepth,
  });
}

/** The corpus's unit nodes — the node kind this view traverses (per-view selection). */
const corpusUnitNodes: readonly GraphCorpusUnitNode[] = graphCorpus.nodes.filter(
  (node): node is GraphCorpusUnitNode => node.kind === 'unit',
);

/** The prior-knowledge view, constructed once at module load (EEF `eef-graph.ts` precedent). */
const priorKnowledgeView: CurriculumPriorKnowledgeView = createCurriculumPriorKnowledgeView();

/** The unit node-id set, for resolving anchor slugs to known nodes once at module load. */
const corpusNodeIds: ReadonlySet<GraphCorpusNodeId> = new Set(
  corpusUnitNodes.map((node) => node.id),
);

/**
 * The bounded prior-knowledge subgraph for a set of anchor units.
 *
 * `nodes` and `edges` are the corpus's own types; `edges` carry the TRUE
 * `prerequisiteFor` orientation (prerequisite → dependent). `resolvedAnchors`
 * are the anchor ids found in the corpus; `unknownAnchors` are the input slugs
 * with no matching unit (reported, not an error). `depth` echoes the depth used.
 */
export interface PriorKnowledgeSubgraph {
  readonly nodes: readonly GraphCorpusUnitNode[];
  readonly edges: readonly GraphCorpusEdge[];
  readonly resolvedAnchors: readonly GraphCorpusNodeId[];
  readonly unknownAnchors: readonly string[];
  readonly depth: number;
}

/** Maps a bare unit slug to its kind-qualified corpus node id (`unit:<slug>`). */
function toUnitNodeId(unitSlug: string): GraphCorpusNodeId {
  return `unit:${unitSlug}`;
}

/**
 * Returns the bounded prior-knowledge (predecessor) subgraph for the given
 * anchor unit slugs.
 *
 * Anchors are resolved to corpus node ids; unknown slugs are reported in
 * `unknownAnchors` rather than failing the call. Anchors are a set — a slug
 * repeated in the input counts once. An empty anchor list — or one whose slugs
 * all miss the corpus — returns a well-formed empty result on the same
 * projection path. The returned `edges` are re-oriented to the true
 * `prerequisiteFor` direction.
 *
 * @param unitSlugs - Anchor unit slugs (corpus keys, not free text).
 * @param depth - Traversal depth; defaults to {@link DEFAULT_PREREQUISITE_DEPTH}.
 *   A depth outside `[0, MAX_PREREQUISITE_DEPTH]` returns `SubgraphDepthExceeded`.
 * @returns The bounded prior-knowledge subgraph, or a `SubgraphError`.
 */
export function priorKnowledgeSubgraph(
  unitSlugs: readonly string[],
  depth: number = DEFAULT_PREREQUISITE_DEPTH,
): Result<PriorKnowledgeSubgraph, SubgraphError<GraphCorpusNodeId>> {
  // Anchors are a set: a slug repeated in the input is one anchor. De-duplicate
  // resolved ids and unknown slugs so the reported fields carry each once.
  const resolvedAnchors: GraphCorpusNodeId[] = [];
  const unknownAnchors: string[] = [];
  const seenResolved = new Set<GraphCorpusNodeId>();
  const seenUnknown = new Set<string>();
  for (const unitSlug of unitSlugs) {
    const nodeId = toUnitNodeId(unitSlug);
    if (corpusNodeIds.has(nodeId)) {
      if (!seenResolved.has(nodeId)) {
        seenResolved.add(nodeId);
        resolvedAnchors.push(nodeId);
      }
    } else if (!seenUnknown.has(unitSlug)) {
      seenUnknown.add(unitSlug);
      unknownAnchors.push(unitSlug);
    }
  }

  const result = priorKnowledgeView.subgraph({ rootIds: resolvedAnchors, depth });
  if (!result.ok) {
    // Only `SubgraphDepthExceeded` can fire — every resolved anchor is a known
    // node (and an empty anchor list resolves no missing root), so
    // `SubgraphRootNotFound` is unreachable here. Depth validates before root
    // resolution, so the error contract holds even when no anchors resolve.
    return err(result.error);
  }

  const edges: readonly GraphCorpusEdge[] = result.value.edges.map((edge) => ({
    source: edge.target,
    type: 'prerequisiteFor',
    target: edge.source,
  }));
  return ok({ nodes: result.value.nodes, edges, resolvedAnchors, unknownAnchors, depth });
}
