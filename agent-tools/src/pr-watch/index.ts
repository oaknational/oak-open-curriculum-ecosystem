import { z } from 'zod';

/**
 * Pure core for the `pr-watch` command: parse the `gh pr view` JSON surface
 * into a normalized {@link PrSnapshot}, summarise its checks, diff two
 * snapshots into human-readable change lines, and format a snapshot for
 * display. All functions here are pure — the `gh` IO seam lives in `gh.ts`.
 */

/** Coarse bucket a single status check resolves to. */
export type CheckBucket = 'passed' | 'failed' | 'pending';

/** Aggregate counts of a pull request's status checks. */
export interface ChecksSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly pending: number;
}

/**
 * A reference to one comment, enough to detect a NEW one and name its author.
 * Review (inline) comments — where Bugbot / Copilot post — and issue comments
 * are both carried, because a count-only monitor is blind to bot findings (the
 * recorded PR #220 failure mode).
 */
export interface CommentRef {
  readonly id: string;
  readonly author: string;
}

/** A normalized, merge-readiness-relevant snapshot of a pull request. */
export interface PrSnapshot {
  readonly number: number;
  /** `OPEN` | `CLOSED` | `MERGED`. */
  readonly state: string;
  /** `MERGEABLE` | `CONFLICTING` | `UNKNOWN`. */
  readonly mergeable: string;
  /** `CLEAN` | `BLOCKED` | `BEHIND` | `DIRTY` | `UNSTABLE` | `HAS_HOOKS` | … */
  readonly mergeStateStatus: string;
  /** `APPROVED` | `CHANGES_REQUESTED` | `REVIEW_REQUIRED` | `''` (none required). */
  readonly reviewDecision: string;
  readonly headRefOid: string;
  readonly checks: ChecksSummary;
  /** Inline review comments (the surface bots post findings on). */
  readonly reviewComments: readonly CommentRef[];
  /** Top-level issue comments on the PR conversation. */
  readonly issueComments: readonly CommentRef[];
}

// One lenient shape covering both rollup item kinds: a `CheckRun`
// (`status` + `conclusion`) and a legacy `StatusContext` (`state`). A flat
// schema with optional fields (rather than a discriminated union) keeps
// classification type-safe AND forward-compatible — an unrecognised
// `__typename` parses and is counted as pending rather than rejected.
const rollupItemSchema = z
  .object({
    __typename: z.string(),
    status: z.string().optional(),
    conclusion: z.string().nullish(),
    state: z.string().optional(),
  })
  .loose();

// Author can be null on GitHub (deleted account); fall back to "unknown".
const authorLogin = z
  .object({ login: z.string() })
  .nullish()
  .transform((value) => value?.login ?? 'unknown');

const issueCommentSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  author: authorLogin,
});

const prStateSchema = z.object({
  number: z.number(),
  state: z.string(),
  mergeable: z.string(),
  mergeStateStatus: z.string(),
  // GitHub returns `null` (not `''`) when the repo has no required-review
  // policy; normalise both to `''`. The other fields are never null on a real
  // PR, so they stay strict — a null there is a genuine schema break worth a
  // loud failure rather than a silent default.
  reviewDecision: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  headRefOid: z.string(),
  // GitHub returns `null` (not `[]`) for statusCheckRollup on a PR that has had
  // no checks; comments can be absent. Normalise null/undefined to `[]`, but a
  // non-array (genuinely malformed gh output) still fails loud rather than
  // silently degrading to "no checks" (no-masking).
  statusCheckRollup: z
    .array(rollupItemSchema)
    .nullish()
    .transform((value) => value ?? []),
  comments: z
    .array(issueCommentSchema)
    .nullish()
    .transform((value) => value ?? []),
});

// `gh api repos/{owner}/{repo}/pulls/<n>/comments` returns REST-shaped items:
// numeric `id` and `user.login` (vs the GraphQL `author.login` of pr view).
const reviewCommentSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  user: z
    .object({ login: z.string() })
    .nullish()
    .transform((value) => value?.login ?? 'unknown'),
});

