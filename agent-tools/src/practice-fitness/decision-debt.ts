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

import { classifyFitnessZone, type FitnessZone } from './model.js';
import { extractFrontmatter, getFrontmatterNumber, getFrontmatterString } from './markdown.js';
import {
  countLiveItems,
  parseRegisterItems,
  validateRegisterItems,
  type ItemConformanceFinding,
  type ItemCountResult,
} from './item-count.js';

/**
 * The owner-tunable count thresholds for a buffer, declared in its frontmatter.
 * A buffer declaring neither opts out of the decision-debt metric.
 */
export interface DecisionDebtThresholds {
  readonly target: number | null;
  readonly limit: number | null;
}

/**
 * The full decision-debt reading for a buffer: the live count, its per-status
 * breakdown, its three-zone classification, and the schema-conformance findings.
 */
export interface DecisionDebtResult {
  readonly count: number;
  readonly byStatus: ItemCountResult['byStatus'];
  readonly zone: FitnessZone | null;
  readonly findings: readonly ItemConformanceFinding[];
}

/**
 * Classify a decision-debt count into a fitness zone. With the register's
 * declared `target: 0, limit: 2` and the global critical ratio, the mapping is:
 * 0 → healthy, 1–2 → soft, 3 → hard, 4+ → critical. The thresholds are injected,
 * never pinned in code.
 */
export function classifyDecisionDebtZone(
  count: number,
  thresholds: DecisionDebtThresholds,
): FitnessZone | null {
  return classifyFitnessZone(count, thresholds.target, thresholds.limit);
}

/** Read the owner-tunable count thresholds from a buffer's frontmatter. */
export function readDecisionDebtThresholds(content: string): DecisionDebtThresholds {
  const frontmatter = extractFrontmatter(content);
  return {
    target: getFrontmatterNumber(frontmatter, 'fitness_item_count_target'),
    limit: getFrontmatterNumber(frontmatter, 'fitness_item_count_limit'),
  };
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
export function evaluateDecisionDebt(content: string): DecisionDebtResult {
  const items = parseRegisterItems(content);
  const { total, byStatus } = countLiveItems(items);
  return {
    count: total,
    byStatus,
    zone: classifyDecisionDebtZone(total, readDecisionDebtThresholds(content)),
    findings: validateRegisterItems(content),
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
 * both count thresholds has no flow-rate zone — and a concept-counted file with
 * no zone is a schema failure (the one surface that exists to be measured cannot
 * report its depth). Returns the schema-failure detail for such a file, else
 * `null`. A file that is not designated for concept-counting is not a failure —
 * the metric does not apply to it.
 */
export function decisionDebtConfigurationFinding(content: string): string | null {
  if (!isConceptCounted(content)) {
    return null;
  }
  const { target, limit } = readDecisionDebtThresholds(content);
  if (target == null || limit == null) {
    return 'concept-counted file (fitness_item_count: required) must declare both fitness_item_count_target and fitness_item_count_limit — a concept-counted file with no flow-rate zone is a schema failure';
  }
  return null;
}
