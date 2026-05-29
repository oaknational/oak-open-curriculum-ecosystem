#!/usr/bin/env node
/**
 * Claude Code statusline adapter.
 *
 * @remarks
 * Reads the JSON object Claude Code passes on stdin and prints a single
 * statusline of the form:
 *
 * ```text
 * <agent-identity> ➜ <dir> git:(<branch>) [✗] [wt:(<worktree>)] ctx:N% [model]
 * ```
 *
 * The agent-identity name (PDR-027) is produced by the built `agent-identity`
 * CLI at `agent-tools/dist/src/bin/agent-identity.js`. Git branch, dirty state,
 * and linked-worktree name are gathered from the working directory in the
 * payload. Formatting is delegated to the pure {@link renderStatusline}.
 *
 * The statusline is a soft surface: missing input, missing build artefact, or
 * any spawn failure degrades the affected segment to empty rather than
 * disrupting the session.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { planStatuslineExecution, type StatuslinePlan } from './statusline-identity-input.js';
import { renderStatusline } from './statusline-render.js';

const builtIdentityCliPath = resolveBuiltIdentityCliPath();

let stdinBuffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  stdinBuffer += chunk;
});
process.stdin.on('end', () => {
  emitStatusline(stdinBuffer);
});

function emitStatusline(rawJson: string): void {
  const plan: StatuslinePlan = planStatuslineExecution(rawJson);
  if (plan.kind === 'noop') {
    return;
  }

  const cwd = plan.inputs.cwd ?? process.cwd();
  const git = gatherGitState(cwd);

  const line = renderStatusline({
    identity: deriveIdentity(plan.inputs.seed),
    dir: basename(cwd),
    branch: git.branch,
    dirty: git.dirty,
    worktree: git.worktree,
    usedPercentage: plan.inputs.usedPercentage,
    model: plan.inputs.model,
  });

  process.stdout.write(line);
}

function deriveIdentity(seed: string | undefined): string | undefined {
  if (seed === undefined || !existsSync(builtIdentityCliPath)) {
    return undefined;
  }
  const result = spawnSync(
    process.execPath,
    [builtIdentityCliPath, '--seed', seed, '--format', 'display'],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    return undefined;
  }
  const name = result.stdout.trim();
  return name.length === 0 ? undefined : name;
}

interface GitState {
  readonly branch: string | undefined;
  readonly dirty: boolean;
  readonly worktree: string | undefined;
}

function gatherGitState(cwd: string): GitState {
  const branch =
    runGit(cwd, ['symbolic-ref', '--short', 'HEAD']) ??
    runGit(cwd, ['rev-parse', '--short', 'HEAD']);
  if (branch === undefined) {
    return { branch: undefined, dirty: false, worktree: undefined };
  }

  const dirty = (runGit(cwd, ['status', '--porcelain']) ?? '').length > 0;

  // In the main tree --git-dir and --git-common-dir are equal; in a linked
  // worktree they differ (.../.git/worktrees/<name> vs .../.git).
  const gitDir = runGit(cwd, ['rev-parse', '--git-dir']);
  const commonDir = runGit(cwd, ['rev-parse', '--git-common-dir']);
  const topLevel = runGit(cwd, ['rev-parse', '--show-toplevel']);
  const worktree =
    gitDir !== undefined && gitDir !== commonDir && topLevel !== undefined
      ? basename(topLevel)
      : undefined;

  return { branch, dirty, worktree };
}

function runGit(cwd: string, args: readonly string[]): string | undefined {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    return undefined;
  }
  const out = result.stdout.trim();
  return out.length === 0 ? undefined : out;
}

function resolveBuiltIdentityCliPath(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDir, '..', 'bin', 'agent-identity.js');
}
