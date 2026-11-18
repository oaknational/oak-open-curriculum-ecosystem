import type { ReviewConfiguration } from './review-configuration.js';
import type { CompletionCommentReading } from './completion-comments.js';
import type { DeclaredUnavailableReading } from './declared-unavailable.js';
import type { BindingHead } from './content-binding.js';
import type { CheckBucket, ChecksSummary } from './index.js';
import type { ReviewThreadsSummary } from './review-threads.js';
import type { HarvestedReview } from './reviewer-legs.js';
import type { RoundRequest } from './round-requests.js';

/**
 * Shared types and the closed verdict set for `agent-tools pr state` — the
 * dependency root both the verdict core (`states.ts`) and the settlement half
 * (`settlement.ts`) import, keeping the module graph acyclic.
 */

/** One status check carrying its verdict BY NAME. */
export interface NamedCheck {
  readonly name: string;
  readonly bucket: CheckBucket;
}

/** One `gh agent-task` review run scoped to the PR; `completedAt` null = in flight. */
export interface ReviewRun {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly completedAt: string | null;
}

/**
 * The review-run liveness leg. `unavailable` is a TYPED degradation (e.g. the
 * host lacks `gh agent-task`) — surfaced in evidence, never a silent pass.
 */
export type ReviewRunsLeg =
  | {
      readonly kind: 'read';
      readonly runs: readonly ReviewRun[];
      /**
       * True when a run may have gone unobserved: the vendor list filled its
       * window (older runs unobserved), or a LIVE run's view could not be
       * read. Run-ABSENCE conclusions (deadness) are then unsupported; run
       * PRESENCE (mapped live runs) remains evidence.
       */
      readonly truncated?: boolean;
      /**
       * Human-readable gap note for evidence lines: the list truncation, the
       * unreadable run views (with the first cause), or both.
       */
      readonly note?: string;
    }
  | { readonly kind: 'unavailable'; readonly reason: string };

/** The compound reading the verdict resolves — one struct, every leg present. */
export interface PrStateReading extends BindingHead {
  readonly number: number;
  /** The PR's html URL — the repository-scoped identity runs are matched against. */
  readonly url: string;
  /**
   * The author login as `gh pr view` spells it (`app/<slug>` for an App): the
   * records-class door opens only for a GitHub App's pull request
   * (`merge-bot/merge-records-checks.ts`).
   */
  readonly author: string;
  /** `OPEN` | `CLOSED` | `MERGED`. */
  readonly state: string;
  /** Draft PRs cannot merge via the sanctioned landing path — typed refusal. */
  readonly isDraft: boolean;
  /** `MERGEABLE` | `CONFLICTING` | `UNKNOWN`. */
  readonly mergeable: string;
  /** `CLEAN` | `BLOCKED` | `BEHIND` | `DIRTY` | `UNSTABLE` | … */
  readonly mergeStateStatus: string;
  readonly headRefOid: string;
  /** The branch the pull request merges into: the base each commit's content is read against. */
  readonly baseRefName: string;
  readonly checks: ChecksSummary;
  readonly namedChecks: readonly NamedCheck[];
  /** Max completedAt across green checks; null while checks are not yet green. */
  readonly checksGreenAt: string | null;
  readonly reviewThreads: ReviewThreadsSummary;
  readonly autoMergeArmed: boolean;
  /** Logins with an outstanding review request. */
  readonly reviewRequests: readonly string[];
  /**
   * Every round asked of a reviewer, and when: the review-request and
   * ready-for-review events and the `@codex review` comments
   * (`round-requests.ts`). A review bound by content waits for a round asked
   * after it.
   */
  readonly roundRequests: readonly RoundRequest[];
  /**
   * The DECLARED expected reviewer set (SKILL item 3: sourced from the
   * repository's automatic-review configuration, declared by the operator —
   * `--expect`). The gh seam defaults it from the observed surface when
   * undeclared, and the verdict names that gap in evidence.
   */
  readonly expectedReviewers: readonly string[];
  /** Whether the expected set was declared or defaulted from observation. */
  readonly expectedDeclared: boolean;
  /** The FULL paginated review harvest — never the latestReviews pointer. */
  readonly reviews: readonly HarvestedReview[];
  /**
   * The second transport of a reviewer's reported result: an expected
   * reviewer's completion comments, each read as a review bound to the one
   * commit it names (a failed run's as an error review) or refused by name,
   * and the vendor's notices about its own service, which the evidence
   * prints (`completion-comments.ts`). The legs read both transports; a
   * refusal is quoted in the verdict when that reviewer's leg is OWED or
   * timed out.
   */
  readonly completionComments: CompletionCommentReading;
  /**
   * The third transport: a vendor declared unavailable, read as a stand-in
   * for its review of the head it names, or refused by name
   * (`declared-unavailable.ts`). Empty when nothing is declared.
   */
  readonly declaredUnavailable: DeclaredUnavailableReading;
  readonly reviewRuns: ReviewRunsLeg;
  /**
   * The base branch's automatic-review configuration (the `copilot_code_review`
   * rule, read from the rules API with the reading): what the vendor reviews
   * on its own, so a leg is owed only where the configuration or a request
   * says so. `unread` keeps every expected leg owed, named as such.
   */
  readonly reviewConfiguration: ReviewConfiguration;
}

/** The closed verdict set. Adding a state is a reviewed contract change. */
export const PR_VERDICT_STATES = [
  'SETTLE-READY',
  'SETTLING-QUIET-WINDOW',
  'DRAFT',
  'WAITING-REVIEW-RUN-LIVE',
  'SILENT-WAIT-NO-REVIEWER',
  'SILENT-WAIT-RUN-DEAD',
  'SILENT-WAIT-RUNS-UNREADABLE',
  'CHECKS-RUNNING',
  'CHECKS-RED',
  'THREADS-OPEN',
  'BEHIND-BASE',
  'ARMED-BEHIND-RED',
  'QUOTA-SKIPPED',
  'SETTLED-NO-REVIEW',
  'UNCLASSIFIED-EVIDENCE',
  'MERGED',
  'CLOSED',
  'CONFLICT-DIRTY',
] as const;

type PrVerdictState = (typeof PR_VERDICT_STATES)[number];

/** The verdict: one closed state plus the evidence lines that ground it. */
export interface PrVerdict {
  readonly state: PrVerdictState;
  readonly evidence: readonly string[];
}
