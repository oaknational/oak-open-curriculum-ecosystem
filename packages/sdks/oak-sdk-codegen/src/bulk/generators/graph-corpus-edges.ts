/**
 * Graph-corpus edge builders (G1a + G2; prerequisiteFor re-derived on the
 * year axis at the G3 follow-on).
 *
 * @remarks
 * Builds the typed edge sets: `prerequisiteFor` from consecutive
 * year-ordered thread pairs (with dropped-edge provenance for unresolvable
 * endpoints), `containsUnit` (thread→unit), and `containsLesson`
 * (unit→lesson placement). All three deduplicate per (source, target) pair.
 * `prerequisiteFor` deduplicated at emission since 2026-06-11: identical
 * `{source, type, target}` triples recurring when threads share adjacency
 * carry no decodable signal in the emitted shape (multiplicity-as-signal
 * refuted — eef-revalidation report 2026-06-11 §2); occurrences collapsed
 * beyond the first are surfaced as
 * `stats.collapsedIdenticalPrerequisiteEdges`.
 */
import type { ExtractedLesson } from '../extractors/index.js';
import type { ExtractedThread, ThreadUnit } from '../extractors/thread-extractor.js';

import { comparePlacements } from './graph-corpus-sequences.js';
import {
  lessonNodeId,
  threadNodeId,
  unitNodeId,
  type GraphCorpusDroppedEdge,
  type GraphCorpusEdge,
  type GraphCorpusEdgeType,
  type GraphCorpusLessonNodeId,
  type GraphCorpusNodeId,
} from './graph-corpus-types.js';

