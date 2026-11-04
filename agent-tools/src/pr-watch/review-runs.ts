import { GH_EXEC_OPTIONS, parseGhJson, type GhCommandExecutor } from './gh.js';
import { parseAgentTaskList, parseAgentTaskView } from './agent-task-fields.js';
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
 * `gh agent-task` degrades the leg to a TYPED `unavailable`.
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
  return error instanceof Error ? error.message : String(error);
}

function mapRunsToPr(input: {
  readonly run: GhCommandExecutor;
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
  for (const run of [...live, ...completed]) {
    const viewRaw = parseGhJson(
      input.run(
        'gh',
        ['agent-task', 'view', run.id, '--json', 'id,completedAt,pullRequestNumber,pullRequestUrl'],
        GH_EXEC_OPTIONS,
      ),
      'agent-task view',
    );
    const view = parseAgentTaskView(viewRaw);
    // PR numbers are repository-local: require the URL to agree when the
    // vendor supplies one, so another repo's #N never backs this PR's legs.
    const sameRepoPr =
      view.pullRequestNumber === input.prNumber &&
      (view.pullRequestUrl === undefined || view.pullRequestUrl === input.prUrl);
    if (sameRepoPr) {
      // The view read is fresher than the list snapshot: a run that completed
      // between the two reads must not report live.
      scoped.push({ ...run, completedAt: view.completedAt });
    }
  }
  // A full window is typed truncation, not just a note: absence conclusions
  // (deadness) must not rest on data that may have dropped the very run.
  const truncated = input.runs.length >= AGENT_TASK_LIST_LIMIT;
  return {
    kind: 'read',
    runs: scoped,
    ...(truncated
      ? {
          truncated,
          note: `agent-task list truncated at ${AGENT_TASK_LIST_LIMIT} — older runs unobserved`,
        }
      : {}),
  };
}

/** Read and PR-scope the review-run leg; failures degrade typed, never throw. */
export function readReviewRunsLeg(input: {
  readonly run: GhCommandExecutor;
  readonly prNumber: number;
  readonly prUrl: string;
}): ReviewRunsLeg {
  try {
    const listRaw = parseGhJson(
      input.run('gh', AGENT_TASK_LIST_ARGS, GH_EXEC_OPTIONS),
      'agent-task list',
    );
    return mapRunsToPr({ ...input, runs: parseAgentTaskList(listRaw) });
  } catch (error) {
    return { kind: 'unavailable', reason: describeError(error) };
  }
}
