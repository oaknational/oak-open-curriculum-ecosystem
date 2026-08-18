import { z } from 'zod';

import { blockingRank, latestRunPerCheck } from './check-rollup.js';
import { classifyCheck, type ChecksSummary } from './index.js';
import type { HarvestedReview } from './reviewer-legs.js';
import type { NamedCheck } from './state-types.js';

/**
 * Boundary parsers for the `pr state` legs that the existing snapshot does not
 * carry: named per-check verdicts with the checks-green timestamp, auto-merge
 * intent, review requests, the FULL paginated review harvest (the
 * `latestReviews` per-author pointer is deliberately NOT a source here — it
 * moves backwards when an older-tip review job completes late), and
 * `gh agent-task` review-run shapes. Zod at the external boundary; misshapen
 * input fails loud, while fields GitHub genuinely nulls normalise explicitly.
 */

// Superset of the pr-watch rollup schema: D1 additionally carries the check's
// NAME (CheckRun `name`, StatusContext `context`) — the #437 cure — and the
// CheckRun `completedAt` that anchors the checks-green timeout leg.
const namedRollupItemSchema = z
  .object({
    __typename: z.string(),
    name: z.string().optional(),
    context: z.string().optional(),
    workflowName: z.string().nullish(),
    status: z.string().optional(),
    conclusion: z.string().nullish(),
    state: z.string().optional(),
    completedAt: z.string().nullish(),
    startedAt: z.string().nullish(),
  })
  .loose();

// A review request names a User (`login`) or a Team (`slug`, with `name` as a
// fallback). An entry with NO identity field is misshapen external input and
// fails loud at the boundary (strict-validation-at-boundary): transforming it
// to 'unknown' would mint a real reviewer identifier that drives leg
// verdicts.
const reviewRequestSchema = z
  .object({
    login: z.string().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
  })
  .loose()
  .refine((value) => (value.login ?? value.slug ?? value.name) !== undefined, {
    message: 'review request carries no User/Team identity field (login/slug/name)',
  })
  .transform((value) => value.login ?? value.slug ?? value.name ?? 'unknown');

const stateViewSchema = z.object({
  number: z.number(),
  url: z.string(),
  state: z.string(),
  // Drafts cannot merge via the sanctioned landing path — the verdict core
  // refuses them typed before any settlement read.
  isDraft: z.boolean(),
  mergeable: z.string(),
  mergeStateStatus: z.string(),
  headRefOid: z.string(),
  statusCheckRollup: z
    .array(namedRollupItemSchema)
    .nullish()
    .transform((value) => value ?? []),
  // Armed iff GitHub returns an auto-merge object; null/absent means unarmed.
  autoMergeRequest: z
    .object({})
    .loose()
    .nullish()
    .transform((value) => value !== null && value !== undefined),
  reviewRequests: z
    .array(reviewRequestSchema)
    .nullish()
    .transform((value) => value ?? []),
});

/** The exact `--json` field set the `pr state` gh call requests. */
export const PR_STATE_VIEW_JSON_FIELDS = [
  'number',
  'url',
  'state',
  'isDraft',
  'mergeable',
  'mergeStateStatus',
  'headRefOid',
  'statusCheckRollup',
  'autoMergeRequest',
  'reviewRequests',
] as const;

/** The parsed `gh pr view` legs specific to `pr state`. */
export interface ParsedStateView {
  readonly number: number;
  readonly url: string;
  readonly state: string;
  readonly isDraft: boolean;
  readonly mergeable: string;
  readonly mergeStateStatus: string;
  readonly headRefOid: string;
  readonly checks: ChecksSummary;
  readonly namedChecks: readonly NamedCheck[];
  readonly checksGreenAt: string | null;
  readonly autoMergeArmed: boolean;
  readonly reviewRequests: readonly string[];
}

type NamedRollupItem = z.infer<typeof namedRollupItemSchema>;

function checkName(item: NamedRollupItem): string {
  return item.name ?? item.context ?? 'unnamed check';
}

