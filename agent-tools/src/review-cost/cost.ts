/**
 * The review cost function — the seat-side guard the owner asked for after
 * PR #139 (2026-09-12: seven settlement pushes against a declared budget of
 * two, 98 comments, every finding correct, none exercised by a recorded
 * input, stopped only by the owner). An on/off round count would have fired
 * too; a cost function fires EARLIER the more expensive the loop is: more
 * findings, more comment volume, bigger and more frequent pushes, and pushes
 * that keep touching the same files (the signature of sampling one surface)
 * all raise a round's cost. The verdict is deterministic — thresholds, never
 * probabilities — because an agent that rolls dice at a gate is a timing
 * dependence. Every weight lives in the policy, calibrated against recorded
 * loops, never in the code path.
 */

export interface RoundMeasure {
  readonly head: string;
  /** Findings raised in reviews bound to this head: threads plus body items. */
  readonly findings: number;
  /** Reviewer and seat comment characters on this head's threads and review bodies. */
  readonly commentChars: number;
  /** Lines changed by the push that opened this round. */
  readonly pushLines: number;
  /** Files changed by that push. */
  readonly pushFiles: number;
  /** Share of this push's files the previous push also touched, 0..1 (0 for the opening round). */
  readonly relatedness: number;
  /** Hours since the previous reviewed head; null for the opening round. */
  readonly hoursSincePrevious: number | null;
  /** A sync from the base: the push changed no reviewed content, so the round accrues nothing. */
  readonly sync: boolean;
}

export interface CostPolicy {
  readonly perFinding: number;
  readonly perThousandChars: number;
  readonly perHundredLines: number;
  readonly perFile: number;
  /** Multiplier weight on relatedness: cost × (1 + weight × relatedness). */
  readonly relatednessWeight: number;
  /** Multiplier weight on reactive pushing: cost × (1 + weight × max(0, 1 − hours / reactiveHours)). */
  readonly reactiveWeight: number;
  readonly reactiveHours: number;
  /** The fixed cost of any settlement round (a review run, a harvest, a disposition pass), before its findings. */
  readonly baseRound: number;
  /** The cost one settlement push is budgeted; the budget is declared pushes × this. */
  readonly unitRound: number;
  /** The share of the budget at which the verdict turns to warn. */
  readonly warnShare: number;
  /** The ratio the latest round must fall to, against the round before, to earn the one converging extension. */
  readonly convergingRatio: number;
}

export const DEFAULT_POLICY: CostPolicy = {
  perFinding: 0.5,
  perThousandChars: 0.2,
  perHundredLines: 0.3,
  perFile: 0.1,
  relatednessWeight: 1,
  reactiveWeight: 1,
  reactiveHours: 1,
  baseRound: 3,
  unitRound: 20,
  warnShare: 0.5,
  convergingRatio: 0.5,
};

type CostVerdict = 'within' | 'warn' | 'converging' | 'exhausted';

interface RoundCost {
  readonly head: string;
  readonly cost: number;
}

export interface CostOptions {
  /** The pull request's head is already beyond the last reviewed head: a push has been taken since. */
  readonly headAdvanced?: boolean;
}

