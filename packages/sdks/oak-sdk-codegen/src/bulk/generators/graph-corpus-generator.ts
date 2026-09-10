/**
 * Graph-corpus generator (G1a foundation + G2 chain re-projection + G4b
 * keywords).
 *
 * @remarks
 * Emits the bulk curriculum graph as a single corpus with one identity space
 * (plan graph-tools-value-redesign, Decision A). G1a emitted the `unit` node
 * kind and prerequisiteFor edges; G2 adds the `thread`, `lesson`, and
 * `misconception` node kinds and the thread→unit→lesson→misconception chain
 * edges (`containsUnit`, `containsLesson`, `addressesMisconception`); G4b
 * adds the `keyword` node kind and lesson→keyword `containsKeyword` edges.
 * Later deliverables add node kinds and edge types to the same corpus.
 *
 * Identity model: node ids are kind-qualified and minted at generation from
 * `(kind, source key)` — `unit:<unitSlug>`, `thread:<threadSlug>`,
 * `lesson:<lessonSlug>` — materialised as an explicit `id` field so the
 * `createGraphView` nodeId extractor returns `node.id` rather than a bare
 * slug. Misconceptions have no source key: their id is the settled
 * content-hash mint `misconception:<lessonSlug>#<hash16(normalise(text))>`
 * (`misconception-mint.ts`). Slugs remain content keys; unit↔lesson
 * placement is an edge (correct by construction for multi-unit lesson
 * placement).
 *
 * Every edge endpoint resolves to an emitted node — the corpus has zero
 * dangling endpoints by construction and builds in `createGraphView` without
 * throwing (unresolvable endpoints drop their edge into `droppedEdges`
 * provenance). Self-loops on prerequisiteFor edges (an upstream data-quality
 * signal) are preserved and counted.
 *
 * Determinism: nodes emit grouped by kind and id-sorted within each kind;
 * edges emit sorted by (type, source, target). The emitted artefact is
 * identical regardless of bulk-file enumeration order (the order-independence
 * contract — `discoverBulkFiles` is an unsorted readdir).
 *
 * The module decomposes along build seams: types and id mints in
 * `graph-corpus-types.ts`, node builders in `graph-corpus-nodes.ts`, edge
 * builders in `graph-corpus-edges.ts`; this module assembles the corpus.
 *
 * @see ADR-086 for the export pattern; ADR-031 for generation-time extraction.
 */
import { assembleEdges } from './graph-corpus-edge-assembly.js';
import { buildKeywordNodes, type KeywordBuild } from './graph-corpus-keyword-nodes.js';
import {
  buildMisconceptionNodes,
  type MisconceptionBuild,
} from './graph-corpus-misconception-nodes.js';
import { buildLessonNodes, buildThreadNodes, buildUnitNodes } from './graph-corpus-nodes.js';
import { buildSequences, type SequenceBuild } from './graph-corpus-sequences.js';
import { buildUnitLessonRuns, type UnitLessonRunBuild } from './graph-corpus-unit-lesson-runs.js';
import type {
  GraphCorpus,
  GraphCorpusDroppedEdge,
  GraphCorpusEdge,
  GraphCorpusEdgeType,
  GraphCorpusInput,
  GraphCorpusNode,
  GraphCorpusNodeId,
  GraphCorpusStats,
  GraphCorpusUnitNode,
} from './graph-corpus-types.js';

export type {
  GraphCorpus,
  GraphCorpusNode,
  GraphCorpusUnitNode,
  GraphCorpusThreadNode,
  GraphCorpusLessonNode,
  GraphCorpusMisconceptionNode,
  GraphCorpusKeywordNode,
  GraphCorpusEdge,
  GraphCorpusEdgeType,
  GraphCorpusNodeId,
  GraphCorpusUnitNodeId,
  GraphCorpusThreadNodeId,
  GraphCorpusLessonNodeId,
  GraphCorpusMisconceptionNodeId,
  GraphCorpusKeywordNodeId,
  GraphCorpusStats,
  GraphCorpusNodeKindCounts,
  GraphCorpusEdgeTypeCounts,
  GraphCorpusDroppedEdge,
  GraphCorpusDroppedDuplicate,
  GraphCorpusInput,
  GraphCorpusSequence,
  GraphCorpusSequencePlacement,
  GraphCorpusUnitLessonRun,
} from './graph-corpus-types.js';

/** Counts edges of one type. */
function countEdges(edges: readonly GraphCorpusEdge[], type: GraphCorpusEdgeType): number {
  return edges.filter((edge) => edge.type === type).length;
}

/** Collects the unique subjects present across the unit nodes. */
function collectSubjects(nodes: readonly GraphCorpusUnitNode[]): readonly string[] {
  return [...new Set(nodes.map((node) => node.subject))].sort((a, b) => a.localeCompare(b));
}

