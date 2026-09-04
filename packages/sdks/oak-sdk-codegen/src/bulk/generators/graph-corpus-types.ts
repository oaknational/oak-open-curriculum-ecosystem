/**
 * Graph-corpus emitted types (G1a + G2 + G4b) — the single source of truth.
 *
 * @remarks
 * The corpus's core vocabulary: kind-discriminated nodes, the typed edge
 * vocabulary, integrity and dedup provenance, stats, and the generator input.
 * Two neighbours own the rest and this module re-exports both, so consumers
 * still see one surface — node identity lives in `graph-corpus-node-ids.ts`
 * (the foundation both this module and the ordered sections build on), and
 * the ordered projections live in `graph-corpus-ordered-sections.ts`. The
 * emitted `types.ts` re-exports them (via the generator module), so no
 * hand-maintained type runs parallel to the generated corpus (Decision A /
 * ADR-031).
 */
import type {
  GraphCorpusKeywordNodeId,
  GraphCorpusLessonNodeId,
  GraphCorpusMisconceptionNodeId,
  GraphCorpusNodeId,
  GraphCorpusThreadNodeId,
  GraphCorpusUnitNodeId,
} from './graph-corpus-node-ids.js';
import type {
  GraphCorpusSequence,
  GraphCorpusUnitLessonRun,
} from './graph-corpus-ordered-sections.js';
import type {
  ExtractedKeyword,
  ExtractedLesson,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
  ExtractedUnitLessons,
} from '../extractors/index.js';
import type { ExtractedThread } from '../extractors/thread-extractor.js';

export {
  keywordNodeId,
  lessonNodeId,
  threadNodeId,
  unitNodeId,
  type GraphCorpusKeywordNodeId,
  type GraphCorpusLessonNodeId,
  type GraphCorpusMisconceptionNodeId,
  type GraphCorpusNodeId,
  type GraphCorpusThreadNodeId,
  type GraphCorpusUnitNodeId,
} from './graph-corpus-node-ids.js';

export type {
  GraphCorpusSequence,
  GraphCorpusSequencePlacement,
  GraphCorpusUnitLessonRun,
} from './graph-corpus-ordered-sections.js';

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
  /** Units whose lessons carry no authored position, so their run falls back to id order. */
  readonly unitsWithoutAuthoredLessonOrder: number;
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
  readonly unitLessonRuns: readonly GraphCorpusUnitLessonRun[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
  readonly droppedDuplicates: readonly GraphCorpusDroppedDuplicate[];
  readonly seeAlso: string;
}

/** Input to {@link generateGraphCorpusData}. */
export interface GraphCorpusInput {
  readonly priorKnowledge: readonly ExtractedPriorKnowledge[];
  readonly threads: readonly ExtractedThread[];
  readonly lessons: readonly ExtractedLesson[];
  /**
   * Per-unit lesson listings, one entry per programme variant — the authored
   * lesson order that {@link GraphCorpusUnitLessonRun} projects. Ordering only;
   * the `containsLesson` edge set is built from `lessons` and is unaffected.
   */
  readonly unitLessons: readonly ExtractedUnitLessons[];
  readonly misconceptions: readonly ExtractedMisconception[];
  readonly keywords: readonly ExtractedKeyword[];
  readonly sourceVersion: string;
}
