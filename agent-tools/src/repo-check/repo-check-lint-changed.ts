import { stripVTControlCharacters } from 'node:util';

import { z } from 'zod';

import { writeLine } from '../core/terminal-output.js';

import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';

/**
 * The pre-commit workspace lint: `turbo run lint` over the workspaces changed
 * since `HEAD` (and their dependents), skipped when that scope holds no task.
 *
 * Why the skip exists: turbo prints the warning "No tasks were executed as part
 * of this run." for every run whose task graph is empty, which is every commit
 * that changes no workspace (a root Markdown change scopes to the root package
 * alone, and the root declares no lint task). turbo 2.10 has no flag that makes
 * an empty scope a silent no-op (`turbo run --help`; the run reference at
 * turborepo.dev documents none), so a green docs-only commit printed a warning
 * every time. Readers learn to skip a warning that is always there; that is
 * the harm.
 *
 * Why turbo decides the skip: the step asks turbo for the task graph it would
 * run, a dry run under the same filter, rather than mapping changed paths to
 * workspaces itself. turbo's change detection (the working tree against
 * `HEAD`, dependents through `...`) is then the only answer, so the skip can
 * never disagree with the run it replaces.
 *
 * Why only the dry run is captured: it runs no task and leaves no process
 * behind, so a pipe on its output is safe. The lint run itself keeps inherited
 * output, because a pipe over a running gate chain is the F-112 failure
 * (`repo-check-runner.ts` and `core/file-backed-child.ts` carry the account).
 *
 * Why the dry run reads the local cache only (`--cache=local:rw`): a dry run
 * consults the caches only to mark each planned task hit or miss, a field this
 * step never reads, and it executes and writes nothing. Reaching the remote
 * cache made the plan depend on the network and on the host's token: turbo
 * 2.11.2 exits 0 and writes a WARNING line, "Remote caching unavailable
 * (Authentication failed — check TURBO_TOKEN or run turbo login)", when the
 * token has lapsed, which this step reads as the diagnostic it is and fails
 * the commit (2026-09-29, an expired `turbo login`). A source `--cache` omits
 * is neither read nor written, and the flag outranks `TURBO_CACHE`, so no host
 * setting reopens the remote leg. `local:rw`, not `local:r`: a host's
 * `TURBO_FORCE=true` meets `local:r` with "WARNING no caches are enabled" and
 * meets `local:rw` silently, and a dry run writes nothing either way. The lint
 * run keeps turbo's default caches, so its results are cached and a lapsed
 * token still shows there, where a cache matters.
 *
 * @packageDocumentation
 */

const CHANGED_SINCE_HEAD = '--filter=...[HEAD]';

const DRY_RUN_ARGS: readonly string[] = [
  'exec',
  'turbo',
  'run',
  'lint',
  CHANGED_SINCE_HEAD,
  '--dry-run=json',
  '--cache=local:rw',
];

const LINT_ARGS: readonly string[] = [
  'exec',
  'turbo',
  'run',
  'lint',
  CHANGED_SINCE_HEAD,
  '--output-logs=errors-only',
];

/** The one field of turbo's dry-run JSON the skip decision reads. */
const dryRunPlanSchema = z.object({ tasks: z.array(z.unknown()) });

/**
 * The number of tasks in turbo's dry-run plan.
 *
 * @param dryRunJson - stdout of `turbo run <task> --dry-run=json`.
 * @returns the planned task count; 0 means the run would execute nothing.
 * @throws when the output is not JSON or carries no task list: a changed plan
 *   shape must fail the gate, never read as an empty plan that skips the lint.
 */
export function plannedTaskCount(dryRunJson: string): number {
  let parsed: unknown;
  try {
    parsed = JSON.parse(dryRunJson);
  } catch (cause) {
    throw new Error('the turbo dry run did not print a JSON plan', { cause });
  }
  const plan = dryRunPlanSchema.safeParse(parsed);
  if (!plan.success) {
    throw new Error('the turbo dry run printed a plan with no task list');
  }
  return plan.data.tasks.length;
}

/**
 * turbo's version banner, matched once colour codes are stripped (turbo dims
 * it under CLICOLOR_FORCE). On turbo 2.10.13 a successful dry run writes it to
 * stderr every time (a clean tree, a workspace change and a global dependency
 * change alike).
 */
