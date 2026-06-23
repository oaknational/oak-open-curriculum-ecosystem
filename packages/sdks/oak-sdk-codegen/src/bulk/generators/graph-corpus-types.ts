/**
 * Graph-corpus emitted types (G1a + G2 + G4b) — the single source of truth.
 *
 * @remarks
 * These interfaces define the emitted graph-corpus dataset: kind-discriminated
 * nodes with kind-qualified ids, the typed edge vocabulary, integrity and
 * dedup provenance, stats, and the generator input. The emitted `types.ts`
 * re-exports them (via the generator module), so no hand-maintained type runs
 * parallel to the generated corpus (Decision A / ADR-031).
 */
import { normaliseKeyword } from '../extractors/keyword-extractor.js';
import type {
  ExtractedKeyword,
  ExtractedLesson,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
} from '../extractors/index.js';
import type { ExtractedThread } from '../extractors/thread-extractor.js';

/** A kind-qualified unit node id. */
export type GraphCorpusUnitNodeId = `unit:${string}`;
/** A kind-qualified thread node id. */
export type GraphCorpusThreadNodeId = `thread:${string}`;
/** A kind-qualified lesson node id. */
export type GraphCorpusLessonNodeId = `lesson:${string}`;
/** A kind-qualified misconception node id (content-hash mint). */
export type GraphCorpusMisconceptionNodeId = `misconception:${string}`;
/** A kind-qualified keyword node id (normalised-term mint, lc+trim). */
export type GraphCorpusKeywordNodeId = `keyword:${string}`;

/** A kind-qualified graph-corpus node id. */
export type GraphCorpusNodeId =
  | GraphCorpusUnitNodeId
  | GraphCorpusThreadNodeId
  | GraphCorpusLessonNodeId
  | GraphCorpusMisconceptionNodeId
  | GraphCorpusKeywordNodeId;

/** A unit node in the graph corpus. */
export interface GraphCorpusUnitNode {
  readonly kind: 'unit';
  readonly id: GraphCorpusUnitNodeId;
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly subject: string;
  readonly keyStage: string;
  readonly year: number | undefined;
  readonly priorKnowledge: readonly string[];
  readonly threadSlugs: readonly string[];
}

/** A thread node in the graph corpus. */
export interface GraphCorpusThreadNode {
  readonly kind: 'thread';
  readonly id: GraphCorpusThreadNodeId;
  readonly threadSlug: string;
  readonly title: string;
  readonly firstYear: number | undefined;
  readonly lastYear: number | undefined;
}

/** A lesson node in the graph corpus (placement is edge-modelled, not a field). */
export interface GraphCorpusLessonNode {
  readonly kind: 'lesson';
  readonly id: GraphCorpusLessonNodeId;
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  readonly subject: string;
  readonly keyStage: string;
}

/** A misconception node in the graph corpus (raw display text; id is the content-hash mint). */
export interface GraphCorpusMisconceptionNode {
  readonly kind: 'misconception';
  readonly id: GraphCorpusMisconceptionNodeId;
  readonly misconception: string;
  readonly response: string;
}

/**
 * A keyword node in the graph corpus (G4b).
 *
 * @remarks
 * Lean by design: richness arrives via `containsKeyword` edge traversal
 * (keyword→lesson→unit/thread/misconception) on the one-graph substrate,
 * never via a fat node. `term` carries the first-occurrence display casing;
 * the normalised form lives in the id. `frequency` is the unique-lesson
 * count; `firstYear` is key-stage-derived (coarse), not placement-year.
 */
export interface GraphCorpusKeywordNode {
  readonly kind: 'keyword';
  readonly id: GraphCorpusKeywordNodeId;
  readonly term: string;
  readonly description: string;
  readonly frequency: number;
  readonly firstYear: number;
  readonly subjects: readonly string[];
}

/** Any node in the graph corpus (discriminated on `kind`). */
export type GraphCorpusNode =
  | GraphCorpusUnitNode
  | GraphCorpusThreadNode
  | GraphCorpusLessonNode
  | GraphCorpusMisconceptionNode
  | GraphCorpusKeywordNode;

/** The typed edge vocabulary of the corpus. */
export type GraphCorpusEdgeType =
  | 'prerequisiteFor'
  | 'containsUnit'
  | 'containsLesson'
  | 'addressesMisconception'
  | 'containsKeyword';

/** A typed directed edge between corpus nodes (graph-core `GraphEdge` shape). */
export interface GraphCorpusEdge {
  readonly source: GraphCorpusNodeId;
  readonly type: GraphCorpusEdgeType;
  readonly target: GraphCorpusNodeId;
}

