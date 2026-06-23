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
 * freshness obligation): the full corpus `source` (organisation, url, and the
 * named research authors — all attribution data) + `licence` + `caveats`. Source
 * names AND urls pass through whole; free access to sources is a trust
 * requirement, so nothing is filtered. The README is the primary attribution
 * surface; this carries the same attribution on every response. The licence's
 * attribution obligation is met by the source plus each strand's `eef_url`.
 * `data_version` / `last_updated` are excluded — internal debugging metadata
 * (D1 V2), not governance or freshness semantics.
 */
export interface EefEvidenceProvenance {
  readonly source: CorpusMeta['source'];
  readonly licence: CorpusMeta['licence'];
  readonly caveats: readonly CorpusCaveat[];
}

/**
 * What KIND of answer an envelope is, so the consuming agent can tell a result
 * that is complete for the request from a non-exhaustive corpus-curated subset.
 * This is information ABOUT the result, never a recommendation (ADR-194):
 *
 * - `'strand-lookup'` — exactly the strand(s) the query named by id (an
 *   `inspectStrand`, or an `evidenceForMove` with `strandIds` and no axis
 *   selector). The envelope is complete for that request.
 * - `'context-subset'` — the strands the corpus tags for the requested axis
 *   (`phase` / `keyStage` / `priority`). This is a **non-exhaustive** subset:
 *   axis tags are partial curation, so a missing tag is not evidence of
 *   inapplicability. Use the strand index in `eef://interpretation` for the full
 *   corpus, and `frontier` for adjacent strands.
 */
export type EefAnswerType = 'strand-lookup' | 'context-subset';

/**
 * The uniform EEF evidence envelope: a self-describing {@link EefAnswerType},
 * the member strands (full {@link EefStrand} by default, or the headline
 * projection — `EefStrandHeadline`, see `eef-headline-view.ts` — for the bounded
 * headline view), the member-induced
 * `related_strand` edges (edges whose BOTH endpoints are members — so a
 * single-member envelope, e.g. `inspectStrand`, carries an empty `edges` list
 * and surfaces the related strands only via `frontier`; `edges` is non-empty
 * only when an axis query co-selects related strands as members), the
 * binding-derived frontier (related strands outside the member set), and the
 * once-per-envelope provenance.
 *
 * `TMember` defaults to {@link EefStrand} (the full strand); the headline view
 * binds it to {@link EefStrandHeadline}. `answerType`, `edges`, `frontier`, and
 * `provenance` are identical across the two depths — only the member shape
 * differs.
 *
 * Declared as a strict `interface` — every field exact, NO index signature and
 * NO `unknown`/`Record` fallback. (The MCP SDK's structured-content carrier is
 * `Record<string, unknown>`; the strict envelope crosses into that vendor carrier
 * at a single egress membrane in the MCP consumer — a fresh-object spread, with no
 * cast, no index signature, and no disabled check — per ADR-193.)
 */
export interface EefEvidenceEnvelope<TMember = EefStrand> {
  readonly answerType: EefAnswerType;
  readonly members: readonly TMember[];
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
  // Whole-object pass-through, never a field-by-field rebuild: a rebuild silently
  // strips any field it does not re-list (it had already dropped `url` and the
  // authors). Source attribution — organisation, url, and named authors — is
  // attribution data carried in full; free access to sources is a trust
  // requirement.
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

/** Wrap a subgraph result's nodes + edges in the evidence envelope, tagged with its answer type. */
function buildEnvelope(
  answerType: EefAnswerType,
  nodes: readonly EefStrand[],
  edges: readonly GraphEdge<EefStrandId, 'related_strand'>[],
): EefEvidenceEnvelope {
  const memberIds = new Set<EefStrandId>(nodes.map((strand) => strand.id));
  return {
    answerType,
    members: nodes,
    edges,
    frontier: computeFrontier(memberIds),
    provenance: eefProvenance,
  };
}

/**
 * Run a depth-0 subgraph over a root set and wrap it in the envelope, tagged
 * with the {@link EefAnswerType} the caller's query shape determines. An empty
 * root set yields an empty envelope (honest insufficiency). A subgraph failure
 * is unreachable here — every {@link EefStrandId} is a graph node and depth 0 is
 * within `maxDepth` — so it throws as a broken invariant rather than a Result
 * (the unknown-key failure is handled at the request boundary, D6).
 */
function subgraphEnvelope(
  answerType: EefAnswerType,
  rootIds: readonly EefStrandId[],
): EefEvidenceEnvelope {
  const result = eefStrandGraph.subgraph({ rootIds, depth: 0 });
  if (!result.ok) {
    throw new Error(
      `subgraphEnvelope: unexpected subgraph failure (${result.error.kind}); every EefStrandId is a graph node and depth 0 is within bounds`,
    );
  }
  return buildEnvelope(answerType, result.value.nodes, result.value.edges);
}

/**
 * Total by-id evidence lookup: the strand as the sole member, its
 * `related_strand` targets as the frontier, and provenance. Equivalent to
 * `evidenceForMove({ strandIds: [strandId] })`.
 */
export function inspectStrand(strandId: EefStrandId): EefEvidenceEnvelope {
  return subgraphEnvelope('strand-lookup', [strandId]);
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
 * An axis selector (`phase` / `keyStage` / `priority`) makes the result a
 * non-exhaustive corpus-curated `'context-subset'`; a query that names only
 * explicit `strandIds` (or none at all — `{}` or an empty `strandIds: []`) is a
 * `'strand-lookup'` complete for the request. So an empty selector set yields an
 * empty `'strand-lookup'` envelope (complete for nothing requested, not a curated
 * subset), and `evidenceForMove({ strandIds: [id] })` stays identical to
 * `inspectStrand(id)` (D4 structural overlap).
 */
function answerTypeFor(selectors: EvidenceForMoveSelectors): EefAnswerType {
  const hasAxis =
    selectors.phase !== undefined ||
    selectors.keyStage !== undefined ||
    selectors.priority !== undefined;
  return hasAxis ? 'context-subset' : 'strand-lookup';
}

/**
 * Axis/explicit-selector evidence query: resolve the selectors to a root set
 * (via `school_context_relevance` for the axes), then return the envelope tagged
 * with its {@link EefAnswerType}. No server-side move→strand mapping exists
 * (Decision 10); the agent chooses the selectors. An empty selector set returns
 * an empty envelope.
 */
export function evidenceForMove(selectors: EvidenceForMoveSelectors): EefEvidenceEnvelope {
  return subgraphEnvelope(answerTypeFor(selectors), resolveRoots(selectors));
}
