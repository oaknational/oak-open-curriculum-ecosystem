/**
 * Misconception projection (G2 c2) — the module-load index over the
 * thread→unit→lesson→misconception chain of the one curriculum graph corpus.
 *
 * The chain is a fixed three-hop fan-out (never a variable-depth traversal),
 * so the misconception view is a direct projection over the per-view edge
 * subsets rather than a BFS: this module builds per-kind node indexes plus the
 * three chain adjacency maps (`containsUnit`, `containsLesson`,
 * `addressesMisconception`) once at module load — per-view selection over the
 * corpus, the settled substrate mechanism. Adjacency groups are id-sorted, the
 * corpus's own deterministic emission order (pedagogical thread-sequence order
 * is G3's re-projection of the ordering authority and intentionally not
 * consumed here).
 */

import {
  graphCorpus,
  type GraphCorpusLessonNode,
  type GraphCorpusMisconceptionNode,
  type GraphCorpusNodeId,
  type GraphCorpusThreadNode,
  type GraphCorpusUnitNode,
} from '@oaknational/sdk-codegen/graph-corpus';

import { buildEdgeAdjacency } from './projection-helpers.js';

/** The module-load projection: per-kind node indexes plus chain adjacency, all id-sorted. */
export interface CurriculumMisconceptionProjection {
  readonly lessonsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusLessonNode>;
  readonly unitsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusUnitNode>;
  readonly threadsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusThreadNode>;
  readonly misconceptionsByLessonId: ReadonlyMap<
    GraphCorpusNodeId,
    readonly GraphCorpusMisconceptionNode[]
  >;
  readonly lessonsByUnitId: ReadonlyMap<GraphCorpusNodeId, readonly GraphCorpusLessonNode[]>;
  readonly unitsByThreadId: ReadonlyMap<GraphCorpusNodeId, readonly GraphCorpusUnitNode[]>;
}

/**
 * Groups resolved target nodes per source id for one CHAIN edge type — the
 * shared traversal body lives in `projection-helpers`; this wrapper narrows
 * the edge-type parameter to the three chain types this view traverses.
 */
function buildAdjacency<TNode extends { readonly id: GraphCorpusNodeId }>(
  edgeType: 'containsUnit' | 'containsLesson' | 'addressesMisconception',
  targetsById: ReadonlyMap<GraphCorpusNodeId, TNode>,
): ReadonlyMap<GraphCorpusNodeId, readonly TNode[]> {
  return buildEdgeAdjacency(edgeType, targetsById);
}

/**
 * Builds the misconception projection over the one graph corpus: per-kind node
 * indexes plus the three chain adjacency maps. Exported for the startup-cost
 * proof; runtime consumers use the view module's module-load singleton.
 */
export function buildCurriculumMisconceptionProjection(): CurriculumMisconceptionProjection {
  const lessonsById = new Map<GraphCorpusNodeId, GraphCorpusLessonNode>();
  const unitsById = new Map<GraphCorpusNodeId, GraphCorpusUnitNode>();
  const threadsById = new Map<GraphCorpusNodeId, GraphCorpusThreadNode>();
  const misconceptionsById = new Map<GraphCorpusNodeId, GraphCorpusMisconceptionNode>();
  for (const node of graphCorpus.nodes) {
    if (node.kind === 'lesson') {
      lessonsById.set(node.id, node);
    } else if (node.kind === 'unit') {
      unitsById.set(node.id, node);
    } else if (node.kind === 'thread') {
      threadsById.set(node.id, node);
    } else if (node.kind === 'misconception') {
      misconceptionsById.set(node.id, node);
    } else if (node.kind === 'keyword') {
      // Keyword nodes are deliberately outside the misconception chain; the
      // keyword view owns them.
    } else {
      // Exhaustiveness anchor: a new corpus node kind fails compilation here
      // instead of silently joining the wrong index.
      const unhandled: never = node;
      throw new Error(`graph corpus integrity breach: unhandled node ${JSON.stringify(unhandled)}`);
    }
  }
  return {
    lessonsById,
    unitsById,
    threadsById,
    misconceptionsByLessonId: buildAdjacency('addressesMisconception', misconceptionsById),
    lessonsByUnitId: buildAdjacency('containsLesson', lessonsById),
    unitsByThreadId: buildAdjacency('containsUnit', unitsById),
  };
}
