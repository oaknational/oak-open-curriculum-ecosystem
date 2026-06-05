/**
 * The EEF evidence binding layer — the two D3 operations over the graph-native
 * EEF view, each returning the uniform evidence envelope.
 *
 * `inspectStrand` (by-id) and `evidenceForMove` (axis/explicit selectors) both
 * resolve to a root set and delegate to a single `subgraphEnvelope` core, so the
 * `inspectStrand(id) === evidenceForMove({ strandIds: [id] })` overlap is
 * structural, not coincidental (D4). This layer consumes the view + the D2
 * corpus exports; it never reads the raw corpus (sole-ingest is `eef-graph.ts`).
 *
 * The frontier and provenance are EEF concerns and live here, not on graph-core's
 * generic `SubgraphResult` (ADR-179).
 */

import type { GraphEdge } from '@oaknational/graph-core/graph-view';

import { corpusCaveats, corpusMeta, type CorpusCaveat, type CorpusMeta } from './corpus-meta.js';
import { eefStrandGraph } from './eef-graph.js';
import {
  relatedStrandEdges,
  strandAxisIndex,
  type ObservedKeyStage,
  type ObservedPhase,
  type ObservedPriority,
  type StrandAxisValues,
} from './raw-domains.js';
import type { EefStrand, EefStrandId } from './strand-lookup.js';

/**
 * Source attribution carried once per envelope (additive teacher value, not a
 * freshness obligation): the corpus `source` (incl. the published EEF authorship
 * attribution the licence requires) + `licence` + `caveats`. `data_version` /
 * `last_updated` are deliberately excluded — internal debugging metadata (D1 V2),
 * not governance or freshness semantics.
 */
export interface EefEvidenceProvenance {
  readonly source: CorpusMeta['source'];
  readonly licence: CorpusMeta['licence'];
  readonly caveats: readonly CorpusCaveat[];
}

/**
 * The uniform EEF evidence envelope: the complete member strands, the
 * member-induced `related_strand` edges, the binding-derived frontier (related
 * strands outside the member set), and the once-per-envelope provenance.
 */
export interface EefEvidenceEnvelope {
  readonly members: readonly EefStrand[];
  readonly edges: readonly GraphEdge<EefStrandId, 'related_strand'>[];
  readonly frontier: readonly EefStrandId[];
  readonly provenance: EefEvidenceProvenance;
}

/** Axis + explicit-id selectors for {@link evidenceForMove}. */
export interface EvidenceForMoveSelectors {
  readonly strandIds?: readonly EefStrandId[];
  readonly phase?: ObservedPhase;
  readonly keyStage?: ObservedKeyStage;
  readonly priority?: ObservedPriority;
}

/** Built once: the corpus-level provenance, identical for every envelope. */
const eefProvenance: EefEvidenceProvenance = {
  source: corpusMeta.source,
  licence: corpusMeta.licence,
  caveats: corpusCaveats,
};

/**
 * Frontier = the `related_strand` edge targets of members that fall outside the
 * member set (D4). Derived from the D2 edge facts the view itself is built from.
 */
function computeFrontier(memberIds: ReadonlySet<EefStrandId>): readonly EefStrandId[] {
  const frontier = new Set<EefStrandId>();
  for (const edge of relatedStrandEdges) {
    if (memberIds.has(edge.source) && !memberIds.has(edge.target)) {
      frontier.add(edge.target);
    }
  }
  return [...frontier];
}

/** Wrap a subgraph result's nodes + edges in the evidence envelope. */
function buildEnvelope(
  nodes: readonly EefStrand[],
  edges: readonly GraphEdge<EefStrandId, 'related_strand'>[],
): EefEvidenceEnvelope {
  const memberIds = new Set<EefStrandId>(nodes.map((strand) => strand.id));
  return {
    members: nodes,
    edges,
    frontier: computeFrontier(memberIds),
    provenance: eefProvenance,
  };
}

/**
 * Run a depth-0 subgraph over a root set and wrap it in the envelope. An empty
 * root set yields an empty envelope (honest insufficiency). A subgraph failure
 * is unreachable here — every {@link EefStrandId} is a graph node and depth 0 is
 * within `maxDepth` — so it throws as a broken invariant rather than a Result
 * (the unknown-key failure is handled at the request boundary, D6).
 */
function subgraphEnvelope(rootIds: readonly EefStrandId[]): EefEvidenceEnvelope {
  const result = eefStrandGraph.subgraph({ rootIds, depth: 0 });
  if (!result.ok) {
    throw new Error(
      `subgraphEnvelope: unexpected subgraph failure (${result.error.kind}); every EefStrandId is a graph node and depth 0 is within bounds`,
    );
  }
  return buildEnvelope(result.value.nodes, result.value.edges);
}

/**
 * Total by-id evidence lookup: the strand as the sole member, its
 * `related_strand` targets as the frontier, and provenance. Equivalent to
 * `evidenceForMove({ strandIds: [strandId] })`.
 */
export function inspectStrand(strandId: EefStrandId): EefEvidenceEnvelope {
  return subgraphEnvelope([strandId]);
}

/** A strand matches iff at least one axis selector is given and every given axis selector is one of its values. */
function matchesAxis(axis: StrandAxisValues, selectors: EvidenceForMoveSelectors): boolean {
  const checks: boolean[] = [];
  if (selectors.phase !== undefined) {
    checks.push(axis.phases.includes(selectors.phase));
  }
  if (selectors.keyStage !== undefined) {
    checks.push(axis.keyStages.includes(selectors.keyStage));
  }
  if (selectors.priority !== undefined) {
    checks.push(axis.priorities.includes(selectors.priority));
  }
  return checks.length > 0 && checks.every((check) => check);
}

/** Resolve selectors to a root set: explicit `strandIds` unioned with the axis-matching strands. */
function resolveRoots(selectors: EvidenceForMoveSelectors): readonly EefStrandId[] {
  const roots = new Set<EefStrandId>(selectors.strandIds ?? []);
  for (const [strandId, axis] of strandAxisIndex) {
    if (matchesAxis(axis, selectors)) {
      roots.add(strandId);
    }
  }
  return [...roots];
}

/**
 * Axis/explicit-selector evidence query: resolve the selectors to a root set
 * (via `school_context_relevance` for the axes), then return the envelope. No
 * server-side move→strand mapping exists (Decision 10); the agent chooses the
 * selectors. An empty selector set returns an empty envelope.
 */
export function evidenceForMove(selectors: EvidenceForMoveSelectors): EefEvidenceEnvelope {
  return subgraphEnvelope(resolveRoots(selectors));
}
