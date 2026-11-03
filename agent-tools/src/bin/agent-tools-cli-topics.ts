import { runBranchTouchedFilesCli } from '../branch-touched-files/cli.js';
import { runCodexExecCli } from '../codex-exec/cli.js';
import {
  defaultRunGit,
  resolveCoordinationHome,
} from '../collaboration-state/coordination-home.js';
import {
  parseCommitQueueArgs,
  resolveInvokingGitRoot,
  runCommitQueueCli,
} from '../commit-queue/index.js';
import { runContextCostCli } from '../context-cost/cli.js';
import { runCoordinationCli } from '../coordination/cli.js';
import { repoRoot } from '../core/runtime.js';
import { runMergeBotCli } from '../merge-bot/cli.js';
import { runPrWatchCli } from '../pr-watch/cli.js';
import { runPrStateCli } from '../pr-watch/state-cli.js';
import { runReviewCostCli } from '../review-cost/cli.js';
import { runSessionMetadataCli } from '../session-metadata/cli.js';
import { runSkillEvalsCli, type SkillEvalsCliInput } from '../skill-evals/cli.js';
import { realSkillEvalsSeams } from '../skill-evals/seams.js';
import { runSpawnCli } from '../spawn/cli.js';
import type { AgentToolsCliInput, AgentToolsCliResult } from './agent-tools-cli-types.js';
import { mergeBotPoster } from './merge-bot-poster.js';

export class OutputBuffer {
  readonly #chunks: string[] = [];

  write(chunk: string): boolean {
    this.#chunks.push(chunk);
    return true;
  }

  text(): string {
    return this.#chunks.join('');
  }
}

export async function runCommitQueueTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();

  try {
    // The F-138 two-root split: `repoRoot` anchors the REGISTRY at the
    // coordination home (the primary checkout every linked worktree
    // shares), while `resolveGitRoot` names the INVOKING worktree for all
    // staged reads, verification, and the inner commit. The thunk is lazy
    // so registry-only commands never require a derivable git root, and it
    // fails loudly — never falling back to the coordination home — when
    // one cannot be derived.
    const exitCode = await runCommitQueueCli({
      ...parseCommitQueueArgs(args),
      repoRoot: input.repoRoot ?? resolveCoordinationHome(input.cwd),
      resolveGitRoot: () => resolveInvokingGitRoot(input.cwd),
      readRegistry: input.readCommitQueueRegistry,
      stdout,
      stderr,
    });
    return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
  } catch (error) {
    return {
      exitCode: 2,
      stdout: stdout.text(),
      stderr: `${stderr.text()}${error instanceof Error ? error.message : String(error)}\n`,
    };
  }
}

export function runBranchTouchedFilesTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = runBranchTouchedFilesCli({
    args,
    cwd: input.cwd,
    repoRoot: input.repoRoot,
    stdout,
    stderr,
  });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

export async function runContextCostTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  return runContextCostCli({
    argv: args,
    cwd: input.cwd,
    stdout,
    stderr,
  });
}

export function runCoordinationTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = runCoordinationCli({ args, cwd: input.cwd, stdout, stderr });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

export async function runSessionMetadataTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  return runSessionMetadataCli({
    argv: args,
    cwd: input.cwd,
    env: input.env,
    stdout,
    stderr,
  });
}

export async function runCodexExecTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();

  const normalised = args[0] === '--' ? args.slice(1) : args;
  const [command, ...rest] = normalised;
  const exitCode = await runCodexExecCli({
    command,
    args: rest,
    stdin: input.stdin ?? process.stdin,
    stdout,
    stderr,
  });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

export async function runPrWatchTopic(
  _input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = await runPrWatchCli({ args, stdout, stderr });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

export function runReviewCostTopic(
  _input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = runReviewCostCli({ args, stdout, stderr });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

/**
 * `skill-evals` runs against the INVOKING worktree: the skill under
 * evaluation is the checked-out one, never the coordination home's copy.
 */
export function runSkillEvalsTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  try {
    const cliInput: SkillEvalsCliInput = {
      args,
      repoRoot: input.repoRoot ?? resolveInvokingGitRoot(input.cwd),
      stdout,
      stderr,
      seams: realSkillEvalsSeams(),
    };
    const exitCode = runSkillEvalsCli(cliInput);
    return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { exitCode: 1, stdout: stdout.text(), stderr: `${stderr.text()}${message}\n` };
  }
}

export function runPrTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = runPrStateCli({ args, stdout, stderr, poster: () => mergeBotPoster(input) });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}

export async function runMergeBotTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): Promise<AgentToolsCliResult> {
  // A caller-supplied live stdout streams mid-run (the merge poll emits
  // progress lines); the buffer serves callers without one. Text travels
  // through exactly ONE of the two — the bin edge prints result.stdout after
  // the run, so returning buffered text AND writing live would double-print.
  const buffer = new OutputBuffer();
  const stdout = input.stdout ?? buffer;
  const stderr = new OutputBuffer();
  // The INVOKING repo's root is the cwd every git call runs in, and the
  // start point from which the per-checkout authority file is resolved to
  // the clone's primary checkout (resolve-identity.ts) — a subdirectory
  // invocation must still find it, and a cwd inside another repo must
  // resolve THAT repo deliberately, never accidentally.
  let root: string;
  try {
    root = input.repoRoot ?? repoRoot();
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return { exitCode: 2, stdout: '', stderr: `merge-bot: ${message}\n` };
  }
  const exitCode = await runMergeBotCli({
    args,
    env: input.env,
    repoRoot: root,
    runGitImpl: defaultRunGit,
    stdout,
    stderr,
  });
  return { exitCode, stdout: buffer.text(), stderr: stderr.text() };
}

export function runSpawnTopic(
  input: AgentToolsCliInput,
  args: readonly string[],
): AgentToolsCliResult {
  const stdout = new OutputBuffer();
  const stderr = new OutputBuffer();
  const exitCode = runSpawnCli({ args, cwd: input.cwd, stdout, stderr });
  return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
}