/** Provenance for an edge dropped because an endpoint could not be resolved. */
export interface GraphCorpusDroppedEdge {
  readonly source: GraphCorpusNodeId;
  readonly target: GraphCorpusNodeId;
  readonly type: GraphCorpusEdgeType;
  readonly reason: string;
}

/**
 * Provenance for a misconception occurrence dropped by the keep-first rule
 * (same lesson, same normalised text, different response).
 */
export interface GraphCorpusDroppedDuplicate {
  readonly lessonSlug: string;
  readonly misconception: string;
  readonly keptResponse: string;
  readonly droppedResponse: string;
  readonly reason: string;
}

/**
 * One unit's placement in a thread's year-ordered sequence (G3).
 *
 * @remarks
 * The bulk exports no authoritative within-thread unit ordering
 * (`unit.threads[].order` is the THREAD's display index, constant per
 * thread); the progression axis is the placement's teaching YEAR — the axis
 * the thread concept itself advertises (`firstYear`→`lastYear`). Ordering
 * cannot ride the attribute-less corpus edges, so placements are emitted as
 * the ordered projection's source. A unit may recur in one sequence at
 * distinct years (a revisited concept); within one year the order is not
 * curricular and ties break deterministically by unitId.
 */
export interface GraphCorpusSequencePlacement {
  readonly unitId: GraphCorpusUnitNodeId;
  readonly year: number | undefined;
}

/** One thread's year-ordered unit sequence (year ascending, year-less last, then unitId). */
export interface GraphCorpusSequence {
  readonly threadId: GraphCorpusThreadNodeId;
  readonly placements: readonly GraphCorpusSequencePlacement[];
}

/** Per-kind node counts. */
export interface GraphCorpusNodeKindCounts {
  readonly unit: number;
  readonly thread: number;
  readonly lesson: number;
  readonly misconception: number;
  readonly keyword: number;
}

/** Per-type edge counts. */
export interface GraphCorpusEdgeTypeCounts {
  readonly prerequisiteFor: number;
  readonly containsUnit: number;
  readonly containsLesson: number;
  readonly addressesMisconception: number;
  readonly containsKeyword: number;
}

/** Statistics about the graph corpus. */
export interface GraphCorpusStats {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly nodeKindCounts: GraphCorpusNodeKindCounts;
  readonly edgeTypeCounts: GraphCorpusEdgeTypeCounts;
  readonly subjectsCovered: readonly string[];
  readonly selfLoops: number;
  /** Identical (lessonSlug, normalised text) occurrences collapsed beyond the first. */
  readonly collapsedIdenticalMisconceptions: number;
  /** Identical (threadId, unitId, year) placements collapsed beyond the first. */
  readonly collapsedIdenticalPlacements: number;
  /** Identical (source, target) prerequisiteFor occurrences collapsed beyond the first. */
  readonly collapsedIdenticalPrerequisiteEdges: number;
}

/** The graph corpus: one identity space surfaced through bounded views. */
export interface GraphCorpus {
  readonly version: string;
  readonly generatedAt: string;
  readonly sourceVersion: string;
  readonly stats: GraphCorpusStats;
  readonly nodes: readonly GraphCorpusNode[];
  readonly edges: readonly GraphCorpusEdge[];
  readonly sequences: readonly GraphCorpusSequence[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
  readonly droppedDuplicates: readonly GraphCorpusDroppedDuplicate[];
  readonly seeAlso: string;
}

/** Input to {@link generateGraphCorpusData}. */
export interface GraphCorpusInput {
  readonly priorKnowledge: readonly ExtractedPriorKnowledge[];
  readonly threads: readonly ExtractedThread[];
  readonly lessons: readonly ExtractedLesson[];
  readonly misconceptions: readonly ExtractedMisconception[];
  readonly keywords: readonly ExtractedKeyword[];
  readonly sourceVersion: string;
}
/** Mints the kind-qualified id for a unit node. */
export function unitNodeId(unitSlug: string): GraphCorpusUnitNodeId {
  return `unit:${unitSlug}`;
}

/** Mints the kind-qualified id for a thread node. */
export function threadNodeId(threadSlug: string): GraphCorpusThreadNodeId {
  return `thread:${threadSlug}`;
}

/** Mints the kind-qualified id for a lesson node. */
export function lessonNodeId(lessonSlug: string): GraphCorpusLessonNodeId {
  return `lesson:${lessonSlug}`;
}

/**
 * Mints the kind-qualified id for a keyword node from the term.
 *
 * @remarks
 * Normalises internally (lc+trim via {@link normaliseKeyword}), so the mint
 * is stable for raw and already-normalised inputs alike.
 */
export function keywordNodeId(term: string): GraphCorpusKeywordNodeId {
  return `keyword:${normaliseKeyword(term)}`;
}
