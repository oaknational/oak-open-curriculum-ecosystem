/**
 * The bounded headline view over the EEF evidence bindings.
 *
 * `evidenceForMoveHeadlines` runs the same axis/explicit query as
 * {@link evidenceForMove} but projects each member to its
 * {@link EefStrandHeadline} (identity, the impact-for-cost headline metrics,
 * tags, and the EEF page), leaving `answerType`, `edges`, `frontier`, and
 * `provenance` unchanged. It is a separate view-layer concern over the core
 * bindings (ADR-155): the agent scans the headline list and drills a chosen
 * strand with `inspectStrand` for its full evidence — a payload bounded by
 * member depth, not by dropping the graph structure.
 *
 * There is deliberately no headline counterpart for `inspectStrand`: a
 * single-strand inspect is already the drilled, full result, so the
 * scan-then-drill step a headline serves has no meaning there — which is why the
 * `detail` input is accepted only on `evidence-for-move`.
 */

import {
  evidenceForMove,
  type EefEvidenceEnvelope,
  type EvidenceForMoveSelectors,
} from './eef-evidence.js';
import type { EefStrand } from './strand-lookup.js';

/**
 * The headline projection of a strand — identity, the impact-for-cost headline
 * metrics, tags, and the EEF page — for the bounded `evidenceForMoveHeadlines`
 * list view. A `Pick` over {@link EefStrand}: the named fields are
 * compile-time-checked against the corpus shape (rename or remove one and the
 * build breaks), so the projected fields cannot drift in type. A NEW corpus
 * field that belongs in the headline does not appear automatically — it must be
 * added here AND in `toHeadline`. The deep evidence fields (key findings,
 * effectiveness, implementation, …) are omitted and reached by drilling with
 * `inspectStrand`.
 */
export type EefStrandHeadline = Pick<
  EefStrand,
  'id' | 'name' | 'slug' | 'eef_url' | 'headline' | 'tags'
>;

/** Project one strand to its {@link EefStrandHeadline} — a `Pick`, no fabrication. */
function toHeadline(strand: EefStrand): EefStrandHeadline {
  const { id, name, slug, eef_url, headline, tags } = strand;
  return { id, name, slug, eef_url, headline, tags };
}

/**
 * The bounded headline view of {@link evidenceForMove}: the same axis/explicit
 * query, with each member projected to {@link EefStrandHeadline}. `answerType`,
 * `edges`, `frontier`, and `provenance` are identical to the full envelope —
 * only the member depth differs.
 */
export function evidenceForMoveHeadlines(
  selectors: EvidenceForMoveSelectors,
): EefEvidenceEnvelope<EefStrandHeadline> {
  const full = evidenceForMove(selectors);
  return { ...full, members: full.members.map(toHeadline) };
}
