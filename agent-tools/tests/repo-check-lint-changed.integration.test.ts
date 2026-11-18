import { describe, expect, it } from 'vitest';

import { runLintChanged } from '../src/repo-check/repo-check-lint-changed';
import type { RepoCheckCommandResult, RepoCheckRuntime } from '../src/repo-check/repo-check';

const DEPRECATION_WARNING =
  ' WARNING  TURBO_REMOTE_CACHE_READ_ONLY is deprecated and will be removed in a future major version. Use TURBO_CACHE=remote:r';

/** A lint run the step must not reach: reaching it is a failure with its own name. */
const UNREACHABLE_LINT = 'unreachable' as const;

/** The step's own lines, collected so the runner's output stays clean and they are assertable. */
function collectingTerminal() {
  const lines: string[] = [];
  const errorText: string[] = [];
  return {
    lines,
    errorText,
    terminal: {
      line: (message: string) => {
        lines.push(message);
      },
      errorText: (text: string) => {
        errorText.push(text);
      },
    },
  };
}

/**
 * A fake runtime that answers the one captured call the step issues (turbo's
 * dry run) with a literal result. The lint run ends with the given code, or
 * rejects by name when the test declares it unreachable, so a step that ran
 * the lint before failing rejects for the wrong reason.
 */
function lintChangedHarness(input: {
  readonly plan: Partial<RepoCheckCommandResult>;
  readonly lint: number | typeof UNREACHABLE_LINT;
}) {
  const runtime: RepoCheckRuntime = {
    runCaptured: () => ({ status: 0, signal: null, stdout: '', stderr: '', ...input.plan }),
    runInherited: () =>
      input.lint === UNREACHABLE_LINT
        ? Promise.reject(new Error('the lint ran'))
        : Promise.resolve(input.lint),
  };
  return { runtime, ...collectingTerminal() };
}

describe('repo-check lint-changed', () => {
  it('skips the lint run, and says so, when turbo plans no task for the changed scope', async () => {
    const harness = lintChangedHarness({
      plan: {
        stdout: JSON.stringify({ packages: ['//'], tasks: [] }),
        stderr: '• turbo 2.10.13\n',
      },
      lint: UNREACHABLE_LINT,
    });

    // Any lint invocation rejects, so a 0 here means the lint did not run at all.
    await expect(runLintChanged(harness.runtime, harness.terminal)).resolves.toBe(0);

    expect(harness.lines).toStrictEqual([
      'repo-check lint-changed: turbo plans no lint task for the changes since HEAD',
    ]);
    // turbo's own stderr from the plan is replayed, never swallowed.
    expect(harness.errorText).toStrictEqual(['• turbo 2.10.13\n']);
  });

  it("runs turbo lint when the plan holds tasks, and the step's result is the lint's", async () => {
    const harness = lintChangedHarness({
      plan: { stdout: JSON.stringify({ tasks: [{ taskId: '@oaknational/result#lint' }] }) },
      lint: 2,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).resolves.toBe(2);
    expect(harness.lines).toStrictEqual([]);
  });

  it("fails loudly with turbo's own message when the dry run fails", async () => {
    const harness = lintChangedHarness({
      plan: { status: 1, stderr: '  x Could not resolve workspaces.\n' },
      lint: UNREACHABLE_LINT,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(
      'x Could not resolve workspaces.',
    );
  });

  it('fails, naming the warning, when a successful dry run with an empty plan writes one to stderr', async () => {
    // turbo 2.10.13's stderr, verbatim, when TURBO_REMOTE_CACHE_READ_ONLY is
    // set: it exits 0 and prints the warning twice. A green gate prints no
    // warning. The stderr is still replayed first, so nothing turbo said (a
    // one-time telemetry notice included) is lost from a failing run.
    const stderr = `${DEPRECATION_WARNING}\n• turbo 2.10.13\n${DEPRECATION_WARNING}\n`;
    const harness = lintChangedHarness({
      plan: { stdout: JSON.stringify({ packages: ['//'], tasks: [] }), stderr },
      lint: UNREACHABLE_LINT,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(
      'WARNING  TURBO_REMOTE_CACHE_READ_ONLY is deprecated',
    );
    expect(harness.lines).toStrictEqual([]);
    expect(harness.errorText).toStrictEqual([stderr]);
  });

  it('fails before the lint run when the dry run of a planned run writes a warning', async () => {
    const harness = lintChangedHarness({
      plan: {
        stdout: JSON.stringify({ tasks: [{ taskId: '@oaknational/result#lint' }] }),
        stderr: `${DEPRECATION_WARNING}\n`,
      },
      lint: UNREACHABLE_LINT,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/WARNING/u);
  });

  it('names the warning, not the plan, when the dry run also prints no readable plan', async () => {
    const harness = lintChangedHarness({
      plan: { stdout: '', stderr: `${DEPRECATION_WARNING}\n` },
      lint: UNREACHABLE_LINT,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/WARNING/u);
  });

  it('reports a signal-killed dry run by its signal, never as a plan', async () => {
    const harness = lintChangedHarness({
      plan: { status: null, signal: 'SIGKILL' },
      lint: UNREACHABLE_LINT,
    });

    await expect(runLintChanged(harness.runtime, harness.terminal)).rejects.toThrow(/SIGKILL/u);
  });
});
