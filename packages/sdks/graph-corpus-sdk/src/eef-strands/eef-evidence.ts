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
 * freshness obligation): the corpus `source` at ORGANISATION level
 * (`name` / `url` / `organisation`) + `licence` + `caveats`. The individual
 * research authors (`source.original_authors`) are deliberately NOT emitted in
 * runtime responses — personal names belong in the EEF tool documentation, not
 * in every tool result (owner decision; org no-PII instruction). The licence's
 * attribution obligation is met by the organisation-level source plus each
 * strand's `eef_url`. `data_version` / `last_updated` are likewise excluded —
 * internal debugging metadata (D1 V2), not governance or freshness semantics.
 */
export interface EefEvidenceProvenance {
  readonly source: Omit<CorpusMeta['source'], 'original_authors'>;
  readonly licence: CorpusMeta['licence'];
  readonly caveats: readonly CorpusCaveat[];
}

/**
 * The uniform EEF evidence envelope: the complete member strands, the
 * member-induced `related_strand` edges (edges whose BOTH endpoints are
 * members — so a single-member envelope, e.g. `inspectStrand`, carries an
 * empty `edges` list and surfaces the related strands only via `frontier`;
 * `edges` is non-empty only when an axis query co-selects related strands as
 * members), the binding-derived frontier (related strands outside the member
 * set), and the once-per-envelope provenance.
 *
 * Declared as a strict `interface` — every field exact, NO index signature and
 * NO `unknown`/`Record` fallback. (The MCP SDK's structured-content carrier is
 * `Record<string, unknown>`; reconciling this strict envelope with that vendor
 * carrier WITHOUT any allow-anything type, cast, or disabled check is an open
 * boundary question — see the EEF strict-type-flow plan.)
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
  // Organisation-level attribution only — individual author names are not
  // emitted in runtime responses (see EefEvidenceProvenance).
  source: {
    name: corpusMeta.source.name,
    url: corpusMeta.source.url,
    organisation: corpusMeta.source.organisation,
  },
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
  return checks.length > 0 && checks.every(Boolean);
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
