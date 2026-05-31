#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeLine, writeErrorLine } from '../core/terminal-output.js';

export type {
  RepoCheckCommandResult,
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-profile.js';

export {
  collectProfileEnvironmentEvidence,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  buildCheckProfileArtifact,
  defaultRuntime,
} from './repo-check-profile.js';

import { defaultRuntime, type RepoCheckRuntime } from './repo-check-profile.js';

import { runProfile } from './repo-check-runner.js';

function usage(): string {
  return [
    'Usage: pnpm agent-tools:repo-check <command>',
    '',
    'Commands:',
    '  markdownlint-staged    Run markdownlint on staged Markdown files only.',
    '  prettier-staged        Run Prettier on staged files only.',
    '  profile [--dry-run] [--capture-output]',
    '                         Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
    '                         --capture-output stores pnpm check stdout/stderr beside the profile artifact.',
  ].join('\n');
}

function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const result = runtime.runCaptured('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ]);

  if ((result.status ?? 1) !== 0) {
    throw new Error(result.stderr.trim() || 'git diff failed while discovering staged files');
  }

  return result.stdout
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function stagedMarkdownFiles(runtime: RepoCheckRuntime): readonly string[] {
  return stagedFiles(runtime).filter((entry) => entry.endsWith('.md'));
}

export async function runMarkdownlintStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedMarkdownFiles(runtime);
  if (files.length === 0) {
    writeLine('repo-check markdownlint-staged: no staged Markdown files');
    return 0;
  }
  return runtime.runInherited('pnpm', ['exec', 'markdownlint', '--dot', ...files]);
}

export async function runPrettierStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  const files = stagedFiles(runtime);
  if (files.length === 0) {
    writeLine('repo-check prettier-staged: no staged files');
    return 0;
  }
  return runtime.runInherited('pnpm', [
    'exec',
    'prettier',
    '--check',
    '--ignore-unknown',
    ...files,
  ]);
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'markdownlint-staged') {
    process.exit(await runMarkdownlintStaged());
  }
  if (command === 'prettier-staged') {
    process.exit(await runPrettierStaged());
  }
  if (command === 'profile') {
    process.exit(await runProfile(args));
  }

  writeErrorLine(usage());
  process.exit(1);
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
