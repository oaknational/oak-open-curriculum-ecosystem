/**
 * The format and markdown gates: the process edge that runs each tool over
 * git's file universe (`repo-check-universe.ts`), the staged set for the
 * pre-commit hook and the tracked tree for the root gates.
 *
 * @remarks
 * A tracked gate reads the tree through {@link readTrackedTreeResult}, which fails
 * closed: a gate whose git read failed checked nothing, so it fails rather
 * than pass, and a check refuses a tracked file the working tree has lost
 * ({@link planUnlessLost}). Its files run in chunks within the host's
 * {@link argvBudgetBytes}, one run after another, and the gate fails if any
 * chunk fails.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import {
  combinedExitCode,
  globSignificantPaths,
  markdownOnly,
  markdownlintArgs,
  prettierArgs,
  trackedCheckFiles,
  trackedMarkdownlintRuns,
  trackedPrettierRuns,
  type MarkdownlintMode,
  type PrettierMode,
  type TrackedTreeReading,
} from './repo-check-files.js';
import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckRuntime } from './repo-check-types.js';
import { readTrackedTreeResult, stagedFiles } from './repo-check-universe.js';

/** markdownlint over the staged Markdown files (the pre-commit hook). */
export async function runMarkdownlintStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const markdown = markdownOnly(stagedFiles(runtime));
  if (markdown.length === 0) {
    writeLine('repo-check markdownlint-staged: no Markdown files');
    return 0;
  }
  return runtime.runInherited('pnpm', markdownlintArgs('check', markdown));
}

/** prettier over the staged files (the pre-commit hook). */
export async function runPrettierStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedFiles(runtime);
  if (files.length === 0) {
    writeLine('repo-check prettier-staged: no files');
    return 0;
  }
  return runtime.runInherited('pnpm', prettierArgs('check', files));
}

/**
 * The most bytes one run's paths may cost, well under the host's command-line
 * limit: 1 MiB on macOS, shared with the environment, and 32,767 UTF-16 units
 * on Windows, where pnpm launches through the Node binary with no shell. A
 * UTF-8 byte never undercounts a UTF-16 unit, and the Windows budget leaves
 * room for the quotes Node adds around a path holding a space.
 */
function argvBudgetBytes(platform: NodeJS.Platform): number {
  return platform === 'win32' ? 12 * 1024 : 256 * 1024;
}

/** Run each planned `pnpm` argv in order, one after another, collecting each exit status. */
async function runInSequence(
  runtime: RepoCheckRuntime,
  runs: readonly (readonly string[])[],
): Promise<readonly number[]> {
  return runs.reduce<Promise<readonly number[]>>(
    async (prior, args) => [...(await prior), await runtime.runInherited('pnpm', args)],
    Promise.resolve([]),
  );
}

/** A gate's planned `pnpm` runs, or why it refuses to run. */
type GatePlan = Result<readonly (readonly string[])[], string>;

/**
 * The index's regular files the working tree has lost with the change unstaged:
 * deleted, or replaced by a symlink. The index, and so a commit and CI, still
 * carry their content, which the tools read from the disk and cannot see.
 */
export function unstagedLoss(reading: TrackedTreeReading): readonly string[] {
  return [...reading.goneFromWorkingTree].filter((file) => !reading.symlinks.has(file));
}

/** Why a check refuses the tracked files the working tree has lost, naming them and the remedy. */
export function lostFilesRefusal(lost: readonly string[]): string {
  return `these tracked files are deleted or retyped in the working tree with the change unstaged, so the index carries content this check cannot read: ${lost.join(', ')}. Stage the change or restore them.`;
}

/**
 * Plan a gate's runs, unless it is a check over a file it cannot read. A check
 * covers every regular file the index names, each read as the working tree
 * holds it, as every leg of the gate reads the working tree; a named file with
 * nothing to read is refused by name rather than passed without it. A symlink
 * is neither checked nor refused: the tools read a link's target under its
 * real path. A repair proves nothing, so it skips them.
 */
function planUnlessLost(isCheck: boolean, lost: readonly string[], plan: () => GatePlan): GatePlan {
  return isCheck && lost.length > 0 ? err(lostFilesRefusal(lost)) : plan();
}

/** Read the tracked tree, plan the gate's runs over it, and run them. */
async function runTrackedGate(
  runtime: RepoCheckRuntime,
  label: string,
  plan: (reading: TrackedTreeReading) => GatePlan,
): Promise<number> {
  const reading = readTrackedTreeResult(runtime);
  if (!reading.ok) {
    writeErrorLine(`repo-check ${label}: ${reading.error}; the gate checked nothing.`);
    return 1;
  }
  const runs = plan(reading.value);
  if (!runs.ok) {
    writeErrorLine(`repo-check ${label}: ${runs.error}`);
    return 1;
  }
  if (runs.value.length === 0) {
    writeLine(`repo-check ${label}: no files`);
    return 0;
  }
  return combinedExitCode(await runInSequence(runtime, runs.value));
}

/** prettier over every tracked file (the root gate and its repair). */
export async function runPrettierTracked(
  mode: PrettierMode,
  runtime: RepoCheckRuntime = defaultRuntime,
  platform: NodeJS.Platform = process.platform,
): Promise<number> {
  return runTrackedGate(runtime, 'prettier-tracked', (reading) =>
    planUnlessLost(mode === 'check', unstagedLoss(reading), () =>
      ok(trackedPrettierRuns(mode, reading, argvBudgetBytes(platform))),
    ),
  );
}

/**
 * markdownlint over every tracked Markdown file (the root gate and its repair),
 * refusing any path markdownlint-cli2 would read as a glob and skip.
 */
export async function runMarkdownlintTracked(
  mode: MarkdownlintMode,
  runtime: RepoCheckRuntime = defaultRuntime,
  platform: NodeJS.Platform = process.platform,
): Promise<number> {
  return runTrackedGate(runtime, 'markdownlint-tracked', (reading) =>
    planUnlessLost(mode === 'check', markdownOnly(unstagedLoss(reading)), () => {
      const globbed = globSignificantPaths(markdownOnly(trackedCheckFiles(reading)));
      return globbed.length > 0
        ? err(
            `markdownlint-cli2 reads each path as a glob, so these tracked files would be skipped, not linted: ${globbed.join(', ')}`,
          )
        : ok(trackedMarkdownlintRuns(mode, reading, argvBudgetBytes(platform)));
    }),
  );
}
