import type { CheckBucket, ChecksSummary } from './index.js';
import type { ReviewThreadsSummary } from './review-threads.js';
import type { HarvestedReview } from './reviewer-legs.js';

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
       * True when the vendor list filled its window — older runs are
       * unobserved, so run-ABSENCE conclusions (deadness) are unsupported;
       * run PRESENCE (mapped live runs) remains evidence.
       */
      readonly truncated?: boolean;
      /** Human-readable truncation note for evidence lines. */
      readonly note?: string;
    }
  | { readonly kind: 'unavailable'; readonly reason: string };

/** The compound reading the verdict resolves — one struct, every leg present. */
export interface PrStateReading {
  readonly number: number;
  /** The PR's html URL — the repository-scoped identity runs are matched against. */
  readonly url: string;
  /** `OPEN` | `CLOSED` | `MERGED`. */
  readonly state: string;
  /** Draft PRs cannot merge via the sanctioned landing path — typed refusal. */
  readonly isDraft: boolean;
  /** `MERGEABLE` | `CONFLICTING` | `UNKNOWN`. */
  readonly mergeable: string;
  /** `CLEAN` | `BLOCKED` | `BEHIND` | `DIRTY` | `UNSTABLE` | … */
  readonly mergeStateStatus: string;
  readonly headRefOid: string;
  readonly checks: ChecksSummary;
  readonly namedChecks: readonly NamedCheck[];
  /** Max completedAt across green checks; null while checks are not yet green. */
  readonly checksGreenAt: string | null;
  readonly reviewThreads: ReviewThreadsSummary;
  readonly autoMergeArmed: boolean;
  /** Logins with an outstanding review request. */
  readonly reviewRequests: readonly string[];
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
  readonly reviewRuns: ReviewRunsLeg;
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
