import { z } from 'zod';

import type { ReviewRun } from './state-types.js';

/**
 * Boundary parsers for the `gh agent-task` review-run surfaces consumed by
 * `pr state` (split from `state-fields.ts` by responsibility): the list leg
 * (run liveness) and the view leg (the run→PR mapping).
 */

// `gh agent-task list --json id,name,createdAt,completedAt` — verified live
// 2026-07-21: the list surface carries NO PR number; `completedAt` null means
// the run is in flight.
const agentTaskListSchema = z.array(
  z
    .object({
      id: z.string(),
      name: z.string(),
      createdAt: z
        .string()
        .nullish()
        .transform((value) => value ?? ''),
      completedAt: z
        .string()
        .nullish()
        .transform((value) => value ?? null),
    })
    .loose(),
);

/**
 * Parse `gh agent-task list` JSON into review-run entries.
 *
 * @throws a ZodError when the payload is not the expected array shape.
 */
export function parseAgentTaskList(raw: unknown): ReviewRun[] {
  return agentTaskListSchema.parse(raw).map((run) => ({
    id: run.id,
    name: run.name,
    createdAt: run.createdAt,
    completedAt: run.completedAt,
  }));
}

// `gh agent-task view <id> --json id,completedAt,pullRequestNumber,pullRequestUrl`
// — verified live 2026-09-09: a run that opened no pull request carries
// EXPLICIT nulls (`pullRequestNumber: null, pullRequestUrl: null`), not absent
// keys, and the two fields are PAIRED (both set, or both null). Both null
// reads as "no mapping"; a bare `.optional()` rejected the null and one
// PR-less run anywhere in the window voided the leg for every PR. Both keys
// are REQUIRED: a view carrying neither, or a partial pair, is an unknown
// shape and fails the parse — the caller then treats the run as unobserved
// rather than as an observed, unrelated run (an omitted pair read as "no
// mapping" would drop a live run for this PR, the unsafe direction).
const agentTaskViewSchema = z
  .object({
    id: z.string(),
    completedAt: z
      .string()
      .nullish()
      .transform((value) => value ?? null),
    pullRequestNumber: z.number().nullable(),
    pullRequestUrl: z.string().nullable(),
  })
  .loose()
  // Validate the RAW states before normalising: the vendor sends both keys,
  // both with values or both explicit null. One null beside one value is an
  // unknown shape and fails the parse here (a missing key already failed
  // above), so a live run carrying it is unobserved rather than read as
  // "no mapping".
  .refine((view) => (view.pullRequestNumber === null) === (view.pullRequestUrl === null), {
    message: 'pullRequestNumber and pullRequestUrl must be both present or both null',
    path: ['pullRequestUrl'],
  });

/** One `gh agent-task view <id>` result — the surface carrying the run→PR map. */
export interface AgentTaskView {
  readonly id: string;
  readonly completedAt: string | null;
  readonly pullRequestNumber?: number;
  readonly pullRequestUrl?: string;
}

/**
 * Parse `gh agent-task view <id>` JSON (the run→PR mapping surface).
 *
 * @throws a ZodError when the payload is not the expected object shape.
 */
export function parseAgentTaskView(raw: unknown): AgentTaskView {
  const parsed = agentTaskViewSchema.parse(raw);
  // Both null (the verified PR-less shape) reads as no mapping.
  const pullRequestNumber = parsed.pullRequestNumber ?? undefined;
  const pullRequestUrl = parsed.pullRequestUrl ?? undefined;
  return {
    id: parsed.id,
    completedAt: parsed.completedAt,
    ...(pullRequestNumber === undefined ? {} : { pullRequestNumber }),
    ...(pullRequestUrl === undefined ? {} : { pullRequestUrl }),
  };
}
