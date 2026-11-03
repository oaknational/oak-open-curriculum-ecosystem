import { execFileSync } from 'node:child_process';

import {
  GH_EXEC_OPTIONS,
  parseGhJson,
  resolveGhPath,
  reviewThreadsArgs,
  type GhCommandExecutor,
  type PathExistsCheck,
  type PrTarget,
} from './gh.js';
import { contentReaderFor, gitPatchIdOf, type PatchIdOf } from './content-reader.js';
import {
  COMMENTS_QUERY,
  COMMITS_QUERY,
  harvestArgs,
  REQUESTS_QUERY,
  REVIEWS_QUERY,
} from './harvests.js';
import { parseReviewThreadPages } from './review-threads.js';
import { readReviewConfigurationLeg } from './review-configuration-leg.js';
import { readReviewRunsLeg } from './review-runs.js';
import { parseRequestsHarvest } from './round-requests.js';
import { composeReading, type UnavailableInput } from './state-compose.js';
import { parseCommentsHarvest, parseCommitsHarvest } from './state-conversation.js';
import { parseReviewsHarvest, parseStateView, PR_STATE_VIEW_JSON_FIELDS } from './state-fields.js';
import type { PrStateReading } from './state-types.js';

/**
 * The gh IO composition for `pr state`: one extended `pr view` call, the
 * review-threads GraphQL slurp (shared with `pr-watch`), four FULL paginated
 * harvests — `reviews` (the reviewer-leg source, never the `latestReviews`
 * pointer), `comments` and `commits` (the completion-comment sources), and
 * the request events (the rounds a review bound by content waits for) — and
 * the `gh agent-task` review-run legs, composed into one {@link PrStateReading}.
 *
 * The expected reviewer set is a DECLARED input (`expectedReviewers`); when
 * undeclared it defaults to the observed surface (requests ∪ harvest authors)
 * and the reading marks `expectedDeclared: false` so the verdict names the
 * first-round-guarantee gap instead of silently passing it.
 *
 * The `gh agent-task` review-run leg (bounded run→PR mapping, typed
 * degradation) lives in `review-runs.ts`. The content leg (`content-reader.ts`)
 * reads the patch-ids a review of an earlier commit binds the head by, and
 * degrades to unproven, never failing the reading.
 */

export interface ReadPrStateOptions {
  readonly target: PrTarget;
  readonly ghPath?: string;
  readonly execFileSync?: GhCommandExecutor;
  readonly exists?: PathExistsCheck;
  /**
   * The declared expected reviewer set (`--expect`, repeatable): absent, the
   * set is undeclared and defaults; empty, it was declared `none`
   * (expect-flag.ts).
   */
  readonly expectedReviewers?: readonly string[];
  /** Hashes a diff to its patch-id; the trusted git's `patch-id` by default. */
  readonly patchIdOf?: PatchIdOf;
  /** Vendors declared unavailable (`--unavailable`), the bot that may declare, and the clock. */
  readonly unavailable?: UnavailableInput | undefined;
}

