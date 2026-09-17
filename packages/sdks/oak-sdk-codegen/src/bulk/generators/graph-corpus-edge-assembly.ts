/**
 * Edge-set assembly — builds every edge type and returns the corpus's
 * deterministic sorted edge array.
 *
 * @remarks
 * The sort is load-bearing for the artefact's stability contract (identical
 * output regardless of bulk-file enumeration order), and it is also the reason
 * the edge array cannot carry order: it is a SET, sorted by
 * (type, source, target). Ordered projections live in the corpus's ordered
 * sections instead — `sequences` (thread→unit) and `unitLessonRuns`
 * (unit→lesson).
 */
import {
  buildContainsLessonEdges,
  buildContainsUnitEdges,
  buildLessonAnchoredEdges,
  buildPrerequisiteEdges,
} from './graph-corpus-edges.js';
import type { KeywordBuild } from './graph-corpus-keyword-nodes.js';
import type { MisconceptionBuild } from './graph-corpus-misconception-nodes.js';
import type {
  GraphCorpusDroppedEdge,
  GraphCorpusEdge,
  GraphCorpusInput,
  GraphCorpusNodeId,
} from './graph-corpus-types.js';

/** Sorts edges by (type, source, target) for a deterministic artefact. */
function sortEdges(edges: readonly GraphCorpusEdge[]): readonly GraphCorpusEdge[] {
  return [...edges].sort(
    (a, b) =>
      a.type.localeCompare(b.type) ||
      a.source.localeCompare(b.source) ||
      a.target.localeCompare(b.target),
  );
}

/** The edge builds that carry drop provenance, plus the sorted edge set. */
interface EdgeAssembly {
  readonly edges: readonly GraphCorpusEdge[];
  readonly droppedEdges: readonly GraphCorpusDroppedEdge[];
  readonly collapsedIdenticalPrerequisiteEdges: number;
}

/** Builds every edge type and returns them in the deterministic sorted order. */
export function assembleEdges(
  input: GraphCorpusInput,
  knownUnitSlugs: ReadonlySet<string>,
  knownLessonIds: ReadonlySet<GraphCorpusNodeId>,
  misconceptionBuild: MisconceptionBuild,
  keywordBuild: KeywordBuild,
): EdgeAssembly {
  const { threads, lessons } = input;
  const prerequisite = buildPrerequisiteEdges(threads, knownUnitSlugs);
  const addresses = buildLessonAnchoredEdges(
    misconceptionBuild.edgePairs,
    'addressesMisconception',
    knownLessonIds,
  );
  const containsKeyword = buildLessonAnchoredEdges(
    keywordBuild.edgePairs,
    'containsKeyword',
    knownLessonIds,
  );
  return {
    edges: sortEdges([
      ...prerequisite.edges,
      ...buildContainsUnitEdges(threads),
      ...buildContainsLessonEdges(lessons),
      ...addresses.edges,
      ...containsKeyword.edges,
    ]),
    droppedEdges: [prerequisite, addresses, containsKeyword].flatMap((build) => build.droppedEdges),
    collapsedIdenticalPrerequisiteEdges: prerequisite.collapsedIdenticalPrerequisiteEdges,
  };
}
