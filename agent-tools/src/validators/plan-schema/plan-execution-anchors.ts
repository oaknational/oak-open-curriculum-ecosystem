/**
 * Execution-anchor consistency for the plan corpus (dated amendment
 * 2026-07-31; ADR-221 lens 4): the ticket requirement is operator
 * policy, not a public-schema constant — it binds a ratified delivery
 * plan only within an ANCHORED subtree.
 *
 * @remarks
 * Anchoring is DERIVED from the corpus's own execution anchors, never
 * declared: any declarative record of which subtrees an operator
 * tracks is operator-stratum content and cannot live in the public
 * repository (PDR-134 §1/§6 — the obligation must not survive an
 * overlay strip; ADR-221 lens 4). Ticket references are opaque
 * external names (PDR-134 §2) — they name without resolving, so a
 * public plan carries one and stays whole.
 *
 * Deliberate limit: the rule enforces consistency of anchoring over
 * the clone's own files ("don't half-anchor a subtree"), never
 * conformance to an operator's tracking ruling — a subtree whose
 * plans are all ticketless reads as unanchored by construction, and
 * the operator's tracking discipline is an overlay-side obligation.
 * Witnesses are LIVE plans only (`sketch`, `ratified`) — terminal
 * statuses neither demand nor prove, the same partition the gate-drift
 * rule draws. De-anchoring a subtree is therefore the dated,
 * reviewable act of archiving or superseding its last live ticketed
 * plan: the guard never lifts through silence, it lifts through a
 * visible diff (Director ruling 2026-07-31, superseding the earlier
 * archived-witness reading, which had no workable de-anchor act).
 *
 * Placement rule (2026-07-31, superseding the story-1 architecture
 * verdict's extract-at-second-operator-policy-rule trigger, which is
 * VOID — not deferred): a public-repo module named for operator
 * policy is the artefact PDR-134 forbids, so that class is empty by
 * construction and a counting trigger over it could only ever license
 * the violation. Instead: rules that enforce an externally-sourced
 * obligation by DERIVING it from the corpus's own evidence get their
 * own semantically-named `plan-*.ts` module composed into
 * `validateCorpus`'s message list, never accreted into the
 * conformance helpers — this module is the first member. Falsifier:
 * a genuine operator-policy constant needing to bind in-repo is a
 * PDR-134 breach signal to escalate, never an extraction trigger to
 * satisfy.
 *
 * @packageDocumentation
 */

import { PLAN_STATUS_PARTITION, type ParsedPlanFile } from './plan-corpus-types.js';
import { type PlanNode } from './plan-node-schema.js';

/** The first ticket of a LIVE plan; undefined for terminal or ticketless. */
function liveFirstTicket(file: ParsedPlanFile): string | undefined {
  if (PLAN_STATUS_PARTITION[file.node.status] !== 'live') {
    return undefined;
  }
  return (file.node.tickets ?? [])[0];
}

/**
 * The anchored strategic subtrees, each with its strongest live
 * witness: a subtree is anchored when its strategic node, or any live
 * plan serving it, names at least one ticket. The governing node's
 * own ticket is the preferred witness; otherwise the first live
 * serving plan in corpus order is named, so the derivation stays
 * inspectable.
 *
 * @remarks
 * The map key space is strategic-node ids only — strategic evidence
 * keys on the node's own `id`, and every other plan keys on its
 * `serves` target. A strategic node's own `serves` names a published
 * CHOICE id, which the corpus rules keep out of the strategic-id
 * space, so the two writes cannot collide in a valid corpus.
 */
export function anchoringEvidence(files: readonly ParsedPlanFile[]): ReadonlyMap<string, string> {
  const anchors = new Map<string, string>();
  for (const file of files) {
    addGoverningNodeAnchor(anchors, file);
  }
  for (const file of files) {
    addServingPlanAnchor(anchors, file);
  }
  return anchors;
}

/** The preferred witness: a live strategic node naming its own ticket. */
function addGoverningNodeAnchor(anchors: Map<string, string>, file: ParsedPlanFile): void {
  const firstTicket = liveFirstTicket(file);
  if (firstTicket !== undefined && file.node.node_type === 'strategic') {
    anchors.set(file.node.id, `${file.path} names ${firstTicket}`);
  }
}

/** The fallback witness: the first live serving plan in corpus order. */
function addServingPlanAnchor(anchors: Map<string, string>, file: ParsedPlanFile): void {
  const firstTicket = liveFirstTicket(file);
  if (firstTicket === undefined || file.node.node_type === 'strategic') {
    return;
  }
  const subtree = file.node.serves;
  if (subtree !== undefined && !anchors.has(subtree)) {
    anchors.set(subtree, `${file.path} names ${firstTicket}`);
  }
}

/**
 * The rule: a ratified delivery plan in an anchored subtree names at
 * least one ticket; in an unanchored subtree it carries no ticket
 * obligation.
 *
 * @returns Zero or one message, carrying the anchoring evidence so
 * the derivation is inspectable rather than magic.
 */
export function executionAnchorMessages(
  node: PlanNode,
  anchors: ReadonlyMap<string, string>,
): readonly string[] {
  const ratifiedDelivery = node.node_type === 'delivery' && node.status === 'ratified';
  if (!ratifiedDelivery || (node.tickets ?? []).length > 0 || node.serves === undefined) {
    return [];
  }
  const evidence = anchors.get(node.serves);
  if (evidence === undefined) {
    return [];
  }
  return [
    `tickets: a ratified delivery plan in an anchored subtree names at least one ticket ` +
      `(subtree '${node.serves}' is anchored — ${evidence}; unanchored subtrees carry no ` +
      `ticket obligation, per the 2026-07-31 amendment and ADR-221 lens 4)`,
  ];
}
