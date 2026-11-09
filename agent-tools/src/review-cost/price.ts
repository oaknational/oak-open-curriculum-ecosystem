import { readBudget } from './budget.js';
import { DEFAULT_POLICY, reviewCost, type CostReport } from './cost.js';
import { gitDiffStat } from './git.js';
import { readLiveHarvest } from './harvest.js';
import { measureRounds, reviewedHeadsMissingFromList } from './measure.js';

/** The repository's automatic reviewers — the declared expected set when `--expect` is absent. */
const DEFAULT_EXPECTED_REVIEWERS = ['copilot-pull-request-reviewer', 'chatgpt-codex-connector'];

export interface PricingInput {
  readonly number: number;
  readonly repo: string;
  readonly expectedReviewers: readonly string[];
}

export interface GatePricing {
  readonly report: CostReport;
  /** The base branch's tip as GitHub holds it — the identity a sync push must merge. */
  readonly baseRefOid: string | undefined;
}

/** Price one pull request as the gate prices it, with the base identity the sync test needs. */
export function priceForGate(input: PricingInput): GatePricing {
  const live = readLiveHarvest({ number: input.number, repo: input.repo });
  const expectedReviewers =
    input.expectedReviewers.length > 0 ? input.expectedReviewers : DEFAULT_EXPECTED_REVIEWERS;
  const missing = live.commitsWindowed
    ? reviewedHeadsMissingFromList(live.harvest, expectedReviewers)
    : [];
  if (missing.length > 0) {
    throw new Error(
      `the commit list GitHub serves (its newest 250) lacks reviewed head ${missing.join(', ')}, so the loop cannot be priced in full`,
    );
  }
  const rounds = measureRounds({
    harvest: live.harvest,
    expectedReviewers,
    // The opening push is measured from the parent of the first commit the list holds:
    // the pull request's first commit, open or merged, or on a history past GitHub's
    // 250-commit window, the window's first.
    baseRef: `${live.harvest.commits[0]?.oid ?? live.harvest.headRefOid}^`,
    diff: gitDiffStat,
  });
  const lastReviewed = rounds.at(-1)?.head;
  const report = reviewCost(rounds, readBudget(live.body).pushes, DEFAULT_POLICY, {
    headAdvanced: lastReviewed !== undefined && lastReviewed !== live.harvest.headRefOid,
  });
  return { report, baseRefOid: live.baseRefOid };
}

/** Price one pull request as the gate prices it: its live recording, its declared budget, the policy. */
export function pricePullRequest(input: PricingInput): CostReport {
  return priceForGate(input).report;
}
