import { ZodError } from 'zod';

import { GH_EXEC_OPTIONS, parseGhJson, type GhCommandExecutor } from './gh.js';
import { parseAgentTaskList, parseAgentTaskView, type AgentTaskView } from './agent-task-fields.js';
import type { ReviewRun, ReviewRunsLeg } from './state-types.js';

/**
 * The `gh agent-task` review-run leg of `pr state`: list the vendor's run
 * sessions, map them to THIS PR, and degrade typed when the surface is
 * unavailable.
 *
 * Run→PR mapping is view-per-session-id (the list surface carries no PR
 * number — verified live 2026-07-21), so the mapping is BOUNDED: every
 * in-flight run is mapped, completed runs cap at
 * {@link COMPLETED_RUN_MAP_LIMIT} most-recent. A missing or failing
 * `gh agent-task list` degrades the leg to a TYPED `unavailable`; a single
 * run whose VIEW cannot be read or parsed is that run's gap only — it is
 * named on the note, and marks the leg `truncated` when the run was live.
 */

const COMPLETED_RUN_MAP_LIMIT = 5;

// The vendor list defaults to the latest 30 sessions; request the full
// supported window and mark residual truncation explicitly (absence beyond
// the window is unobserved, never concluded).
const AGENT_TASK_LIST_LIMIT = 100;

const AGENT_TASK_LIST_ARGS = [
  'agent-task',
  'list',
  '--limit',
  String(AGENT_TASK_LIST_LIMIT),
  '--json',
  'id,name,createdAt,completedAt',
] as const;

function describeError(error: unknown): string {
  if (error instanceof ZodError) {
    // A ZodError's message is the pretty-printed issue array; the evidence
    // line wants the first issue and where it bit.
    const [issue] = error.issues;
    if (issue === undefined) {
      return error.message;
    }
    // A root-level issue has an empty path: no location to name.
    const location = issue.path.map(String).join('.');
    return location === '' ? issue.message : `${issue.message} at ${location}`;
  }
  return error instanceof Error ? error.message : String(error);
}

function mapRunsToPr(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: number;
  readonly prUrl: string;
  readonly runs: readonly ReviewRun[];
}): ReviewRunsLeg {
  const live = input.runs.filter((run) => run.completedAt === null);
  const completed = input.runs
    .filter((run) => run.completedAt !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, COMPLETED_RUN_MAP_LIMIT);
  const scoped: ReviewRun[] = [];
  const unobserved: UnreadableRun[] = [];
  for (const run of [...live, ...completed]) {
    const view = readRunView(input, run.id);
    if (typeof view === 'string') {
      // One run's unreadable view is THAT run's gap, never the surface's:
      // the other runs still map, and the gap is named on the note. Only a
      // LIVE run's gap withholds absence conclusions — the list already
      // proves a completed run is not live, so it cannot hide a live one.
      unobserved.push({ id: run.id, live: run.completedAt === null, reason: view });
      continue;
    }
    if (mapsToPr(view, input)) {
      // The view read is fresher than the list snapshot: a run that completed
      // between the two reads must not report live.
      scoped.push({ ...run, completedAt: view.completedAt });
    }
  }
  const notes = gapNotes(input.runs.length, unobserved);
  const truncated =
    input.runs.length >= AGENT_TASK_LIST_LIMIT || unobserved.some((run) => run.live);
  return {
    kind: 'read',
    runs: scoped,
    ...(truncated ? { truncated } : {}),
    ...(notes.length > 0 ? { note: notes.join('; ') } : {}),
  };
}

/**
 * PR numbers are repository-local: the URL is the repository-scoped identity
 * and must agree, so another repo's #N never backs this PR's legs. The
 * vendor pairs the two fields (both set, or both null — verified live
 * 2026-09-09), so a number without a URL is no mapping.
 */
function mapsToPr(
  view: AgentTaskView,
  target: { readonly prNumber: number; readonly prUrl: string },
): boolean {
  return view.pullRequestNumber === target.prNumber && view.pullRequestUrl === target.prUrl;
}

// An evidence line is copied into records; name a few ids, count the rest.
const NAMED_UNREADABLE_LIMIT = 3;

/**
 * The gap notes for the evidence line: a full list window (older runs
 * unobserved) and any run views that could not be read. The cause travels
 * with the view gap (the first failure's first line) so an operator still
 * sees WHY, as the whole-leg `unavailable` reason used to show it.
 */
function gapNotes(listed: number, unobserved: readonly UnreadableRun[]): string[] {
  const notes: string[] = [];
  if (listed >= AGENT_TASK_LIST_LIMIT) {
    notes.push(`agent-task list truncated at ${AGENT_TASK_LIST_LIMIT} — older runs unobserved`);
  }
  const [first] = unobserved;
  if (first !== undefined) {
    const named = unobserved.slice(0, NAMED_UNREADABLE_LIMIT).map((run) => run.id);
    const rest = unobserved.length - named.length;
    const ids = rest > 0 ? `${named.join(', ')} +${rest} more` : named.join(', ');
    const cause = first.reason.split('\n')[0] ?? first.reason;
    notes.push(`agent-task view unreadable for ${ids} — those runs unobserved (first: ${cause})`);
  }
  return notes;
}

interface UnreadableRun {
  readonly id: string;
  /** From the list read: a live run's gap withholds deadness; a completed run's does not. */
  readonly live: boolean;
  readonly reason: string;
}

/** Read one run's view; the failure's description when it cannot be read or parsed. */
function readRunView(
  input: { readonly run: GhCommandExecutor; readonly gh: string },
  runId: string,
): AgentTaskView | string {
  try {
    return parseAgentTaskView(
      parseGhJson(
        input.run(
          input.gh,
          [
            'agent-task',
            'view',
            runId,
            '--json',
            'id,completedAt,pullRequestNumber,pullRequestUrl',
          ],
          GH_EXEC_OPTIONS,
        ),
        'agent-task view',
      ),
    );
  } catch (error) {
    return describeError(error);
  }
}

/** Read and PR-scope the review-run leg; failures degrade typed, never throw. */
export function readReviewRunsLeg(input: {
  readonly run: GhCommandExecutor;
  readonly gh: string;
  readonly prNumber: number;
  readonly prUrl: string;
}): ReviewRunsLeg {
  try {
    const listRaw = parseGhJson(
      input.run(input.gh, AGENT_TASK_LIST_ARGS, GH_EXEC_OPTIONS),
      'agent-task list',
    );
    return mapRunsToPr({ ...input, runs: parseAgentTaskList(listRaw) });
  } catch (error) {
    return { kind: 'unavailable', reason: describeError(error) };
  }
}