function summarise(namedChecks: readonly NamedCheck[]): ChecksSummary {
  return {
    total: namedChecks.length,
    passed: namedChecks.filter((check) => check.bucket === 'passed').length,
    failed: namedChecks.filter((check) => check.bucket === 'failed').length,
    pending: namedChecks.filter((check) => check.bucket === 'pending').length,
  };
}

// Green means every check passed; the anchor is the LATEST timestamp any item
// reports — CheckRun `completedAt`, or StatusContext `startedAt` (its creation
// time; StatusContext has no completion timestamp). Null when the rollup is
// not green — or when ANY green item carries no timestamp: a max over the
// PRESENT timestamps can pre-date the unanchored item's green moment, so a
// partial anchor is unknown, not "latest known". A null anchor keeps the
// timeout leg conservatively un-fireable rather than firing off a wrong time.
function checksGreenAt(items: readonly NamedRollupItem[], summary: ChecksSummary): string | null {
  if (summary.total === 0 || summary.failed > 0 || summary.pending > 0) {
    return null;
  }
  const completions = items.map((item) => item.completedAt ?? item.startedAt ?? null);
  const present = completions
    .filter((value): value is string => value !== null)
    .sort((left, right) => left.localeCompare(right));
  if (present.length !== completions.length) {
    return null;
  }
  return present.at(-1) ?? null;
}

/**
 * Parse the extended `gh pr view --json` payload for `pr state`.
 *
 * @throws a ZodError when the payload is not the expected gh shape (strict
 *   validation at the external-input boundary).
 */
export function parseStateView(raw: unknown): ParsedStateView {
  const parsed = stateViewSchema.parse(raw);
  const liveChecks = latestRunPerCheck(parsed.statusCheckRollup, (item) =>
    blockingRank(classifyCheck(item)),
  );
  const namedChecks = liveChecks.map((item) => ({
    name: checkName(item),
    bucket: classifyCheck(item),
  }));
  const checks = summarise(namedChecks);
  return {
    number: parsed.number,
    url: parsed.url,
    state: parsed.state,
    isDraft: parsed.isDraft,
    mergeable: parsed.mergeable,
    mergeStateStatus: parsed.mergeStateStatus,
    headRefOid: parsed.headRefOid,
    checks,
    namedChecks,
    checksGreenAt: checksGreenAt(liveChecks, checks),
    autoMergeArmed: parsed.autoMergeRequest,
    reviewRequests: parsed.reviewRequests,
  };
}

const authorLogin = z
  .object({ login: z.string() })
  .nullish()
  .transform((value) => value?.login ?? 'unknown');

// One page of the paginated `reviews` connection as `gh api graphql --paginate
// --slurp` returns it. The FULL harvest is the reviewer-leg source (SKILL item
// 3); a bounded `reviews(last:N)` read is the recorded wrong shape.
const reviewsPageSchema = z.object({
  data: z.object({
    repository: z.object({
      pullRequest: z.object({
        reviews: z.object({
          nodes: z.array(
            z.object({
              author: authorLogin,
              state: z.string(),
              body: z.string(),
              submittedAt: z
                .string()
                .nullish()
                .transform((value) => value ?? ''),
              commit: z
                .object({ oid: z.string() })
                .nullish()
                .transform((value) => value?.oid ?? ''),
            }),
          ),
        }),
      }),
    }),
  }),
});

const reviewsPagesSchema = z.array(reviewsPageSchema).min(1);

/**
 * Parse the slurped multi-page `reviews` harvest into {@link HarvestedReview}s.
 *
 * @throws a ZodError when the input is not the expected slurped page-array
 *   shape (never a silent empty — an empty harvest must be a real empty page).
 */
export function parseReviewsHarvest(raw: unknown): HarvestedReview[] {
  return reviewsPagesSchema
    .parse(raw)
    .flatMap((page) => page.data.repository.pullRequest.reviews.nodes)
    .map((node) => ({
      author: node.author,
      state: node.state,
      body: node.body,
      commitOid: node.commit,
      submittedAt: node.submittedAt,
    }));
}