// `mergeable: UNKNOWN` means GitHub has not computed mergeability yet — a
// documented transient computed over seconds, so an immediate retry is a
// no-op. Fail loud once rather than let a green reading settle over an
// uncomputed conflict state.
function readMergeabilityComputedView(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly viewArgs: readonly string[];
  readonly prNumber: string;
}) {
  const view = parseStateView(
    parseGhJson(input.run(input.gh, input.viewArgs, GH_EXEC_OPTIONS), 'pr view'),
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

// One paginated harvest, its failure wrapped with operator-grade evidence: a
// nonexistent or inaccessible PR surfaces as a null pullRequest deep in the
// GraphQL payload.
function readHarvest<Parsed>(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: string;
  readonly repo: string | undefined;
  readonly query: string;
  readonly label: string;
  readonly parse: (raw: unknown) => Parsed;
}): Parsed {
  try {
    return input.parse(
      parseGhJson(
        input.run(input.gh, harvestArgs(input.query, input.prNumber, input.repo), GH_EXEC_OPTIONS),
        `api graphql ${input.label}`,
      ),
    );
  } catch (cause) {
    throw new Error(
      `PR #${input.prNumber}: ${input.label} harvest failed — does the PR exist and is it accessible?`,
      { cause },
    );
  }
}

// The four full-history harvests the reading composes from.
function readHarvests(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: string;
  readonly repo: string | undefined;
}) {
  return {
    reviews: readHarvest({
      ...input,
      query: REVIEWS_QUERY,
      label: 'reviews',
      parse: parseReviewsHarvest,
    }),
    comments: readHarvest({
      ...input,
      query: COMMENTS_QUERY,
      label: 'comments',
      parse: parseCommentsHarvest,
    }),
    commits: readHarvest({
      ...input,
      query: COMMITS_QUERY,
      label: 'commits',
      parse: parseCommitsHarvest,
    }),
    requests: readHarvest({
      ...input,
      query: REQUESTS_QUERY,
      label: 'review requests',
      parse: parseRequestsHarvest,
    }),
  };
}

/**
 * Fetch the `pr state` gh surfaces and compose the compound reading.
 *
 * @throws when the primary `pr view`, review-threads, or any of the reviews,
 *   comments, commits or review-request harvests fail (a verdict without them would be a
 *   guess); only the agent-task leg degrades typed.
 */
// The compound reading must bind ONE tip: a push landing between the view
// snapshot and the later legs lets an old-tip review match the stored SHA
// and read settled against a tip that owes fresh checks and a review. One
// moved tip retries the legs against the fresh snapshot; a second
// consecutive move fails loud rather than composing across tips.
const TIP_CONSISTENT_ATTEMPTS = 2;

export function readPrStateReading(options: ReadPrStateOptions): PrStateReading {
  const run = options.execFileSync ?? execFileSync;
  const patchIdOf = options.patchIdOf ?? gitPatchIdOf;
  const gh = resolveGhPath(options.ghPath, options.exists);
  const { number, repo } = options.target;
  const prNumber = String(number);

  const viewArgs = ['pr', 'view', prNumber, '--json', PR_STATE_VIEW_JSON_FIELDS.join(',')];
  if (repo !== undefined) {
    viewArgs.push('--repo', repo);
  }

  let view = readMergeabilityComputedView({ run, gh, viewArgs, prNumber });
  for (let attempt = 0; attempt < TIP_CONSISTENT_ATTEMPTS; attempt += 1) {
    const reviewThreads = parseReviewThreadPages(
      parseGhJson(
        run(gh, reviewThreadsArgs(prNumber, repo), GH_EXEC_OPTIONS),
        'api graphql reviewThreads',
      ),
    );
    const { reviews, comments, commits, requests } = readHarvests({ run, gh, prNumber, repo });
    const reviewRuns = readReviewRunsLeg({ run, gh, prNumber: number, prUrl: view.url });
    // The confirm read closes the race window; on a match it is also the
    // freshest same-tip snapshot, so the reading composes from it.
    const confirm = readMergeabilityComputedView({ run, gh, viewArgs, prNumber });
    if (confirm.headRefOid === view.headRefOid) {
      return composeReading({
        view: confirm,
        comments,
        commits,
        requests,
        reviewThreads,
        reviews,
        reviewRuns,
        // The base branch's configuration, from the view the reading composes from.
        reviewConfiguration: readReviewConfigurationLeg({ run, gh, repo, view: confirm }),
        declared: options.expectedReviewers ?? null,
        unavailable: options.unavailable,
        readContent: contentReaderFor({ run, gh, repo, view: confirm, patchIdOf }),
      });
    }
    view = confirm;
  }
  throw new Error(
    `PR #${prNumber}: head moved during the compound read on consecutive attempts — the reading cannot bind one tip; re-run when the PR is quiet`,
  );
}
