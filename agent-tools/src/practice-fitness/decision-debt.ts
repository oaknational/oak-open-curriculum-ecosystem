/**
 * The decision-debt metric — a *flow-rate* reading of a drainable buffer (is the
 * consumer keeping pace with the producer?), distinct from the content-size
 * metrics. It reuses the shared three-zone classification primitive (ADR-144
 * "one scale, one vocabulary everywhere") but is reported as its own signal: its
 * cure is to *decide* items (graduate/reject) and to diagnose the pipeline
 * (PDR-067/PDR-068), never to trim or raise a limit.
 *
 * Built on the register schema in `./item-count.ts`. See the plan at
 * `.agent/plans/agent-tooling/current/pending-graduations-schema-and-count-fitness.plan.md`.
 */

import type { FitnessZone } from './model.js';
import { extractFrontmatter, getFrontmatterNumber, getFrontmatterString } from './markdown.js';
import { oldestLiveItemAgeDays } from './dwell.js';
import {
  countLiveItems,
  parseRegisterItems,
  validateRegisterItems,
  type ItemConformanceFinding,
  type ItemCountResult,
} from './item-count.js';

/**
 * Owner-tunable discrete zone thresholds, declared as **ceilings** in frontmatter:
 * `target` is the healthy ceiling, `soft` the soft ceiling, `hard` the hard
 * ceiling, and anything beyond `hard` is critical. One vocabulary serves both
 * axes (concept-count and dwell-time in days). These are explicit integers, NOT
 * the size model's `× CRITICAL_RATIO` derivation: fractional headroom suits large
 * magnitudes (`1000 × 1.5`) but is a category error on small discrete counts
 * (`2 × 1.5 = 3` is a coincidence). A buffer declaring none opts out.
 */
export interface DiscreteZoneThresholds {
  readonly target: number | null;
  readonly soft: number | null;
  readonly hard: number | null;
}

/**
 * The full decision-debt reading for a buffer: the live count, its per-status
 * breakdown, its count zone, the dwell-time signals, and the schema-conformance
 * findings. Every zone here is a **report-only prioritisation signal** (ADR-144) —
 * it ranks how urgently to drain, acted on with full weight, and never gates a
 * build.
 */
export interface DecisionDebtResult {
  readonly count: number;
  readonly byStatus: ItemCountResult['byStatus'];
  readonly zone: FitnessZone | null;
  readonly findings: readonly ItemConformanceFinding[];
  /** Oldest live item's age in days; null if none/unparseable. */
  readonly oldestDwellDays: number | null;
  /** Dwell-time zone (oldest age classified against the dwell ceilings); null if no dwell/thresholds. */
  readonly dwellZone: FitnessZone | null;
}

/** A value is at or below a discrete zone ceiling (a missing ceiling never fires). */
function atOrBelowCeiling(value: number, ceiling: number | null): boolean {
  return ceiling != null && value <= ceiling;
}

/**
 * Classify a discrete integer — a concept-count, or a dwell in days — into a
 * fitness zone against **ceiling** thresholds: healthy `≤ target`, soft `≤ soft`,
 * hard `≤ hard`, else critical. Axis-agnostic: the same engine serves the count
 * and the dwell signals. The zone is a report-only prioritisation signal (how
 * urgently to drain), acted on with full weight but never a gate; the gradation
 * does not select different actions (the action is always: decide). Thresholds
 * are injected, never pinned in code.
 *
 * A buffer declaring no thresholds opts out (returns `null`). A buffer declaring
 * only some is a schema failure surfaced by {@link decisionDebtConfigurationFinding};
 * this still returns a best-effort zone so the report shows a signal.
 */
export function classifyDiscreteZone(
  value: number,
  { target, soft, hard }: DiscreteZoneThresholds,
): FitnessZone | null {
  if (target == null && soft == null && hard == null) {
    return null;
  }
  if (atOrBelowCeiling(value, target)) {
    return 'healthy';
  }
  if (atOrBelowCeiling(value, soft)) {
    return 'soft';
  }
  if (atOrBelowCeiling(value, hard)) {
    return 'hard';
  }
  return 'critical';
}

