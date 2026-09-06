/**
 * Misconception projection (G2 c2) — the module-load index over the
 * thread→unit→lesson→misconception chain of the one curriculum graph corpus.
 *
 * The chain is a fixed three-hop fan-out (never a variable-depth traversal),
 * so the misconception view is a direct projection over the per-view edge
 * subsets rather than a BFS: this module builds per-kind node indexes plus the
 * chain adjacency once at module load — per-view selection over the corpus,
 * the settled substrate mechanism.
 *
 * Which of the three hops carry order, and which do not (MCP-682):
 *
 * - **thread→unit** and **unit→lesson** are ORDERED. Both come from the
 *   corpus's ordered sections (`sequences`, `unitLessonRuns`), never from the
 *   edge set.
 * - **lesson→misconception** is a SET. It stays an id-sorted edge group: a
 *   lesson's two misconceptions have no sequence, so none is claimed or
 *   served.
 *
 * This overturns the module's original stance, that "thread-sequence order is
 * G3's re-projection of the ordering authority and intentionally not consumed
 * here" and that a unit's lessons are a set. That stance mistook the corpus's
 * `edges` array for an ordering authority it never was: the array is sorted by
 * (type, source, target) for a deterministic artefact, so reading order off it
 * served the ALPHABET as though it were curriculum. Measured on the 2026-09-03
 * snapshot, that cost all 160 threads their progression — units ordered by
 * slug rather than by year and authored position — and additionally made the
 * 21 threads that span subjects interleave those subjects within a page. On
 * the lesson axis it put 46% of all within-programme lesson pairs in the wrong
 * relative order. The chain edges remain in the corpus for the property-graph
 * model; they are simply not where order lives.
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

/**
 * A thread's units in Oak's curriculum order: each of the thread's per-subject
 * sequences in the corpus's emission order, concatenated. A unit revisited at
 * two years appears once, at its first placement, so `totalUnits` counts
 * distinct units and a window can never serve the same unit twice.
 */
function buildUnitsByThreadId(
  unitsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusUnitNode>,
): ReadonlyMap<GraphCorpusNodeId, readonly GraphCorpusUnitNode[]> {
  const byThread = new Map<GraphCorpusNodeId, GraphCorpusUnitNode[]>();
  const seen = new Map<GraphCorpusNodeId, Set<GraphCorpusNodeId>>();
  for (const sequence of graphCorpus.sequences) {
    const run = byThread.get(sequence.threadId) ?? [];
    const placed = seen.get(sequence.threadId) ?? new Set<GraphCorpusNodeId>();
    for (const placement of sequence.placements) {
      if (placed.has(placement.unitId)) {
        continue;
      }
      const unit = unitsById.get(placement.unitId);
      if (unit === undefined) {
        // The corpus's zero-dangling invariant makes this unreachable; fail
        // loudly rather than silently shortening a thread's window.
        throw new Error(
          `graph corpus integrity breach: sequence ${sequence.threadId} places unknown unit ${placement.unitId}`,
        );
      }
      placed.add(placement.unitId);
      run.push(unit);
    }
    byThread.set(sequence.threadId, run);
    seen.set(sequence.threadId, placed);
  }
  return byThread;
}

/**
 * A unit's lessons in Oak's authored teaching order, from the corpus
 * `unitLessonRuns` section. A run's membership is the unit's `containsLesson`
 * edge set by construction, so this index covers exactly the lessons the edge
 * traversal would have found — only the order differs.
 */
function buildLessonsByUnitId(
  lessonsById: ReadonlyMap<GraphCorpusNodeId, GraphCorpusLessonNode>,
): ReadonlyMap<GraphCorpusNodeId, readonly GraphCorpusLessonNode[]> {
  const byUnit = new Map<GraphCorpusNodeId, GraphCorpusLessonNode[]>();
  for (const run of graphCorpus.unitLessonRuns) {
    const lessons: GraphCorpusLessonNode[] = [];
    for (const lessonId of run.lessonIds) {
      const lesson = lessonsById.get(lessonId);
      if (lesson === undefined) {
        // The corpus's zero-dangling invariant makes this unreachable; fail
        // loudly rather than silently shortening a unit's lesson list.
        throw new Error(
          `graph corpus integrity breach: unit lesson run ${run.unitId} places unknown lesson ${lessonId}`,
        );
      }
      lessons.push(lesson);
    }
    byUnit.set(run.unitId, lessons);
  }
  return byUnit;
}

/**
 * The module-load projection: per-kind node indexes, the two ordered-section
 * indexes (unit → lessons, thread → units), and the one set-valued edge
 * adjacency (lesson → misconceptions).
 */
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
 * the edge-type parameter to the one set-valued chain type this view still
 * traverses as an edge group. Unit→lesson and thread→unit are ordered, so they
 * come from the corpus's ordered sections instead.
 */
function buildAdjacency<TNode extends { readonly id: GraphCorpusNodeId }>(
  edgeType: 'addressesMisconception',
  targetsById: ReadonlyMap<GraphCorpusNodeId, TNode>,
): ReadonlyMap<GraphCorpusNodeId, readonly TNode[]> {
  return buildEdgeAdjacency(edgeType, targetsById);
}

/**
 * Builds the misconception projection over the one graph corpus: per-kind node
 * indexes, the two ordered-section indexes, and the misconception adjacency
 * map. Exported for the startup-cost
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
    lessonsByUnitId: buildLessonsByUnitId(lessonsById),
    unitsByThreadId: buildUnitsByThreadId(unitsById),
  };
}