export interface CostReport {
  readonly rounds: readonly RoundCost[];
  readonly total: number;
  readonly budget: number;
  readonly budgetPushes: number;
  readonly verdict: CostVerdict;
  readonly evidence: readonly string[];
  /** The settlement rounds reviewed after the one that crossed the budget. */
  readonly pushesPastBudget: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

/** One round's cost under the policy. */
export function roundCost(measure: RoundMeasure, policy: CostPolicy): number {
  const base =
    policy.baseRound +
    policy.perFinding * measure.findings +
    policy.perThousandChars * (measure.commentChars / 1000) +
    policy.perHundredLines * (measure.pushLines / 100) +
    policy.perFile * measure.pushFiles;
  const related = 1 + policy.relatednessWeight * measure.relatedness;
  const hours = measure.hoursSincePrevious;
  const reactive =
    hours === null ? 1 : 1 + policy.reactiveWeight * Math.max(0, 1 - hours / policy.reactiveHours);
  return round2(base * related * reactive);
}

/** The settlement rounds reviewed after the one that crossed the budget; zero while it holds. */
function roundsPastBudget(costs: readonly number[], budget: number): number {
  let running = 0;
  let crossedAt = -1;
  costs.forEach((cost, index) => {
    if (index === 0) {
      return;
    }
    running += cost;
    if (crossedAt === -1 && running >= budget) {
      crossedAt = index;
    }
  });
  return crossedAt === -1 ? 0 : costs.length - 1 - crossedAt;
}

// The one converging extension: the budget was crossed by THIS round, and this
// round cost no more than the converging ratio of the round before it — the
// opening round included as the baseline, though never charged.
function converging(costs: readonly number[], budget: number, policy: CostPolicy): boolean {
  let running = 0;
  let crossedAt = -1;
  costs.forEach((cost, index) => {
    if (index === 0) {
      return;
    }
    running += cost;
    if (crossedAt === -1 && running >= budget) {
      crossedAt = index;
    }
  });
  const latest = costs.at(-1);
  const previous = costs.at(-2);
  return (
    crossedAt === costs.length - 1 &&
    latest !== undefined &&
    previous !== undefined &&
    latest <= policy.convergingRatio * previous
  );
}

// The converging extension is exactly one push: once the head has advanced past
// the last reviewed head, it has been taken, and the next review must land first.
function verdictFor(
  total: number,
  budget: number,
  costs: readonly number[],
  policy: CostPolicy,
  options: CostOptions,
): CostVerdict {
  if (total >= budget) {
    const extension = converging(costs, budget, policy) && options.headAdvanced !== true;
    return extension ? 'converging' : 'exhausted';
  }
  return total >= budget * policy.warnShare ? 'warn' : 'within';
}

/**
 * The report over the reviewed rounds in branch order. The opening round
 * measures the pull request's size, not the loop's waste, so it is priced
 * and shown but never charged; the settlement rounds after it accrue against
 * `budgetPushes` × the policy's unit.
 */
export function reviewCost(
  rounds: readonly RoundMeasure[],
  budgetPushes: number,
  policy: CostPolicy = DEFAULT_POLICY,
  options: CostOptions = {},
): CostReport {
  // A sync round is listed at zero: it changed no reviewed content (pr-lifecycle).
  const costs = rounds.map((measure) => ({
    head: measure.head,
    cost: measure.sync ? 0 : roundCost(measure, policy),
  }));
  const settlement = costs.slice(1).map((entry) => entry.cost);
  const total = round2(settlement.reduce((sum, cost) => sum + cost, 0));
  const budget = round2(budgetPushes * policy.unitRound);
  const charged = costs.filter((entry, index) => index === 0 || entry.cost > 0);
  const chargedCosts = charged.map((entry) => entry.cost);
  const verdict = verdictFor(total, budget, chargedCosts, policy, options);
  const pushesPastBudget = roundsPastBudget(chargedCosts, budget);
  const evidence = [
    `rounds ${String(costs.length)} (opening plus ${String(Math.max(0, costs.length - 1))} settlement), budget ${String(budgetPushes)} settlement pushes`,
    `settlement cost ${String(total)} of ${String(budget)}; rounds: ${costs.map((entry) => `${entry.head.slice(0, 9)} ${String(entry.cost)}`).join(', ')}`,
    ...(verdict === 'exhausted'
      ? [
          "BUDGET-EXHAUSTED: the settlement budget is spent; a push from here needs the seat's recorded decision (one local line per push), and every finding from here is dispositioned by triage",
        ]
      : []),
    ...(verdict === 'exhausted' && options.headAdvanced === true
      ? ['the head is already past the last reviewed round: the one converging push has been taken']
      : []),
    ...(verdict === 'converging'
      ? [
          'over budget but converging: this round crossed it at no more than half the round before — one more push',
        ]
      : []),
  ];
  return { rounds: costs, total, budget, budgetPushes, verdict, evidence, pushesPastBudget };
}