const reviewCommentsSchema = z.array(reviewCommentSchema);

/** The exact `--json` field set {@link readPrSnapshot} requests from `gh pr view`. */
export const PR_VIEW_JSON_FIELDS = [
  'number',
  'state',
  'mergeable',
  'mergeStateStatus',
  'reviewDecision',
  'headRefOid',
  'statusCheckRollup',
  'comments',
] as const;

const PASSED_CONCLUSIONS = new Set(['SUCCESS', 'NEUTRAL', 'SKIPPED']);
const FAILED_CONCLUSIONS = new Set([
  'FAILURE',
  'CANCELLED',
  'TIMED_OUT',
  'ACTION_REQUIRED',
  'STARTUP_FAILURE',
  'STALE',
]);

type RollupItem = z.infer<typeof rollupItemSchema>;

function classifyCheckRun(
  status: string | undefined,
  conclusion: string | null | undefined,
): CheckBucket {
  if (status !== 'COMPLETED' || conclusion === null || conclusion === undefined) {
    return 'pending';
  }
  if (PASSED_CONCLUSIONS.has(conclusion)) {
    return 'passed';
  }
  return FAILED_CONCLUSIONS.has(conclusion) ? 'failed' : 'pending';
}

function classifyStatusContext(state: string | undefined): CheckBucket {
  if (state === 'SUCCESS') {
    return 'passed';
  }
  return state === 'FAILURE' || state === 'ERROR' ? 'failed' : 'pending';
}

/**
 * Classify one status-check rollup item. Unknown or not-yet-complete states
 * resolve to `pending` (conservative: never falsely `passed`, never crying
 * `failed` on an unrecognised state).
 */
export function classifyCheck(item: RollupItem): CheckBucket {
  if (item.__typename === 'CheckRun') {
    return classifyCheckRun(item.status, item.conclusion);
  }
  if (item.__typename === 'StatusContext') {
    return classifyStatusContext(item.state);
  }
  return 'pending';
}

function summariseChecks(items: readonly RollupItem[]): ChecksSummary {
  let passed = 0;
  let failed = 0;
  let pending = 0;
  for (const item of items) {
    const bucket = classifyCheck(item);
    if (bucket === 'passed') {
      passed += 1;
    } else if (bucket === 'failed') {
      failed += 1;
    } else {
      pending += 1;
    }
  }
  return { total: items.length, passed, failed, pending };
}

/**
 * Parse the `gh api …/pulls/<n>/comments` array into comment refs.
 *
 * @throws a ZodError when the input is not the expected REST array shape.
 */
export function parseReviewComments(raw: unknown): CommentRef[] {
  return reviewCommentsSchema.parse(raw).map((comment) => ({
    id: comment.id,
    author: comment.user,
  }));
}

/**
 * Build a {@link PrSnapshot} from the two `gh` surfaces: the `gh pr view --json`
 * object (state, checks, issue comments) and the `gh api …/pulls/<n>/comments`
 * array (inline review comments — where bots post findings).
 *
 * @throws a ZodError when either input does not match the expected gh shape
 *   (strict validation at the external-input boundary).
 */
export function buildSnapshot(prViewRaw: unknown, reviewCommentsRaw: unknown): PrSnapshot {
  const parsed = prStateSchema.parse(prViewRaw);
  return {
    number: parsed.number,
    state: parsed.state,
    mergeable: parsed.mergeable,
    mergeStateStatus: parsed.mergeStateStatus,
    reviewDecision: parsed.reviewDecision,
    headRefOid: parsed.headRefOid,
    checks: summariseChecks(parsed.statusCheckRollup),
    issueComments: parsed.comments.map((comment) => ({ id: comment.id, author: comment.author })),
    reviewComments: parseReviewComments(reviewCommentsRaw),
  };
}