/** A resolved edge set plus dropped-edge provenance. */
export interface LessonAnchoredEdges {
  readonly edges: readonly GraphCorpusEdge[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
}

/**
 * Resolves lesson-anchored `(lesson, target)` pairs into edges of one type,
 * dropping any whose lesson is unknown (fail-loud provenance — the corpus
 * must construct in `createGraphView` with zero dangling endpoints).
 */
export function buildLessonAnchoredEdges(
  edgePairs: readonly (readonly [GraphCorpusLessonNodeId, GraphCorpusNodeId])[],
  type: GraphCorpusEdgeType,
  knownLessonIds: ReadonlySet<GraphCorpusNodeId>,
): LessonAnchoredEdges {
  const edges: GraphCorpusEdge[] = [];
  const droppedEdges: GraphCorpusDroppedEdge[] = [];
  for (const [source, target] of edgePairs) {
    if (knownLessonIds.has(source)) {
      edges.push({ source, type, target });
    } else {
      droppedEdges.push({
        source,
        target,
        type,
        reason: `endpoint "${source}" is not resolvable to a bulk lesson node`,
      });
    }
  }
  return { edges, droppedEdges };
}

/**
 * Consecutive (from, to) unit pairs along each thread's year ordering.
 *
 * @remarks
 * Units sort by the {@link comparePlacements} total order — `(year, unitId)`,
 * year-less last — shared with the sequence builder, so chains and sequences
 * carry ONE ordering basis and the derived chain never depends on placement
 * encounter order. The bulk's `unit.threads[].order` is the THREAD's display
 * index (constant per thread) and carries no within-thread ordering; the
 * teaching year is the progression axis. Same-year units still chain (count
 * preservation) in unitId order — a stated-arbitrary tie-break, not a
 * pedagogical claim; within one year the order is not curricular.
 *
 * The RELATION is synthesised too, not only its tie-break: adjacency along a
 * thread's year axis is not a recorded prerequisite. MCP-671 (2026-09-03)
 * stopped serving these edges for that reason — `get-prior-knowledge-graph`
 * serves each unit's stated prior knowledge instead. The edges are still
 * emitted and nothing consumes them; do not read them as curricular
 * dependency. See ADR-195's MCP-671 amendment.
 */
function threadOrderingPairs(
  threads: readonly ExtractedThread[],
): readonly (readonly [ThreadUnit, ThreadUnit])[] {
  const pairs: (readonly [ThreadUnit, ThreadUnit])[] = [];
  for (const thread of threads) {
    const ordered = [...thread.units].sort((a, b) =>
      comparePlacements(
        { unitId: unitNodeId(a.unitSlug), year: a.year },
        { unitId: unitNodeId(b.unitSlug), year: b.year },
      ),
    );
    for (let i = 0; i < ordered.length - 1; i += 1) {
      const from = ordered[i];
      const to = ordered[i + 1];
      if (from && to) {
        pairs.push([from, to]);
      }
    }
  }
  return pairs;
}

/** The resolved edge set plus the provenance of any dropped edges. */
export interface ResolvedEdges {
  readonly edges: readonly GraphCorpusEdge[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
}

/** {@link ResolvedEdges} plus the count of identical pairs collapsed at emission. */
export interface PrerequisiteEdgesBuild extends ResolvedEdges {
  /** Identical (source, target) occurrences collapsed beyond the first. */
  readonly collapsedIdenticalPrerequisiteEdges: number;
}

/**
 * Resolves thread-ordering pairs into prerequisiteFor edges, dropping any
 * with an unknown endpoint and collapsing identical (source, target) pairs
 * beyond their first occurrence (the collapse count is surfaced for stats).
 */
export function buildPrerequisiteEdges(
  threads: readonly ExtractedThread[],
  knownUnitSlugs: ReadonlySet<string>,
): PrerequisiteEdgesBuild {
  const seen = new Set<string>();
  let collapsedIdenticalPrerequisiteEdges = 0;
  const edges: GraphCorpusEdge[] = [];
  const droppedEdges: GraphCorpusDroppedEdge[] = [];
  for (const [from, to] of threadOrderingPairs(threads)) {
    const source = unitNodeId(from.unitSlug);
    const target = unitNodeId(to.unitSlug);
    if (knownUnitSlugs.has(from.unitSlug) && knownUnitSlugs.has(to.unitSlug)) {
      const key = `${source}\u001f${target}`;
      if (seen.has(key)) {
        collapsedIdenticalPrerequisiteEdges += 1;
        continue;
      }
      seen.add(key);
      edges.push({ source, type: 'prerequisiteFor', target });
    } else {
      const missing = knownUnitSlugs.has(from.unitSlug) ? to.unitSlug : from.unitSlug;
      droppedEdges.push({
        source,
        target,
        type: 'prerequisiteFor',
        reason: `endpoint "${missing}" is not resolvable to a bulk unit node`,
      });
    }
  }
  return { edges, droppedEdges, collapsedIdenticalPrerequisiteEdges };
}

/** Builds thread→unit containsUnit edges (deduplicated per thread/unit pair). */
export function buildContainsUnitEdges(
  threads: readonly ExtractedThread[],
): readonly GraphCorpusEdge[] {
  const seen = new Set<string>();
  const edges: GraphCorpusEdge[] = [];
  for (const thread of threads) {
    for (const unit of thread.units) {
      const key = `${thread.slug}\u001f${unit.unitSlug}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      edges.push({
        source: threadNodeId(thread.slug),
        type: 'containsUnit',
        target: unitNodeId(unit.unitSlug),
      });
    }
  }
  return edges;
}

/** Builds unit→lesson containsLesson placement edges (deduplicated per unit/lesson pair). */
export function buildContainsLessonEdges(
  lessons: readonly ExtractedLesson[],
): readonly GraphCorpusEdge[] {
  const seen = new Set<string>();
  const edges: GraphCorpusEdge[] = [];
  for (const lesson of lessons) {
    const key = `${lesson.unitSlug}\u001f${lesson.lessonSlug}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    edges.push({
      source: unitNodeId(lesson.unitSlug),
      type: 'containsLesson',
      target: lessonNodeId(lesson.lessonSlug),
    });
  }
  return edges;
}
