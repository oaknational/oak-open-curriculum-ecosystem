/**
 * Gate-expiry drift detection and alerting for the plan corpus.
 *
 * @remarks
 * The instrument behind `.agent/plans/plan-node-schema.md` §"Owner
 * gates — expiring, never open-ended": "an expired gate is surfaced as
 * drift demanding a decision (renew, resolve, or archive the plan) —
 * expiry never auto-cancels anything."
 *
 * Drift is deliberately a DISTINCT finding class from conformance
 * (`PlanConformanceFailure` in `plan-corpus-types.ts`): a drifted plan
 * is well-formed; one of its gates has outlived its horizon and
 * demands an owner decision. Because the cure is a decision only the owner can
 * take, drift never blocks commits or CI (owner ruling 2026-07-31) —
 * it surfaces as a persistent alert (`check-plan-gate-drift.ts`) that
 * repeats until the gate rows change, while `validate-plan-corpus.ts`
 * stays a deterministic function of repo content.
 *
 * @packageDocumentation
 */

import { PLAN_STATUS_PARTITION, type ParsedPlanFile } from './plan-corpus-types.js';
import { type PlanNode } from './plan-node-schema.js';

/** One owner gate, as parsed by the plan-node contract. */
type OwnerGate = NonNullable<PlanNode['owner_gates']>[number];

/** One expired gate on one live plan: the decision-demanding finding. */
export interface GateExpiryDrift {
  readonly path: string;
  readonly gate: OwnerGate;
}

/**
 * Detect expired owner gates across the file-level-valid plans.
 *
 * @remarks
 * A gate is expired when the current UTC calendar date is strictly
 * after its `expires` date — a gate stays live through its whole expiry
 * day. Both sides are ISO `YYYY-MM-DD` strings, which order correctly
 * under plain string comparison, so the check carries no timezone
 * surface of its own; the UTC ruling means drift flips at midnight UTC
 * (01:00 London in BST) — deliberate, not incidental.
 *
 * @param files - The file-level-valid plans (corpus parse output).
 * @param todayIso - The current UTC calendar date, `YYYY-MM-DD`
 * (injected by the composition root; tests pass fixed dates).
 * @returns One finding per expired gate, in corpus order.
 */
export function detectGateExpiryDrift(
  files: readonly ParsedPlanFile[],
  todayIso: string,
): readonly GateExpiryDrift[] {
  const drifts: GateExpiryDrift[] = [];
  for (const file of files) {
    if (PLAN_STATUS_PARTITION[file.node.status] !== 'live') {
      continue;
    }
    for (const gate of file.node.owner_gates ?? []) {
      if (gate.expires < todayIso) {
        drifts.push({ path: file.path, gate });
      }
    }
  }
  return drifts;
}

/**
 * Render drift findings as the decision-demanding report section: a
 * counted, dated header naming the three decisions, then one block per
 * plan path with one line per expired gate.
 *
 * @param drifts - The findings from {@link detectGateExpiryDrift}.
 * @param todayIso - The date the expiry was judged against, named in
 * the header so the report stays interpretable in an old log.
 * @returns Report lines; empty when there is no drift to report.
 */
export function formatGateExpiryDrift(
  drifts: readonly GateExpiryDrift[],
  todayIso: string,
): string[] {
  if (drifts.length === 0) {
    return [];
  }
  const lines = [
    `plan-gate-drift: ${String(drifts.length)} expired owner gate(s) as of ${todayIso} — ` +
      'drift demanding an owner decision (renew, resolve, or archive the plan; ' +
      'resolve = remove the discharged gate row):',
  ];
  const paths = [...new Set(drifts.map((drift) => drift.path))];
  for (const path of paths) {
    lines.push(`  ${path}`);
    for (const drift of drifts.filter((candidate) => candidate.path === path)) {
      lines.push(
        `    - awaiting '${drift.gate.awaiting}', expired ${drift.gate.expires}: ${drift.gate.clears_when}`,
      );
    }
  }
  return lines;
}

/**
 * Render the full persistent alert: the drift report plus the
 * standing instructions for instigating resolution. The alert repeats
 * (every session open, every run) until the gate rows change — the
 * persistence is the anti-toleration mechanism; blocking is not
 * (owner ruling 2026-07-31).
 *
 * @param drifts - The findings from {@link detectGateExpiryDrift}.
 * @param todayIso - The date the expiry was judged against.
 * @returns Alert lines; empty when there is no drift to alert on.
 */
export function formatGateExpiryAlert(
  drifts: readonly GateExpiryDrift[],
  todayIso: string,
): string[] {
  const report = formatGateExpiryDrift(drifts, todayIso);
  if (report.length === 0) {
    return [];
  }
  return [
    ...report,
    'To instigate resolution: surface the decision to the owner as a visible ask at the',
    'next action moment (via the Director seat when one is live), then apply the word in',
    "the plan's frontmatter — renew: set the gate's expires to the newly decided date;",
    'resolve: remove the discharged gate row; archive: set status: archived and move the',
    'plan to .agent/plans/archive/. Expiry never auto-cancels anything, and this alert',
    'repeats until the gate rows change (.agent/plans/plan-node-schema.md, Owner gates).',
  ];
}
