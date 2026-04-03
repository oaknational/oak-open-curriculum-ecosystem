#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  HELP_TEXT,
  parseCliArgs,
  type CliArgs,
  type CliCommand,
  type CliHandler,
} from './claude-agent-ops-cli';
import { detectPhaseFromEvents, resolveDiffCwd } from '../core/agent-ops';
import {
  evaluateAgentInfrastructureHealth,
  formatAgentInfrastructureHealthReport,
} from '../core/health-probe';
import {
  listAgentShortIds,
  nonEmptyLines,
  readAgentEvents,
  repoRoot,
  resolveAgentJsonlPath,
  runGit,
} from '../core/runtime';
import { writeErrorLine, writeLine } from '../core/terminal-output';
async function run(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const handlers = createHandlers(args);
  await handlers[args.command]();
}
function createHandlers(args: CliArgs): Record<CliCommand, CliHandler> {
  return {
    help: () => printHelp(),
    status: () => printStatus(args.watch),
    health: () => printHealth(),
    worktrees: () => printWorktrees(),
    log: () => printLog(args.agentId),
    diff: () => printDiff(args.agentId),
    'commit-ready': () => printCommitReady(),
    preflight: () => printPreflight(),
    cleanup: () => printCleanup(),
  };
}
async function printStatus(watch: boolean): Promise<void> {
  const root = repoRoot();
  const homePath = resolveHomePath();
  if (!watch) {
    printStatusSnapshot(root, homePath, watch);
    return;
  }
  let keepRefreshing = true;
  const stopRefreshing = () => {
    keepRefreshing = false;
  };
  process.once('SIGINT', stopRefreshing);
  try {
    while (keepRefreshing) {
      printStatusSnapshot(root, homePath, watch);
      writeLine('Refreshing in 5s. Ctrl-C to stop.');
      await waitMs(5000);
    }
  } finally {
    process.removeListener('SIGINT', stopRefreshing);
  }
}

function printStatusSnapshot(root: string, homePath: string, watch: boolean): void {
  if (watch) {
    process.stdout.write('\x1Bc');
  }
  const ids = listAgentShortIds(root, homePath);
  writeLine('Agent Dashboard');
  if (ids.length === 0) {
    writeLine('No agents found.');
  }
  for (const id of ids) {
    const events = readEvents(root, id);
    const phase = detectPhaseFromEvents(events);
    const worktree = resolveWorktree(root, id) ? 'yes' : 'no';
    writeLine(`- ${id} | phase=${phase} | tools=${events.toolNames.length} | worktree=${worktree}`);
  }
}
function printHealth(): void {
  const report = evaluateAgentInfrastructureHealth(repoRoot());
  writeLine(formatAgentInfrastructureHealthReport(report));
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
  writeLine(runPnpmGate('qg', root) ? 'PASS pnpm qg' : 'FAIL pnpm qg');
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
  writeLine(HELP_TEXT);
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
  const jsonlPath = resolveAgentJsonlPath(root, agentId, resolveHomePath());
  return jsonlPath
    ? readAgentEvents(jsonlPath)
    : { stopReason: '', toolNames: [], bashCommands: [] };
}
function resolveHomePath(): string {
  return process.env.HOME && process.env.HOME.length > 0
    ? process.env.HOME
    : exitWithError('Missing HOME environment variable');
}
function runPnpmGate(gate: string, root: string): boolean {
  return spawnSync('pnpm', [gate], { cwd: root, stdio: 'ignore' }).status === 0;
}
function waitMs(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}
run().catch((error: unknown) => {
  writeErrorLine(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
