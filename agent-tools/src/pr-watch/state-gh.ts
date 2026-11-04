import { execFileSync } from 'node:child_process';

import {
  GH_EXEC_OPTIONS,
  parseGhJson,
  reviewThreadsArgs,
  type GhCommandExecutor,
  type PrTarget,
} from './gh.js';
import { parseReviewThreadPages } from './review-threads.js';
import { readReviewRunsLeg } from './review-runs.js';
import { hasLanded, isSignedSelfReply } from './reviewer-legs.js';
import { parseReviewsHarvest, parseStateView, PR_STATE_VIEW_JSON_FIELDS } from './state-fields.js';
import type { PrStateReading } from './state-types.js';

/**
 * The gh IO composition for `pr state`: one extended `pr view` call, the
 * review-threads GraphQL slurp (shared with `pr-watch`), the FULL paginated
 * `reviews` harvest (the reviewer-leg source — never the `latestReviews`
 * pointer), and the `gh agent-task` review-run legs, composed into one
 * {@link PrStateReading}.
 *
 * The expected reviewer set is a DECLARED input (`expectedReviewers`); when
 * undeclared it defaults to the observed surface (requests ∪ harvest authors)
 * and the reading marks `expectedDeclared: false` so the verdict names the
 * first-round-guarantee gap instead of silently passing it.
 *
 * The `gh agent-task` review-run leg (bounded run→PR mapping, typed
 * degradation) lives in `review-runs.ts`.
 */

export interface ReadPrStateOptions {
  readonly target: PrTarget;
  readonly execFileSync?: GhCommandExecutor;
  /** The declared expected reviewer set (`--expect`, repeatable). */
  readonly expectedReviewers?: readonly string[];
}

// Paginated full-history reviews harvest; `--slurp` wraps pages into one array.
const REVIEWS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviews(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { author { login } state body submittedAt commit { oid } }
      }
    }
  }
}`;

function reviewsHarvestArgs(prNumber: string, repo: string | undefined): string[] {
  const [owner, name] = repo === undefined ? ['{owner}', '{repo}'] : repo.split('/');
  return [
    'api',
    'graphql',
    '--paginate',
    '--slurp',
    '-f',
    `query=${REVIEWS_QUERY}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ];
}

// `mergeable: UNKNOWN` means GitHub has not computed mergeability yet — a
// documented transient computed over seconds, so an immediate retry is a
// no-op. Fail loud once rather than let a green reading settle over an
// uncomputed conflict state.
function readMergeabilityComputedView(input: {
  readonly run: GhCommandExecutor;
  readonly viewArgs: readonly string[];
  readonly prNumber: string;
}) {
  const view = parseStateView(
    parseGhJson(input.run('gh', input.viewArgs, GH_EXEC_OPTIONS), 'pr view'),
  );
  // The refusal binds OPEN PRs only: GitHub stops computing (and commonly
  // returns UNKNOWN for) merged/closed PRs, whose terminal verdicts must
  // remain reachable — including a PR that closes mid-compound-read.
  if (view.state === 'OPEN' && view.mergeable === 'UNKNOWN') {
    throw new Error(
      `PR #${input.prNumber}: mergeability not yet computed (mergeable=UNKNOWN) — re-run in a few seconds`,
    );
  }
  return view;
}

// Wrap the harvest failure with operator-grade evidence: a nonexistent or
// inaccessible PR surfaces as a null pullRequest deep in the GraphQL payload.
function readReviewsHarvest(input: {
  readonly run: GhCommandExecutor;
  readonly prNumber: string;
  readonly repo: string | undefined;
}) {
  try {
    return parseReviewsHarvest(
      parseGhJson(
        input.run('gh', reviewsHarvestArgs(input.prNumber, input.repo), GH_EXEC_OPTIONS),
        'api graphql reviews',
      ),
    );
  } catch (cause) {
    throw new Error(
      `PR #${input.prNumber}: reviews harvest failed — does the PR exist and is it accessible?`,
      { cause },
    );
  }
}

/**
 * Fetch the `pr state` gh surfaces and compose the compound reading.
 *
 * @throws when the primary `pr view`, review-threads, or reviews-harvest legs
 *   fail (a verdict without them would be a guess); only the agent-task leg
 *   degrades typed.
 */
// The compound reading must bind ONE tip: a push landing between the view
// snapshot and the later legs lets an old-tip review match the stored SHA
// and read settled against a tip that owes fresh checks and a review. One
// moved tip retries the legs against the fresh snapshot; a second
// consecutive move fails loud rather than composing across tips.
const TIP_CONSISTENT_ATTEMPTS = 2;

export function readPrStateReading(options: ReadPrStateOptions): PrStateReading {
  const run = options.execFileSync ?? execFileSync;
  const { number, repo } = options.target;
  const prNumber = String(number);

  const viewArgs = ['pr', 'view', prNumber, '--json', PR_STATE_VIEW_JSON_FIELDS.join(',')];
  if (repo !== undefined) {
    viewArgs.push('--repo', repo);
  }

  let view = readMergeabilityComputedView({ run, viewArgs, prNumber });
  for (let attempt = 0; attempt < TIP_CONSISTENT_ATTEMPTS; attempt += 1) {
    const reviewThreads = parseReviewThreadPages(
      parseGhJson(
        run('gh', reviewThreadsArgs(prNumber, repo), GH_EXEC_OPTIONS),
        'api graphql reviewThreads',
      ),
    );
    const reviews = readReviewsHarvest({ run, prNumber, repo });
    const reviewRuns = readReviewRunsLeg({ run, prNumber: number, prUrl: view.url });
    // The confirm read closes the race window; on a match it is also the
    // freshest same-tip snapshot, so the reading composes from it.
    const confirm = readMergeabilityComputedView({ run, viewArgs, prNumber });
    if (confirm.headRefOid === view.headRefOid) {
      const declared = options.expectedReviewers ?? [];
      // A defaulted expected set must not be polluted by the agent's own signed
      // disposition replies (shared-credential reviews), unsubmitted drafts, or
      // deleted-account 'unknown' authors — each would mint a phantom OWED leg.
      const observedAuthors = reviews
        .filter((review) => hasLanded(review) && !isSignedSelfReply(review.body))
        .map((review) => review.author)
        .filter((author) => author !== 'unknown');
      const observed = [...new Set([...confirm.reviewRequests, ...observedAuthors])];
      return {
        ...confirm,
        reviewThreads,
        reviews,
        reviewRuns,
        expectedReviewers: declared.length > 0 ? declared : observed,
        expectedDeclared: declared.length > 0,
      };
    }
    view = confirm;
  }
  throw new Error(
    `PR #${prNumber}: head moved during the compound read on consecutive attempts — the reading cannot bind one tip; re-run when the PR is quiet`,
  );
}
