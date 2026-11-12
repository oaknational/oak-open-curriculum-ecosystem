import { ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { parseRequiredChecks } from '../pr-watch/required-checks.js';
import type { CheckRunReading, FoldClockReading } from './fold-clock.js';
import type { ReviewerEvent } from './fold-clock-rounds.js';

/**
 * The fold clock's read boundary: four GitHub surfaces parsed to the exact
 * shape the clock needs (`strict-validation-at-boundary`), each a pure
 * function of one JSON value. Shapes verified live on pull request 326,
 * 2026-10-10: the issue timeline carries `ready_for_review`,
 * `review_requested` (with `requested_reviewer.login` "Copilot", type
 * "Bot") and `reviewed` (with `user.login` "Copilot" and `submitted_at`),
 * so requests and reviews pair on the timeline's own logins; the REST
 * reviews list names the same reviewer `copilot-pull-request-reviewer[bot]`
 * and is not read. The branch rules' required contexts parse through the
 * merge door's own reader (`pr-watch/required-checks.ts`), one definition
 * of "checks green by name" for both; the check-runs list on a commit
 * carries each run's name, conclusion and instants.
 */

const instant = z.iso.datetime();

const pullSchema = z.object({
  created_at: instant,
  merged_at: instant.nullable(),
  head: z.object({ sha: z.string().regex(/^[0-9a-f]{40}$/u) }),
  base: z.object({ ref: z.string().min(1) }),
});

export interface PullReading {
  readonly createdAt: string;
  readonly mergedAt: string | undefined;
  readonly headSha: string;
  readonly baseRef: string;
}

export function parsePull(value: unknown): Result<PullReading, Error> {
  const parsed = parseWithSchema({ label: 'fold-clock pull request', schema: pullSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  return ok({
    createdAt: parsed.value.created_at,
    mergedAt: parsed.value.merged_at ?? undefined,
    headSha: parsed.value.head.sha,
    baseRef: parsed.value.base.ref,
  });
}

const actorSchema = z.object({ login: z.string().min(1), type: z.string() });

const timelineItemSchema = z.object({
  event: z.string(),
  created_at: instant.nullish(),
  submitted_at: instant.nullish(),
  requested_reviewer: actorSchema.nullish(),
  user: actorSchema.nullish(),
});

/** `gh api --paginate --slurp` wraps the pages in one array. */
const timelineSchema = z.array(z.array(timelineItemSchema));

export interface TimelineReading {
  readonly readyMarks: readonly string[];
  readonly requests: readonly ReviewerEvent[];
  readonly reviews: readonly ReviewerEvent[];
}

type TimelineItem = z.output<typeof timelineItemSchema>;

function readyMark(item: TimelineItem): readonly string[] {
  return item.event === 'ready_for_review' && item.created_at != null ? [item.created_at] : [];
}

function botRequest(item: TimelineItem): readonly ReviewerEvent[] {
  const reviewer = item.requested_reviewer;
  if (item.event !== 'review_requested' || reviewer == null || item.created_at == null) {
    return [];
  }
  return reviewer.type === 'Bot' ? [{ at: item.created_at, login: reviewer.login }] : [];
}

function review(item: TimelineItem): readonly ReviewerEvent[] {
  if (item.event !== 'reviewed' || item.user == null || item.submitted_at == null) {
    return [];
  }
  return [{ at: item.submitted_at, login: item.user.login }];
}

export function parseTimeline(value: unknown): Result<TimelineReading, Error> {
  const parsed = parseWithSchema({ label: 'fold-clock timeline', schema: timelineSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  const items = parsed.value.flat();
  return ok({
    readyMarks: items.flatMap(readyMark),
    requests: items.flatMap(botRequest),
    reviews: items.flatMap(review),
  });
}

const checkRunsPageSchema = z.object({
  check_runs: z.array(
    z.object({
      name: z.string().min(1),
      conclusion: z.string().nullable(),
      started_at: instant.nullable(),
      completed_at: instant.nullable(),
    }),
  ),
});

/** `gh api --paginate --slurp` on a commit's check-runs: one page object per element. */
const checkRunsSchema = z.array(checkRunsPageSchema);

export function parseCheckRuns(value: unknown): Result<readonly CheckRunReading[], Error> {
  const parsed = parseWithSchema({
    label: 'fold-clock check runs',
    schema: checkRunsSchema,
    value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  return ok(
    parsed.value
      .flatMap((page) => page.check_runs)
      .map((run) => ({
        name: run.name,
        conclusion: run.conclusion ?? undefined,
        startedAt: run.started_at ?? undefined,
        completedAt: run.completed_at ?? undefined,
      })),
  );
}

const commitStatusPageSchema = z.object({
  statuses: z.array(
    z.object({
      context: z.string().min(1),
      state: z.string(),
      created_at: instant,
      updated_at: instant,
    }),
  ),
});

/** `gh api --paginate --slurp` on a commit's combined status: one combined object per page. */
const commitStatusSchema = z.array(commitStatusPageSchema);

/**
 * The combined status of a commit (`GET /commits/{sha}/status`: the latest
 * status per context) read as runs of their contexts, so a required context
 * that is a commit status (Vercel publishes no check-run) is judged beside
 * the check-runs. A terminal state is its conclusion and its update instant
 * its completion; `pending` is a run still open.
 */
export function parseCommitStatus(value: unknown): Result<readonly CheckRunReading[], Error> {
  const parsed = parseWithSchema({
    label: 'fold-clock commit status',
    schema: commitStatusSchema,
    value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  return ok(
    parsed.value
      .flatMap((page) => page.statuses)
      .map((status) => ({
        name: status.context,
        conclusion: status.state === 'pending' ? undefined : status.state,
        startedAt: status.created_at,
        completedAt: status.state === 'pending' ? undefined : status.updated_at,
      })),
  );
}

/** `gh api --paginate --slurp` on the branch rules: the pages flattened into the shared parser. */
const rulesPagesSchema = z.array(z.array(z.unknown()));

export function parseRequiredChecksPages(value: unknown): Result<readonly string[], Error> {
  const pages = parseWithSchema({
    label: 'fold-clock branch rules pages',
    schema: rulesPagesSchema,
    value,
  });
  return pages.ok ? parseRequiredChecks(pages.value.flat()) : pages;
}

export interface AssembleReadingInput {
  readonly prNumber: number;
  readonly pull: PullReading;
  readonly timeline: TimelineReading;
  readonly requiredChecks: readonly string[];
  readonly headCheckRuns: readonly CheckRunReading[];
  readonly successor:
    { readonly sha: string; readonly checkRuns: readonly CheckRunReading[] } | undefined;
}

/** The validated surfaces as the clock's one reading. */
export function assembleReading(input: AssembleReadingInput): FoldClockReading {
  return {
    prNumber: input.prNumber,
    headSha: input.pull.headSha,
    createdAt: input.pull.createdAt,
    readyMarks: input.timeline.readyMarks,
    mergedAt: input.pull.mergedAt,
    requests: input.timeline.requests,
    reviews: input.timeline.reviews,
    requiredChecks: input.requiredChecks,
    headCheckRuns: input.headCheckRuns,
    successor: input.successor,
  };
}