/** The assembled node and edge sets plus provenance, pre-stats. */
interface CorpusAssembly {
  readonly unitNodes: readonly GraphCorpusUnitNode[];
  readonly threadNodeCount: number;
  readonly lessonNodeCount: number;
  readonly misconceptionBuild: MisconceptionBuild;
  readonly keywordBuild: KeywordBuild;
  readonly sequenceBuild: SequenceBuild;
  readonly unitLessonRunBuild: UnitLessonRunBuild;
  readonly nodes: readonly GraphCorpusNode[];
  readonly edges: readonly GraphCorpusEdge[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
  readonly collapsedIdenticalPrerequisiteEdges: number;
}

/** Builds the full node and edge sets from the extracted input. */
function assembleCorpus(input: GraphCorpusInput): CorpusAssembly {
  const { priorKnowledge, threads, lessons, unitLessons, misconceptions, keywords } = input;
  const unitNodes = buildUnitNodes(priorKnowledge, threads, lessons);
  const threadNodes = buildThreadNodes(threads);
  const lessonNodes = buildLessonNodes(lessons);
  const misconceptionBuild = buildMisconceptionNodes(misconceptions);
  const keywordBuild = buildKeywordNodes(keywords);

  const edgeAssembly = assembleEdges(
    input,
    new Set(unitNodes.map((node) => node.unitSlug)),
    new Set<GraphCorpusNodeId>(lessonNodes.map((node) => node.id)),
    misconceptionBuild,
    keywordBuild,
  );
  const { edges } = edgeAssembly;

  return {
    unitNodes,
    threadNodeCount: threadNodes.length,
    lessonNodeCount: lessonNodes.length,
    misconceptionBuild,
    keywordBuild,
    sequenceBuild: buildSequences(threads),
    // Built FROM the edge set, so a run's membership is the edge set's by
    // construction; `unitLessons` supplies order only.
    unitLessonRunBuild: buildUnitLessonRuns(edges, unitLessons),
    nodes: [
      ...unitNodes,
      ...threadNodes,
      ...lessonNodes,
      ...misconceptionBuild.nodes,
      ...keywordBuild.nodes,
    ],
    edges,
    droppedEdges: edgeAssembly.droppedEdges,
    collapsedIdenticalPrerequisiteEdges: edgeAssembly.collapsedIdenticalPrerequisiteEdges,
  };
}

/** Computes the corpus stats from an assembly. */
function buildStats(assembly: CorpusAssembly): GraphCorpusStats {
  const { unitNodes, edges } = assembly;
  const selfLoops = edges.filter(
    (edge) => edge.type === 'prerequisiteFor' && edge.source === edge.target,
  ).length;
  return {
    totalNodes: assembly.nodes.length,
    totalEdges: edges.length,
    nodeKindCounts: {
      unit: unitNodes.length,
      thread: assembly.threadNodeCount,
      lesson: assembly.lessonNodeCount,
      misconception: assembly.misconceptionBuild.nodes.length,
      keyword: assembly.keywordBuild.nodes.length,
    },
    edgeTypeCounts: {
      prerequisiteFor: countEdges(edges, 'prerequisiteFor'),
      containsUnit: countEdges(edges, 'containsUnit'),
      containsLesson: countEdges(edges, 'containsLesson'),
      addressesMisconception: countEdges(edges, 'addressesMisconception'),
      containsKeyword: countEdges(edges, 'containsKeyword'),
    },
    subjectsCovered: collectSubjects(unitNodes),
    selfLoops,
    collapsedIdenticalMisconceptions: assembly.misconceptionBuild.collapsedIdentical,
    collapsedIdenticalPlacements: assembly.sequenceBuild.collapsedIdenticalPlacements,
    collapsedIdenticalPrerequisiteEdges: assembly.collapsedIdenticalPrerequisiteEdges,
    unitsWithoutAuthoredLessonOrder: assembly.unitLessonRunBuild.unitsWithoutAuthoredLessonOrder,
  };
}

/**
 * Generates the graph corpus from extracted bulk data: unit, thread, lesson,
 * misconception, and keyword nodes with materialised kind-qualified ids, and
 * the prerequisiteFor + thread→unit→lesson→\{misconception, keyword\} chain
 * edges, with zero dangling endpoints (every edge endpoint resolves to a
 * node).
 *
 * @param input - Extracted bulk data and the source version identifier
 * @returns The graph corpus (`droppedEdges`/`droppedDuplicates` empty in
 *   practice; identical-duplicate collapses surface as the
 *   `stats.collapsedIdentical*` scalar counts, never as dropped entries)
 */
export function generateGraphCorpusData(input: GraphCorpusInput): GraphCorpus {
  const assembly = assembleCorpus(input);
  return {
    version: '1.5.0',
    generatedAt: new Date().toISOString(),
    sourceVersion: input.sourceVersion,
    stats: buildStats(assembly),
    nodes: assembly.nodes,
    edges: assembly.edges,
    sequences: assembly.sequenceBuild.sequences,
    unitLessonRuns: assembly.unitLessonRunBuild.runs,
    droppedEdges: assembly.droppedEdges,
    droppedDuplicates: assembly.misconceptionBuild.droppedDuplicates,
    seeAlso:
      'One bulk curriculum graph surfaced as bounded views. Use the prior-knowledge view ' +
      'for "what comes before" queries; use the misconception view for the ' +
      'thread→unit→lesson→misconception chain; use the thread-progressions view ' +
      '(sequences) for ordered learning paths; read unitLessonRuns for a unit’s ' +
      'lessons in Oak’s authored teaching order; use the keyword view for bounded ' +
      'frequency-ranked vocabulary anchored to lessons.',
  };
}