function readCeilings(frontmatter: string | null, prefix: string): DiscreteZoneThresholds {
  return {
    target: getFrontmatterNumber(frontmatter, `${prefix}_target`),
    soft: getFrontmatterNumber(frontmatter, `${prefix}_soft`),
    hard: getFrontmatterNumber(frontmatter, `${prefix}_hard`),
  };
}

/** Read the owner-tunable count ceilings from a buffer's frontmatter. */
export function readCountThresholds(content: string): DiscreteZoneThresholds {
  return readCeilings(extractFrontmatter(content), 'fitness_item_count');
}

/** Read the owner-tunable dwell-time ceilings (in days) from a buffer's frontmatter. */
export function readDwellThresholds(content: string): DiscreteZoneThresholds {
  return readCeilings(extractFrontmatter(content), 'fitness_item_dwell');
}

/**
 * Evaluate a buffer's decision-debt in full: parse its entries, count the live
 * ones, classify the count against its declared thresholds, and collect the
 * entry-conformance findings. The decision-debt metric is the defining health
 * signal of a drainable buffer (the register today; `open-questions.md` next) —
 * it is mandatory for buffers, not opt-in. A buffer missing its thresholds is a
 * schema failure surfaced by {@link decisionDebtConfigurationFinding}, not a
 * silent `null` zone.
 */
export function evaluateDecisionDebt(content: string, now: Date): DecisionDebtResult {
  const items = parseRegisterItems(content);
  const { total, byStatus } = countLiveItems(items);
  const oldestDwellDays = oldestLiveItemAgeDays(items, now);
  return {
    count: total,
    byStatus,
    zone: classifyDiscreteZone(total, readCountThresholds(content)),
    findings: validateRegisterItems(content),
    oldestDwellDays,
    dwellZone:
      oldestDwellDays == null
        ? null
        : classifyDiscreteZone(oldestDwellDays, readDwellThresholds(content)),
  };
}

/**
 * A file is concept-counted by deliberate designation: `fitness_item_count: required`
 * in its frontmatter (the pending-graduations register today; any other file we
 * decide to apply concept-counting to). The designation is independent of the
 * thresholds so the requirement is durable: a designated file that loses its
 * thresholds is still required to have them.
 */
export function isConceptCounted(content: string): boolean {
  return getFrontmatterString(extractFrontmatter(content), 'fitness_item_count') === 'required';
}

/**
 * Concept-counting is an additional, non-optional schema layer for designated
 * files: a schema has no optional parts. A designated file that does not declare
 * its discrete count thresholds has no zone — and a concept-counted file with
 * no zone is a schema failure (the one surface that exists to be measured cannot
 * report its depth). Returns the schema-failure detail for such a file, else
 * `null`. A file that is not designated for concept-counting is not a failure —
 * the metric does not apply to it.
 */
function missingCeilings(thresholds: DiscreteZoneThresholds, prefix: string): string[] {
  const missing: string[] = [];
  if (thresholds.target == null) {
    missing.push(`${prefix}_target`);
  }
  if (thresholds.soft == null) {
    missing.push(`${prefix}_soft`);
  }
  if (thresholds.hard == null) {
    missing.push(`${prefix}_hard`);
  }
  return missing;
}

export function decisionDebtConfigurationFinding(content: string): string | null {
  if (!isConceptCounted(content)) {
    return null;
  }
  const missing = [
    ...missingCeilings(readCountThresholds(content), 'fitness_item_count'),
    ...missingCeilings(readDwellThresholds(content), 'fitness_item_dwell'),
  ];
  if (missing.length > 0) {
    return `concept-counted file (fitness_item_count: required) must declare discrete ceiling thresholds (target/soft/hard, no ratio): missing ${missing.join(', ')} — a concept-counted file with no zone is a schema failure`;
  }
  return null;
}
