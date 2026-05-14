import { execFileSync } from 'node:child_process';

import { runBranchTouchedFilesCli } from '../branch-touched-files/cli.js';
import { runCodexExecCli } from '../codex-exec/cli.js';
import { parseCommitQueueArgs, runCommitQueueCli } from '../commit-queue/index.js';
import { runContextCostCli } from '../context-cost/cli.js';
import type { AgentToolsCliInput, AgentToolsCliResult } from './agent-tools-cli-types.js';

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
    const exitCode = await runCommitQueueCli({
      ...parseCommitQueueArgs(args),
      repoRoot: input.repoRoot ?? resolveRepoRoot(input.cwd),
      readRegistry: input.readCommitQueueRegistry,
      stdout,
    });
    return { exitCode, stdout: stdout.text(), stderr: stderr.text() };
  } catch (error) {
    return {
      exitCode: 2,
      stdout: stdout.text(),
      stderr: `${error instanceof Error ? error.message : String(error)}\n`,
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

function resolveRepoRoot(cwd: string): string {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