const VERSION_BANNER = /^• turbo \d+\.\d+\.\d+$/u;

/**
 * turbo 2.10.13's one-time telemetry notice. It precedes the banner on the
 * first run under a turbo config directory that has not yet shown it (a new
 * machine, user or container). It is informational and never hidden: it is
 * replayed with the rest of stderr after a dry run that exits 0, and carried
 * in the thrown message of one that does not.
 */
const TELEMETRY_NOTICE: ReadonlySet<string> = new Set([
  'Attention:',
  'Turborepo now collects completely anonymous telemetry regarding usage.',
  'This information is used to shape the Turborepo roadmap and prioritize features.',
  "You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:",
  'https://turborepo.dev/docs/telemetry',
]);

/**
 * The diagnostic lines of a successful dry run's stderr.
 *
 * Every non-blank line other than turbo's version banner and its one-time
 * telemetry notice is one, compared without its colour codes: turbo's
 * `WARNING` lines (a deprecated setting such as TURBO_REMOTE_CACHE_READ_ONLY
 * exits 0 and prints them) and whatever pnpm or node writes. A line of a shape
 * this step does not know fails the gate rather than passing unread, as a plan
 * with no task list does.
 *
 * @param stderr - stderr of a `turbo run <task> --dry-run=json` that exited 0.
 * @returns the diagnostic lines, trimmed and without colour codes; empty when
 *   stderr holds only the banner and the notice.
 */
export function dryRunDiagnostics(stderr: string): readonly string[] {
  return stderr
    .split('\n')
    .map((line) => stripVTControlCharacters(line).trim())
    .filter((line) => line.length > 0 && !VERSION_BANNER.test(line) && !TELEMETRY_NOTICE.has(line));
}

/**
 * Describe a failed dry run: how it ended, then turbo's own message. A signal
 * death is named as such, never folded into an exit code (F-112).
 */
function dryRunFailure(plan: RepoCheckCommandResult): string {
  const ending =
    plan.status === null ? `signal ${plan.signal ?? 'unknown'}` : `exit ${plan.status}`;
  const reason = plan.stderr.trim();
  const detail = reason.length > 0 ? `: ${reason}` : '';
  return `the turbo dry run planning the workspace lint ended with ${ending}${detail}`;
}

/** Where the step's own lines go; tests inject collectors. */
export interface LintChangedTerminal {
  /** A whole line for stdout. */
  readonly line: (message: string) => void;
  /** Captured child stderr, replayed verbatim. */
  readonly errorText: (text: string) => void;
}

const processTerminal: LintChangedTerminal = {
  line: writeLine,
  errorText: (text) => {
    process.stderr.write(text);
  },
};

/**
 * Lint the workspaces changed since `HEAD`, or say that nothing changed.
 *
 * A successful dry run's stderr is replayed verbatim, so nothing turbo prints
 * while planning is swallowed (its one-time telemetry notice included), and
 * is then read before the plan. Any line other than turbo's version banner and
 * telemetry notice is a diagnostic and fails the step whether or not the plan
 * holds a task, because a green gate prints no warning (no-warning-toleration)
 * and a replayed one would otherwise still exit 0.
 *
 * @returns the lint run's exit code, or 0 when the plan holds no task.
 * @throws when the dry run fails, writes a diagnostic to stderr, or prints an
 *   unreadable plan.
 */
export async function runLintChanged(
  runtime: RepoCheckRuntime = defaultRuntime,
  terminal: LintChangedTerminal = processTerminal,
): Promise<number> {
  const plan = runtime.runCaptured('pnpm', DRY_RUN_ARGS);
  if (plan.status !== 0) {
    throw new Error(dryRunFailure(plan));
  }
  if (plan.stderr.length > 0) {
    terminal.errorText(plan.stderr);
  }
  const diagnostics = dryRunDiagnostics(plan.stderr);
  if (diagnostics.length > 0) {
    throw new Error(
      `the turbo dry run planning the workspace lint exited 0 but wrote diagnostics to stderr, which fail the step:\n${diagnostics.join('\n')}`,
    );
  }
  if (plannedTaskCount(plan.stdout) === 0) {
    terminal.line('repo-check lint-changed: turbo plans no lint task for the changes since HEAD');
    return 0;
  }
  return runtime.runInherited('pnpm', LINT_ARGS);
}
