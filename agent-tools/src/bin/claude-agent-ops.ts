#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { detectPhaseFromEvents, resolveDiffCwd } from '../core/agent-ops';
import {
  listAgentShortIds,
  nonEmptyLines,
  readAgentEvents,
  repoRoot,
  resolveAgentJsonlPath,
  runGit,
} from '../core/runtime';
import { writeErrorLine, writeLine } from '../core/terminal-output';
interface CliArgs {
  command:
    | 'status'
    | 'worktrees'
    | 'log'
    | 'diff'
    | 'commit-ready'
    | 'preflight'
    | 'cleanup'
    | 'help';
  agentId: string;
  watch: boolean;
}

function run(): void {
  const args = parseCliArgs(process.argv.slice(2));
  const handlers = createHandlers(args);
  handlers[args.command]();
}
function parseCliArgs(argv: string[]): CliArgs {
  const command = parseCommand(argv[0] ?? 'status');
  return {
    command,
    agentId: argv[1] ?? '',
    watch: argv.includes('--watch') || argv.includes('-w'),
  };
}
function parseCommand(value: string): CliArgs['command'] {
  const commands: Record<string, CliArgs['command']> = {
    status: 'status',
    worktrees: 'worktrees',
    log: 'log',
    diff: 'diff',
    'commit-ready': 'commit-ready',
    preflight: 'preflight',
    cleanup: 'cleanup',
    help: 'help',
    '--help': 'help',
    '-h': 'help',
  };
  const command = commands[value];
  if (command) {
    return command;
  }
  return exitWithError(`Unknown command '${value}'`);
}
function createHandlers(args: CliArgs): Record<CliArgs['command'], () => void> {
  return {
    help: () => printHelp(),
    status: () => printStatus(args.watch),
    worktrees: () => printWorktrees(),
    log: () => printLog(args.agentId),
    diff: () => printDiff(args.agentId),
    'commit-ready': () => printCommitReady(),
    preflight: () => printPreflight(),
    cleanup: () => printCleanup(),
  };
}
function printStatus(watch: boolean): void {
  const root = repoRoot();
  while (true) {
    if (watch) {
      process.stdout.write('\x1Bc');
    }
    const ids = listAgentShortIds(root);
    writeLine('Agent Dashboard');
    if (ids.length === 0) {
      writeLine('No agents found.');
    }
    for (const id of ids) {
      const events = readEvents(root, id);
      const phase = detectPhaseFromEvents(events);
      const worktree = resolveWorktree(root, id) ? 'yes' : 'no';
      writeLine(
        `- ${id} | phase=${phase} | tools=${events.toolNames.length} | worktree=${worktree}`,
      );
    }
    if (!watch) {
      return;
    }
    writeLine('Refreshing in 5s. Ctrl-C to stop.');
    waitMs(5000);
  }
}
function printWorktrees(): void {
  const root = repoRoot();
  const names = listWorktreeNames(root);
  writeLine('Agent Worktrees');
  if (names.length === 0) {
    writeLine('No active worktrees.');
    return;
  }
  for (const name of names) {
    const wtPath = join(root, '.claude', 'worktrees', name);
    const branch = runGit(wtPath, ['branch', '--show-current']) || 'detached';
    const changed = nonEmptyLines(runGit(wtPath, ['status', '--short'])).length;
    writeLine(`- ${name} | branch=${branch} | changed=${changed}`);
  }
}
function printLog(agentId: string): void {
  if (!agentId) {
    exitWithError('Usage: claude-agent-ops log <agent-id>');
  }
  const events = readEvents(repoRoot(), agentId);
  writeLine(`Agent Log: ${agentId}`);
  writeLine(`Phase: ${detectPhaseFromEvents(events)}`);
  writeLine(`Tool calls: ${events.toolNames.length}`);
  const recent = events.toolNames.slice(-15);
  if (recent.length > 0) {
    writeLine('Recent tools:');
    for (const name of recent) {
      writeLine(`- ${name}`);
    }
  }
}
function printDiff(agentId: string): void {
  const root = repoRoot();
  const targetPath = resolveDiffCwd({
    repoRoot: root,
    requestedAgentId: agentId || undefined,
    resolvedWorktreePath: agentId ? resolveWorktree(root, agentId) : null,
  });
  if (agentId && targetPath === root) {
    exitWithError(`No worktree found for agent: ${agentId}`);
  }
  writeLine(runGit(targetPath, ['diff', '--stat']));
  writeLine(
    agentId
      ? runGit(targetPath, ['diff'])
      : runGit(targetPath, ['diff', '--name-only', '--', ':(exclude).claude/worktrees']),
  );
}
function printCommitReady(): void {
  const root = repoRoot();
  const mainChanged = nonEmptyLines(
    runGit(root, ['status', '--short', '--', ':(exclude).claude/worktrees']),
  );
  writeLine(`main working tree changed files: ${mainChanged.length}`);
  for (const name of listWorktreeNames(root)) {
    const changed = nonEmptyLines(
      runGit(join(root, '.claude', 'worktrees', name), ['status', '--short']),
    );
    if (changed.length > 0) {
      writeLine(`- ${name}: ${changed.length} files`);
    }
  }
}
function printPreflight(): void {
  const root = repoRoot();
  const mainChanged = nonEmptyLines(
    runGit(root, ['status', '--short', '--', ':(exclude).claude/worktrees']),
  );
  const worktrees = listWorktreeNames(root).length;
  writeLine(
    mainChanged.length === 0 ? 'PASS Working tree is clean' : 'FAIL Working tree has changes',
  );
  writeLine(
    worktrees === 0 ? 'PASS No leftover agent worktrees' : 'FAIL Leftover agent worktrees found',
  );
  for (const gate of ['build', 'type-check', 'test']) {
    writeLine(runPnpmGate(gate, root) ? `PASS pnpm ${gate}` : `FAIL pnpm ${gate}`);
  }
}
function printCleanup(): void {
  const root = repoRoot();
  let cleaned = 0;
  for (const name of listWorktreeNames(root)) {
    const wtPath = join(root, '.claude', 'worktrees', name);
    const changed = nonEmptyLines(runGit(wtPath, ['status', '--short'])).length;
    if (changed > 0) {
      writeLine(`SKIP ${name} (has changes)`);
      continue;
    }
    runGit(root, ['worktree', 'remove', wtPath, '--force']);
    if (!existsSync(wtPath)) {
      cleaned += 1;
      continue;
    }
    writeLine(`FAIL ${name} (remove unsuccessful)`);
  }
  runGit(root, ['worktree', 'prune']);
  writeLine(`Cleaned ${cleaned} worktrees`);
}
function printHelp(): void {
  writeLine(`claude-agent-ops — CLI for monitoring and managing Claude background agents

Commands:
  status [--watch]
  worktrees
  log <id>
  diff [id]
  commit-ready
  preflight
  cleanup
  help`);
}
function listWorktreeNames(root: string): string[] {
  const worktreePath = join(root, '.claude', 'worktrees');
  return existsSync(worktreePath)
    ? readdirSync(worktreePath)
        .filter((name) => name.startsWith('agent-'))
        .sort()
    : [];
}
function resolveWorktree(root: string, agentId: string): string | null {
  if (!isValidAgentId(agentId)) {
    return null;
  }
  const direct = join(root, '.claude', 'worktrees', `agent-${agentId}`);
  return existsSync(direct) ? direct : null;
}

function isValidAgentId(agentId: string): boolean {
  return /^[0-9a-z]{1,64}$/u.test(agentId);
}
function readEvents(root: string, agentId: string) {
  const jsonlPath = resolveAgentJsonlPath(root, agentId);
  return jsonlPath
    ? readAgentEvents(jsonlPath)
    : { stopReason: '', toolNames: [], bashCommands: [] };
}
function runPnpmGate(gate: string, root: string): boolean {
  return spawnSync('pnpm', [gate], { cwd: root, stdio: 'ignore' }).status === 0;
}
function waitMs(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}
function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}

run();
